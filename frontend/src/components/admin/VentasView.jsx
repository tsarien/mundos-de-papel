import { formatearFecha } from "../../utils/formatters.js";
import { useState, useEffect } from "react";
import { obtenerVentas } from "../../services/adminService";

const VentasView = () => {
  const [ventas, setVentas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerVentas();
        setVentas(data.ventas);
      } catch {
        setVentas(null);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Cargando ventas...</p>;
  }

  if (!ventas) {
    return (
      <p className="text-gray-400 text-sm">No se pudieron cargar las ventas.</p>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Ventas hoy
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            ${ventas.ventasHoy.toLocaleString()}
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            {ventas.pedidosHoy} pedidos
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Promedio por pedido
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            ${Math.round(ventas.promedioPedido / 1000)}K
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Hoy
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Completados
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {ventas.completadosMes}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Este mes
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Todos los pedidos
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">
                Cliente / Producto
              </th>
              <th className="text-left pb-2 font-bold tracking-wider">Fecha</th>
              <th className="text-right pb-2 font-bold tracking-wider">Pago</th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Total
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {ventas.pedidos.map((pedido) => (
              <tr
                key={pedido.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5">
                  <div className="font-semibold text-white">
                    {pedido.numero} · {pedido.cliente}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {pedido.producto}
                  </div>
                </td>
                <td className="py-2.5 text-gray-300">
                  {formatearFecha(pedido.fecha)}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      pedido.tipo === "Contado"
                        ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                        : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    }`}
                  >
                    {pedido.tipo}
                  </span>
                </td>
                <td className="py-2.5 text-right font-bold text-white">
                  ${pedido.total.toLocaleString()}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      pedido.estado === "Completado"
                        ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                        : pedido.estado === "Enviado"
                          ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                          : pedido.estado === "Pendiente"
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : "bg-white/5 text-gray-300 border border-white/5"
                    }`}
                  >
                    {pedido.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VentasView;
