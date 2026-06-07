import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TbPlus, TbLoader2, TbMinus } from "react-icons/tb";
import {
  obtenerInventario,
  obtenerCategorias,
  actualizarStock,
  actualizarProducto,
} from "../../services/adminService";
import ModalAgregarProducto from "./modal/ModalAgregarProducto";
import ModalDetalleProducto from "./modal/ModalDetalleProducto";

const descargarCSV = (productos) => {
  if (!productos.length) return;

  const encabezados = [
    "Nombre",
    "Categoría",
    "Precio (COP)",
    "Stock",
    "Estado",
  ];

  const filas = productos.map((p) => [
    p.nombre,
    p.categoriaNombreRef || p.categoria?.nombre || "Sin categoría",
    p.precio,
    p.stock,
    p.stock === 0 ? "Crítico" : p.stock <= 5 ? "Bajo" : "Normal",
  ]);

  const csv = [encabezados, ...filas]
    .map((fila) =>
      fila
        .map((celda) => `"${String(celda ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `inventario-${new Date().toISOString().slice(0, 10)}.csv`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const InventarioView = () => {
  const [inventario, setInventario] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [localStocks, setLocalStocks] = useState({});
  const [localPrecios, setLocalPrecios] = useState({});
  const [savingInline, setSavingInline] = useState({});

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [inventarioRes, categoriasRes] = await Promise.all([
        obtenerInventario(),
        obtenerCategorias(),
      ]);
      setInventario(inventarioRes.inventario);
      setCategorias(categoriasRes.categorias || []);
      setLocalStocks({});
      setLocalPrecios({});
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const getProductoId = (p) => (p?.id || p?._id)?.toString();

  const handleUpdateStock = async (productoId, nuevoStock) => {
    if (nuevoStock < 0) return;
    const key = `stock_${productoId}`;
    setSavingInline((prev) => ({ ...prev, [key]: true }));
    try {
      await actualizarStock(productoId, nuevoStock);
      setInventario((prev) => ({
        ...prev,
        productos: prev.productos.map((p) =>
          getProductoId(p) === productoId ? { ...p, stock: nuevoStock } : p,
        ),
      }));
      setLocalStocks((prev) => {
        const next = { ...prev };
        delete next[productoId];
        return next;
      });
    } catch (error) {
      toast.error("Error al actualizar stock", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setSavingInline((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSaveStock = (producto) => {
    const id = getProductoId(producto);
    if (localStocks[id] === undefined) return;

    const nuevoStock = Number(localStocks[id]);

    if (isNaN(nuevoStock) || nuevoStock < 0) {
      toast.error("Stock inválido", {
        description: "Ingresa un número mayor o igual a 0.",
      });
      setLocalStocks((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    if (nuevoStock === producto.stock) {
      setLocalStocks((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    handleUpdateStock(id, nuevoStock);
  };

  const handleSavePrecio = async (producto) => {
    const id = getProductoId(producto);
    if (localPrecios[id] === undefined) return;

    const nuevoPrecio = Number(localPrecios[id]);

    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      toast.error("Precio inválido", {
        description: "Ingresa un precio mayor a 0.",
      });
      setLocalPrecios((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    if (nuevoPrecio === producto.precio) {
      setLocalPrecios((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    const key = `precio_${id}`;
    setSavingInline((prev) => ({ ...prev, [key]: true }));
    try {
      await actualizarProducto(id, { precio: nuevoPrecio });
      setInventario((prev) => ({
        ...prev,
        productos: prev.productos.map((p) =>
          getProductoId(p) === id ? { ...p, precio: nuevoPrecio } : p,
        ),
      }));
      setLocalPrecios((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success("Precio actualizado");
    } catch (error) {
      toast.error("Error al actualizar precio", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setSavingInline((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSaveCategoria = async (producto, nuevaCategoriaId) => {
    if (!nuevaCategoriaId) return;
    const id = getProductoId(producto);
    const key = `cat_${id}`;
    setSavingInline((prev) => ({ ...prev, [key]: true }));
    try {
      await actualizarProducto(id, { categoria: nuevaCategoriaId });
      const nuevaCat = categorias.find(
        (c) => c._id?.toString() === nuevaCategoriaId,
      );
      setInventario((prev) => ({
        ...prev,
        productos: prev.productos.map((p) =>
          getProductoId(p) === id
            ? {
                ...p,
                categoria: nuevaCat
                  ? { _id: nuevaCat._id, nombre: nuevaCat.nombre }
                  : p.categoria,
                categoriaNombreRef: nuevaCat?.nombre || p.categoriaNombreRef,
              }
            : p,
        ),
      }));
      toast.success("Categoría actualizada");
    } catch (error) {
      toast.error("Error al actualizar categoría", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setSavingInline((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  if (loading)
    return <p className="text-gray-400 text-sm">Cargando inventario...</p>;
  if (!inventario)
    return (
      <p className="text-gray-400 text-sm">No se pudo cargar el inventario.</p>
    );

  const productosProcesados = (inventario.productos || []).map((prod) => ({
    ...prod,
    categoriaNombreRef:
      prod.categoriaNombreRef ||
      prod.categoria?.nombre ||
      "Categoría desconocida",
  }));

  const productosFiltrados =
    filterCategoria === "todos"
      ? productosProcesados
      : productosProcesados.filter(
          (p) => p.categoriaNombreRef === filterCategoria,
        );

  const totalProductosLista = productosProcesados.length;
  const distribucionCategorias = categorias.map((cat) => {
    const conteo = productosProcesados.filter(
      (p) => p.categoriaNombreRef === cat.nombre,
    ).length;
    const porcentaje =
      totalProductosLista > 0 ? (conteo / totalProductosLista) * 100 : 0;
    return { categoria: cat.nombre, count: conteo, pct: porcentaje };
  });

  const conteoSinCategoria = productosProcesados.filter(
    (p) => p.categoriaNombreRef === "Categoría desconocida",
  ).length;
  if (conteoSinCategoria > 0) {
    distribucionCategorias.push({
      categoria: "Sin Categoría",
      count: conteoSinCategoria,
      pct:
        totalProductosLista > 0
          ? (conteoSinCategoria / totalProductosLista) * 100
          : 0,
    });
  }
  const distribucionFinal = distribucionCategorias.filter((c) => c.count > 0);

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Total productos
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {inventario.totalProductos}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            En catálogo
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Stock total
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {inventario.stockTotal}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Unidades
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-red-500/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Stock bajo
          </div>
          <div className="font-poppins font-bold text-2xl text-red-400">
            {inventario.stockBajo}
          </div>
          <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider mt-2.5">
            Requieren reorden
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Valor inventario
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            ${(inventario.valorInventario / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Costo total
          </div>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Control de inventario
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-[#232632] text-white focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              <option value="todos">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <button
              onClick={() => descargarCSV(productosFiltrados)}
              disabled={!productosFiltrados.length}
              className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-green/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider cursor-pointer"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Descargar Excel
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer"
            >
              <TbPlus size={14} />
              Agregar producto
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
                <th className="text-left pb-2 font-bold tracking-wider">
                  Producto
                </th>
                <th className="text-left pb-2 font-bold tracking-wider">
                  Categoría
                </th>
                <th className="text-right pb-2 font-bold tracking-wider pr-4">
                  Precio
                </th>
                <th className="text-center pb-2 font-bold tracking-wider">
                  Stock
                </th>
                <th className="text-right pb-2 font-bold tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                const id = getProductoId(producto);
                const stockDisplayVal =
                  localStocks[id] !== undefined
                    ? localStocks[id]
                    : producto.stock;
                const precioDisplayVal =
                  localPrecios[id] !== undefined
                    ? localPrecios[id]
                    : producto.precio;
                const savingStock = !!savingInline[`stock_${id}`];
                const savingPrecio = !!savingInline[`precio_${id}`];
                const savingCat = !!savingInline[`cat_${id}`];
                const categoriaActualId =
                  producto.categoria?._id?.toString() || "";

                return (
                  <tr
                    key={id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Nombre clickeable → abre modal de edición */}
                    <td className="py-3 pr-4 max-w-[200px]">
                      <button
                        onClick={() => setProductoSeleccionado(producto)}
                        className="font-semibold text-white hover:text-accent-purple transition-colors text-left cursor-pointer bg-transparent border-none p-0 underline-offset-2 hover:underline truncate block w-full"
                        title={`Editar: ${producto.nombre}`}
                      >
                        {producto.nombre}
                      </button>
                    </td>

                    {/* Categoría: select inline */}
                    <td className="py-3 pr-4">
                      <div className="relative flex items-center gap-1.5">
                        <select
                          value={categoriaActualId}
                          onChange={(e) =>
                            handleSaveCategoria(producto, e.target.value)
                          }
                          disabled={savingCat}
                          className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-[#13151b] text-gray-300 focus:outline-none focus:border-accent-blue cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:border-accent-blue/40 max-w-[130px]"
                        >
                          <option value="">Sin categoría</option>
                          {categorias.map((cat) => (
                            <option key={cat._id} value={cat._id?.toString()}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                        {savingCat && (
                          <TbLoader2
                            size={11}
                            className="animate-spin text-accent-blue flex-shrink-0"
                          />
                        )}
                      </div>
                    </td>

                    {/* Precio: input editable */}
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-gray-500 text-[10px]">$</span>
                        <input
                          type="number"
                          min="1"
                          value={precioDisplayVal}
                          onChange={(e) =>
                            setLocalPrecios((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          onBlur={() => handleSavePrecio(producto)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.target.blur();
                            if (e.key === "Escape") {
                              setLocalPrecios((prev) => {
                                const next = { ...prev };
                                delete next[id];
                                return next;
                              });
                              e.target.blur();
                            }
                          }}
                          disabled={savingPrecio}
                          className="w-24 text-right font-bold text-white text-xs py-1 px-1.5 rounded-md border border-transparent bg-transparent focus:outline-none focus:border-accent-blue focus:bg-[#13151b] hover:border-white/10 hover:bg-[#13151b] disabled:opacity-50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {savingPrecio && (
                          <TbLoader2
                            size={11}
                            className="animate-spin text-accent-blue flex-shrink-0"
                          />
                        )}
                      </div>
                    </td>

                    {/* Stock: input + botones */}
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            handleUpdateStock(id, producto.stock - 1)
                          }
                          disabled={producto.stock <= 0 || savingStock}
                          className="w-6 h-6 rounded-md border border-white/10 bg-[#13151b] text-gray-400 hover:text-white hover:border-accent-blue transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Disminuir stock"
                        >
                          <TbMinus size={12} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={stockDisplayVal}
                          onChange={(e) =>
                            setLocalStocks((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          onBlur={() => handleSaveStock(producto)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.target.blur();
                            if (e.key === "Escape") {
                              setLocalStocks((prev) => {
                                const next = { ...prev };
                                delete next[id];
                                return next;
                              });
                              e.target.blur();
                            }
                          }}
                          disabled={savingStock}
                          className="w-12 text-center font-semibold text-white text-xs py-1 px-1 rounded-md border border-white/10 bg-[#13151b] focus:outline-none focus:border-accent-blue transition-all disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label="Cantidad en stock"
                        />
                        <button
                          onClick={() =>
                            handleUpdateStock(id, producto.stock + 1)
                          }
                          disabled={savingStock}
                          className="w-6 h-6 rounded-md border border-white/10 bg-[#13151b] text-gray-400 hover:text-white hover:border-accent-blue transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Aumentar stock"
                        >
                          <TbPlus size={12} />
                        </button>
                        {savingStock && (
                          <TbLoader2
                            size={11}
                            className="animate-spin text-accent-blue"
                          />
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 text-right">
                      <span
                        className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          producto.stock === 0
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : producto.stock <= 5
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-accent-green/10 text-accent-green border-accent-green/20"
                        }`}
                      >
                        {producto.stock === 0
                          ? "Crítico"
                          : producto.stock <= 5
                            ? "Bajo"
                            : "Normal"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {productosFiltrados.length === 0 && (
            <p className="text-center text-gray-500 text-xs py-8 italic">
              No hay productos para esta categoría.
            </p>
          )}
        </div>
      </div>

      {/* Distribución por categorías */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Distribución por categoría
        </div>
        <div className="space-y-4">
          {distribucionFinal.map(({ categoria, count, pct }) => (
            <div key={categoria} className="flex items-center gap-4">
              <div className="text-xs font-semibold text-gray-300 w-24 truncate">
                {categoria}
              </div>
              <div className="flex-1 h-2 bg-[#13151b] rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-accent-blue rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(126,195,230,0.5)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs font-bold text-gray-400 w-16 text-right">
                {count} ({pct.toFixed(0)}%)
              </div>
            </div>
          ))}
          {distribucionFinal.length === 0 && (
            <p className="text-xs text-gray-500 italic">
              No hay datos de distribución disponibles.
            </p>
          )}
        </div>
      </div>

      {/* Modal: Editar producto */}
      {productoSeleccionado && (
        <ModalDetalleProducto
          productoResumen={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          onSuccess={cargarDatos}
          listaCategorias={categorias}
        />
      )}

      {/* Modal: Agregar producto */}
      {showModal && (
        <ModalAgregarProducto
          onClose={() => setShowModal(false)}
          onSuccess={cargarDatos}
          listaCategorias={categorias}
        />
      )}
    </div>
  );
};

export default InventarioView;
