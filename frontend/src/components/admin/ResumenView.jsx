import { useState, useEffect } from 'react';

const ResumenView = () => {
  const [metrics, setMetrics] = useState({
    ventasMes: 12500000,
    pedidosActivos: 8,
    stockBajo: 3,
    clientesNuevos: 12
  });

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Ventas del mes
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            ${(metrics.ventasMes / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5 flex items-center gap-1">
            <span>↑</span> +18% vs mes anterior
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Pedidos activos
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {metrics.pedidosActivos}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            3 listos para enviar
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-red-500/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Stock bajo
          </div>
          <div className="font-poppins font-bold text-2xl text-red-400">
            {metrics.stockBajo}
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
            {metrics.clientesNuevos}
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            Este mes
          </div>
        </div>
      </div>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pedidos recientes */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Pedidos recientes
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Últimas 24 horas
            </div>
          </div>

          <div className="space-y-3">
            {[
              { id: '#2847', cliente: 'Ana Torres', libro: 'Dragon Ball Vol. 1', total: 54000, estado: 'ok' },
              { id: '#2846', cliente: 'Carlos Méndez', libro: 'Batman: Hush', total: 80000, estado: 'low' },
              { id: '#2845', cliente: 'Laura Jiménez', libro: 'One Piece Vol. 3', total: 48000, estado: 'low' },
              { id: '#2844', cliente: 'Roberto Silva', libro: 'Inuyasha Vol. 12', total: 42000, estado: 'ok' },
            ].map((pedido, index) => (
              <div key={index} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {pedido.id} · {pedido.cliente}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                    {pedido.libro}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-xs font-bold text-white">
                    ${pedido.total.toLocaleString()}
                  </div>
                  <span className={`text-[9px] font-bold inline-block px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wider ${
                    pedido.estado === 'ok' 
                      ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
                      : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {pedido.estado === 'ok' ? 'Completo' : 'Anticipo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-purple">
              Productos más vendidos
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Este mes
            </div>
          </div>

          <div className="space-y-4 mt-2">
            {[
              { nombre: 'Dragon Ball', categoria: 'Manga', ventas: 24, max: 30 },
              { nombre: 'One Piece', categoria: 'Manga', ventas: 18, max: 30 },
              { nombre: 'Batman: Hush', categoria: 'Cómic', ventas: 15, max: 30 },
              { nombre: 'Inuyasha', categoria: 'Manga', ventas: 12, max: 30 },
              { nombre: 'Pokemon Adventures', categoria: 'Manga', ventas: 10, max: 30 },
            ].map((producto, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0 truncate text-xs font-semibold text-gray-200">
                  {producto.nombre}
                </div>
                <div className="flex-1 h-2 bg-[#13151b] rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-accent-purple rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(182,166,230,0.5)]"
                    style={{ width: `${(producto.ventas / producto.max) * 100}%` }}
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

      {/* Stock bajo y alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stock bajo */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400">
              Stock bajo
            </div>
            <span className="text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full px-2 py-0.5 uppercase">
              {metrics.stockBajo} en peligro
            </span>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
                <th className="text-left pb-2 font-bold tracking-wider">Producto</th>
                <th className="text-right pb-2 font-bold tracking-wider">Stock</th>
                <th className="text-right pb-2 font-bold tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { nombre: 'All-Star Superman', stock: 2, umbral: 5 },
                { nombre: '1001 Obras de Arte', stock: 3, umbral: 5 },
                { nombre: 'Batman: Hush', stock: 4, umbral: 10 },
              ].map((item, index) => (
                <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="py-2.5 font-medium text-gray-200">{item.nombre}</td>
                  <td className="py-2.5 text-right font-bold text-white">{item.stock}</td>
                  <td className="py-2.5 text-right">
                    <span className="text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Crítico
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertas pendientes */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Alertas pendientes
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: 'ti-alert-triangle', color: 'amber', titulo: 'Stock bajo', desc: '3 productos necesitan reabastecimiento' },
              { icon: 'ti-clock', color: 'blue', titulo: 'Pedidos pendientes', desc: '2 pedidos esperan confirmación' },
              { icon: 'ti-credit-card', color: 'red', titulo: 'Pagos pendientes', desc: '1 cliente debe 2do pago' },
            ].map((alerta, index) => (
              <div key={index} className="flex gap-3.5 items-start py-2.5 border-b border-white/5 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alerta.color === 'amber' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                  alerta.color === 'blue' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <i className={`${alerta.icon} text-base`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">
                    {alerta.titulo}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                    {alerta.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenView;
