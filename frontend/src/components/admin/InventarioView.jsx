import { useState, useEffect } from "react";
import { obtenerInventario } from "../../services/adminService";

const InventarioView = () => {
  const [inventario, setInventario] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerInventario();
        setInventario(data.inventario);
      } catch {
        setInventario(null);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Cargando inventario...</p>;
  }

  if (!inventario) {
    return (
      <p className="text-gray-400 text-sm">No se pudo cargar el inventario.</p>
    );
  }

  const productosFiltrados =
    filterCategoria === "todos"
      ? inventario.productos
      : inventario.productos.filter((p) => p.categoria === filterCategoria);

  return (
    <div className="flex flex-col gap-5 text-white">
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

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Control de inventario
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-[#232632] text-white focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              <option value="todos" className="bg-[#232632] text-white">
                Todas las categorías
              </option>
              <option value="Manga" className="bg-[#232632] text-white">
                Manga
              </option>
              <option value="Cómic" className="bg-[#232632] text-white">
                Cómic
              </option>
              <option value="Arte" className="bg-[#232632] text-white">
                Arte
              </option>
            </select>
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
                key={producto.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5">
                  <div className="font-semibold text-white">
                    {producto.nombre}
                  </div>
                </td>
                <td className="py-2.5 text-gray-300">
                  {producto.categoria?.nombre || "Categoría"}
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
                      producto.estado === "ok"
                        ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                        : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    }`}
                  >
                    {producto.estado === "ok" ? "Normal" : "Bajo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Distribución por categoría
        </div>
        <div className="space-y-4">
          {inventario.categorias.map(({ categoria, count, pct }) => (
            <div key={categoria} className="flex items-center gap-4">
              <div className="text-xs font-semibold text-gray-300 w-16">
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
        </div>
      </div>
    </div>
  );
};

export default InventarioView;
