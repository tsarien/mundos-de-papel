import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TbPlus,
  TbX,
  TbPhoto,
  TbDeviceFloppy,
  TbLoader2,
} from "react-icons/tb";
import {
  obtenerInventario,
  obtenerCategorias,
  crearProducto,
  subirImagenProducto,
} from "../../services/adminService";

// ─── Campo reutilizable para el modal ────────────────────────────────────────
const FieldModal = ({ label, error, children, full = false }) => (
  <div className={`flex flex-col gap-1.5 ${full ? "col-span-full" : ""}`}>
    <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">
      {label}
    </span>
    {children}
    {error && (
      <span className="text-red-400 text-[10px] mt-0.5">{error.message}</span>
    )}
  </div>
);

const inputCls =
  "py-2 px-3 rounded-lg border border-white/10 bg-[#13151b] text-white text-xs focus:outline-none focus:border-accent-blue transition-colors";

// ─── Modal Agregar Producto ───────────────────────────────────────────────────
const ModalAgregarProducto = ({ onClose, onSuccess, listaCategorias }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idioma: "Español España",
      presentacion: "Tapa Blanda",
      stock: 0,
      descuento: 0,
      enOferta: false,
      destacado: false,
    },
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const enOferta = watch("enOferta");

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      const result = await crearProducto({
        ...data,
        precio: Number(data.precio),
        paginas: Number(data.paginas),
        stock: Number(data.stock),
        descuento: Number(data.descuento),
      });

      if (imagenFile && result.producto?._id) {
        await subirImagenProducto(result.producto._id, imagenFile);
      }

      toast.success("Producto creado", {
        description: `"${data.nombre}" fue agregado al inventario.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al crear producto", {
        description:
          error.response?.data?.mensaje ||
          error.response?.data?.errores?.[0]?.msg ||
          "Inténtalo de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl w-full max-w-2xl border border-white/10 text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <h2 className="font-poppins text-lg font-bold text-accent-blue">
            Agregar producto
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>

        {/* Formulario */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form
            id="form-producto"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <FieldModal label="Nombre *" error={errors.nombre} full>
              <input
                type="text"
                placeholder="Ej. Dragon Ball Z Vol. 1"
                {...register("nombre", { required: "El nombre es requerido" })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Autor *" error={errors.autor}>
              <input
                type="text"
                placeholder="Ej. Akira Toriyama"
                {...register("autor", { required: "El autor es requerido" })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Editorial *" error={errors.editorial}>
              <input
                type="text"
                placeholder="Ej. Planeta Cómic"
                {...register("editorial", {
                  required: "La editorial es requerida",
                })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Categoría *" error={errors.categoria}>
              <select
                {...register("categoria", {
                  required: "La categoría es requerida",
                })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Selecciona una categoría</option>
                {listaCategorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </FieldModal>

            <FieldModal label="Precio (COP) *" error={errors.precio}>
              <input
                type="number"
                min="0"
                placeholder="Ej. 45000"
                {...register("precio", {
                  required: "El precio es requerido",
                  min: { value: 0, message: "Debe ser mayor a 0" },
                })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Páginas *" error={errors.paginas}>
              <input
                type="number"
                min="1"
                placeholder="Ej. 192"
                {...register("paginas", {
                  required: "Las páginas son requeridas",
                  min: { value: 1, message: "Mínimo 1 página" },
                })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Stock *" error={errors.stock}>
              <input
                type="number"
                min="0"
                placeholder="Ej. 25"
                {...register("stock", {
                  required: "El stock es requerido",
                  min: { value: 0, message: "No puede ser negativo" },
                })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Idioma" error={errors.idioma}>
              <input
                type="text"
                placeholder="Español España"
                {...register("idioma")}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Presentación" error={errors.presentacion}>
              <select
                {...register("presentacion")}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="Tapa Blanda">Tapa Blanda</option>
                <option value="Tapa Dura">Tapa Dura</option>
                <option value="Digital">Digital</option>
              </select>
            </FieldModal>

            <FieldModal label="Descripción *" error={errors.descripcion} full>
              <textarea
                rows={3}
                placeholder="Descripción breve del producto..."
                {...register("descripcion", {
                  required: "La descripción es requerida",
                  maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
                })}
                className={`${inputCls} resize-none`}
              />
            </FieldModal>

            <FieldModal label="Descripción completa" full>
              <textarea
                rows={3}
                placeholder="Descripción extendida (opcional)..."
                {...register("descripcionCompleta")}
                className={`${inputCls} resize-none`}
              />
            </FieldModal>

            <FieldModal label="Imagen del producto" full>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg border border-dashed border-white/20 bg-[#13151b] text-xs text-gray-400 group-hover:border-accent-blue/50 group-hover:text-accent-blue transition-all flex-1">
                  <TbPhoto size={16} />
                  {imagenFile ? imagenFile.name : "Seleccionar imagen..."}
                </div>
                {imagenPreview && (
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="w-12 h-16 object-contain rounded-lg border border-white/10 bg-[#232632]"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  className="hidden"
                />
              </label>
            </FieldModal>

            <FieldModal label="Opciones" full>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    {...register("enOferta")}
                    className="accent-accent-blue w-3.5 h-3.5 cursor-pointer"
                  />
                  En oferta
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    {...register("destacado")}
                    className="accent-accent-purple w-3.5 h-3.5 cursor-pointer"
                  />
                  Producto destacado
                </label>
              </div>
            </FieldModal>

            {enOferta && (
              <FieldModal label="Descuento (%)" error={errors.descuento}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ej. 15"
                  {...register("descuento", {
                    min: { value: 0, message: "Mínimo 0%" },
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  className={inputCls}
                />
              </FieldModal>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={enviando}
            className="text-xs font-bold px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer bg-transparent"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-producto"
            disabled={enviando}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer"
          >
            {enviando ? (
              <>
                <TbLoader2 size={14} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <TbDeviceFloppy size={14} />
                Agregar producto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Vista de Inventario ──────────────────────────────────────────────────────
const InventarioView = () => {
  const [inventario, setInventario] = useState(null);
  const [categorias, setCategorias] = useState([]); // Guardará la lista de categorías reales de la DB
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Cargar datos conjuntos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [inventarioRes, categoriasRes] = await Promise.all([
        obtenerInventario(),
        obtenerCategorias(),
      ]);
      setInventario(inventarioRes.inventario);
      setCategorias(categoriasRes.categorias || []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading)
    return <p className="text-gray-400 text-sm">Cargando inventario...</p>;
  if (!inventario)
    return (
      <p className="text-gray-400 text-sm">No se pudo cargar el inventario.</p>
    );

  // CORRECCIÓN FRONTERA: Enlazar dinámicamente el id con el nombre real de la categoría
  const productosProcesados = (inventario.productos || []).map((prod) => {
    let nombreCat = "Sin Categoría";

    if (prod.categoria?.nombre) {
      nombreCat = prod.categoria.nombre;
    } else if (typeof prod.categoria === "string") {
      const catEncontrada = categorias.find((c) => c._id === prod.categoria);
      if (catEncontrada) nombreCat = catEncontrada.nombre;
    }

    return {
      ...prod,
      categoriaNombreRef: nombreCat,
    };
  });

  // Filtrado optimizado por nombre de la categoría
  const productosFiltrados =
    filterCategoria === "todos"
      ? productosProcesados
      : productosProcesados.filter(
          (p) => p.categoriaNombreRef === filterCategoria,
        );

  // RECALCULO DE DISTRIBUCIÓN: Si el backend falla calculando las barras, las generamos dinámicamente a tiempo real
  const totalProductosLista = productosProcesados.length;
  
  // 1. Mapeamos las categorías oficiales de la BD
  const distribucionCategorias = categorias.map((cat) => {
    const conteo = productosProcesados.filter((p) => p.categoriaNombreRef === cat.nombre).length;
    const porcentaje = totalProductosLista > 0 ? (conteo / totalProductosLista) * 100 : 0;
    return { categoria: cat.nombre, count: conteo, pct: porcentaje };
  });

  // 2. Verificamos si hay productos bajo el rótulo "Sin Categoría" para añadir su barra correspondiente
  const conteoSinCategoria = productosProcesados.filter((p) => p.categoriaNombreRef === "Sin Categoría").length;
  if (conteoSinCategoria > 0) {
    distribucionCategorias.push({
      categoria: "Sin Categoría",
      count: conteoSinCategoria,
      pct: totalProductosLista > 0 ? (conteoSinCategoria / totalProductosLista) * 100 : 0
    });
  }

  // 3. Filtramos solo las categorías que tienen por lo menos un producto asignado
  const distribucionFinal = distribucionCategorias.filter((c) => c.count > 0);

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* KPIs / Tarjetas de estado */}
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

      {/* Tabla de Control de Inventario */}
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
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer"
            >
              <TbPlus size={14} />
              Agregar producto
            </button>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">
                Producto
              </th>
              <th className="text-left pb-2 font-bold tracking-wider">
                Categoría
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Precio
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Stock
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr
                key={producto._id || producto.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5">
                  <div className="font-semibold text-white">
                    {producto.nombre}
                  </div>
                </td>
                <td className="py-2.5 text-gray-300">
                  {producto.categoriaNombreRef}
                </td>
                <td className="py-2.5 text-right font-bold text-white">
                  ${producto.precio.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {producto.stock}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      producto.stock <= 5
                        ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        : "bg-accent-green/10 text-accent-green border border-accent-green/20"
                    }`}
                  >
                    {producto.stock <= 5 ? "Bajo" : "Normal"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribución por categorías (CORREGIDA Y COMPLETAMENTE DINÁMICA) */}
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

      {/* Modal agregar producto */}
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