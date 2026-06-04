import { formatearFecha } from "../../utils/formatters.js";
import { useState, useEffect } from "react";
import { obtenerProveedores } from "../../services/adminService";

const ProveedoresView = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerProveedores();
        setProveedores(data.proveedores || []);
      } catch {
        setProveedores([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Cargando proveedores...</p>;
  }

  const activos = proveedores.filter((p) => p.estado === "activo").length;
  const pendientes = proveedores.filter((p) => p.estado === "pendiente").length;
  const totalProductos = proveedores.reduce((acc, p) => acc + p.productos, 0);

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Total proveedores
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {proveedores.length}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Registrados
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Proveedores activos
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {activos}
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            Con pedidos recientes
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Productos totales
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {totalProductos}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            En catálogo
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-red-500/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Pedidos pendientes
          </div>
          <div className="font-poppins font-bold text-2xl text-red-400">
            {pendientes}
          </div>
          <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider mt-2.5">
            Por confirmar
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Directorio de proveedores
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">
                Proveedor
              </th>
              <th className="text-left pb-2 font-bold tracking-wider">
                Contacto
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Productos
              </th>
              <th className="text-left pb-2 font-bold tracking-wider">
                Último pedido
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr
                key={proveedor._id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5">
                  <div className="font-semibold text-white">
                    {proveedor.nombre}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {proveedor.telefono}
                  </div>
                </td>
                <td className="py-2.5 text-gray-300">{proveedor.contacto}</td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {proveedor.productos}
                </td>
                <td className="py-2.5 text-gray-300">
                  {formatearFecha(proveedor.ultimoPedido)}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      proveedor.estado === "activo"
                        ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                        : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    }`}
                  >
                    {proveedor.estado === "activo" ? "Activo" : "Pendiente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Distribución de productos
        </div>
        <div className="space-y-4">
          {[...proveedores]
            .sort((a, b) => b.productos - a.productos)
            .map((proveedor) => {
              const pct = totalProductos
                ? (proveedor.productos / totalProductos) * 100
                : 0;
              return (
                <div key={proveedor._id} className="flex items-center gap-4">
                  <div className="text-xs font-semibold text-gray-300 w-48 truncate">
                    {proveedor.nombre}
                  </div>
                  <div className="flex-1 h-2 bg-[#13151b] rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-accent-blue rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(126,195,230,0.5)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-gray-400 w-16 text-right">
                    {proveedor.productos} ({pct.toFixed(0)}%)
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProveedoresView;
