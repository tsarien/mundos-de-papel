import { useState, useEffect } from "react";
import { obtenerResumen } from "../../services/adminService";

const formatearMoneda = (valor) => {
  if (valor >= 1000000) return `$${(valor / 1000000).toFixed(1)}M`;
  if (valor >= 1000) return `$${Math.round(valor / 1000)}K`;
  return `$${valor.toLocaleString()}`;
};

const ResumenView = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerResumen();
        setResumen(data.resumen);
      } catch {
        setResumen(null);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Cargando resumen...</p>;
  }

  if (!resumen) {
    return <p className="text-gray-400 text-sm">No se pudo cargar el resumen.</p>;
  }

  const maxVentas = Math.max(
    ...resumen.productosVendidos.map((p) => p.ventas),
    1,
  );

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Ventas del mes
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {formatearMoneda(resumen.ventasMes)}
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            Mes actual
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Pedidos activos
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {resumen.pedidosActivos}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            {resumen.pedidosListosEnviar} listos para enviar
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-red-500/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Stock bajo
          </div>
          <div className="font-poppins font-bold text-2xl text-red-400">
            {resumen.stockBajo}
          </div>
          <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider mt-2.5">
            Requieren atención
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Clientes nuevos
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {resumen.clientesNuevos}
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            Este mes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Pedidos recientes
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Últimos pedidos
            </div>
          </div>

          <div className="space-y-3">
            {resumen.pedidosRecientes.length === 0 ? (
              <p className="text-gray-400 text-xs">Sin pedidos recientes.</p>
            ) : (
              resumen.pedidosRecientes.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      #{pedido.numero} · {pedido.cliente}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                      {pedido.libro}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-xs font-bold text-white">
                      ${pedido.total.toLocaleString()}
                    </div>
                    <span
                      className={`text-[9px] font-bold inline-block px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wider ${
                        pedido.estado === "ok"
                          ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      }`}
                    >
                      {pedido.estado === "ok" ? "Completo" : "Anticipo"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-purple">
              Productos más vendidos
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Histórico
            </div>
          </div>

          <div className="space-y-4 mt-2">
            {resumen.productosVendidos.map((producto) => (
              <div key={producto.nombre} className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0 truncate text-xs font-semibold text-gray-200">
                  {producto.nombre}
                </div>
                <div className="flex-1 h-2 bg-[#13151b] rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-accent-purple rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(182,166,230,0.5)]"
                    style={{
                      width: `${(producto.ventas / maxVentas) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs font-bold text-gray-400 w-6 text-right flex-shrink-0">
                  {producto.ventas}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400">
              Stock bajo
            </div>
            <span className="text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full px-2 py-0.5 uppercase">
              {resumen.stockBajo} en peligro
            </span>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
                <th className="text-left pb-2 font-bold tracking-wider">
                  Producto
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
              {resumen.productosStockBajo.map((item) => (
                <tr
                  key={item.nombre}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="py-2.5 font-medium text-gray-200">
                    {item.nombre}
                  </td>
                  <td className="py-2.5 text-right font-bold text-white">
                    {item.stock}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.critico ? "Crítico" : "Bajo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Alertas pendientes
            </div>
            <span className="text-[9px] font-bold bg-accent-pink/20 text-accent-pink border border-accent-pink/30 rounded-full px-2 py-0.5">
              {resumen.alertasPendientes}
            </span>
          </div>

          <div className="space-y-3">
            {resumen.alertasPendientes === 0 ? (
              <p className="text-gray-400 text-xs">Sin alertas pendientes.</p>
            ) : (
              <>
                {resumen.stockBajo > 0 && (
                  <div className="flex gap-3.5 items-start py-2.5 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      <i className="ti-alert-triangle text-base"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">
                        Stock bajo
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {resumen.stockBajo} productos necesitan reabastecimiento
                      </div>
                    </div>
                  </div>
                )}
                {resumen.pedidosActivos > 0 && (
                  <div className="flex gap-3.5 items-start py-2.5 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                      <i className="ti-clock text-base"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">
                        Pedidos pendientes
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {resumen.pedidosActivos} pedidos en proceso
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenView;
