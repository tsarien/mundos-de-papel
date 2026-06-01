import { useState, useEffect } from 'react';

const ResumenView = () => {
  const [metrics, setMetrics] = useState({
    ventasMes: 12500000,
    pedidosActivos: 8,
    stockBajo: 3,
    clientesNuevos: 12
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Métricas principales */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Ventas del mes
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            ${(metrics.ventasMes / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-[#4A7C28] mt-1.5">
            +18% vs mes anterior
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Pedidos activos
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {metrics.pedidosActivos}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            3 listos para enviar
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Stock bajo
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {metrics.stockBajo}
          </div>
          <div className="text-[11px] text-[#8C5A0A] mt-1.5">
            Requieren atención
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Clientes nuevos
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {metrics.clientesNuevos}
          </div>
          <div className="text-[11px] text-[#4A7C28] mt-1.5">
            Este mes
          </div>
        </div>
      </div>

      {/* Dos columnas */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Pedidos recientes */}
        <div className="bg-white border border-black/8 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3.5">
            <div className="text-[13px] font-medium text-[#1A1814]">
              Pedidos recientes
            </div>
            <div className="text-[11px] text-[#9E9890]">
              Últimas 24 horas
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { id: '#2847', cliente: 'Ana Torres', libro: 'Dragon Ball Vol. 1', total: 54000, estado: 'ok' },
              { id: '#2846', cliente: 'Carlos Méndez', libro: 'Batman: Hush', total: 80000, estado: 'ok' },
              { id: '#2845', cliente: 'Laura Jiménez', libro: 'One Piece Vol. 3', total: 48000, estado: 'low' },
              { id: '#2844', cliente: 'Roberto Silva', libro: 'Inuyasha Vol. 12', total: 42000, estado: 'ok' },
            ].map((pedido, index) => (
              <div key={index} className="flex items-center justify-between py-2.5 border-b border-black/8 last:border-0">
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-[#1A1814]">
                    {pedido.id} · {pedido.cliente}
                  </div>
                  <div className="text-[11px] text-[#9E9890] mt-0.5">
                    {pedido.libro}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-medium text-[#1A1814]">
                    ${pedido.total.toLocaleString()}
                  </div>
                  <span className={`text-[10px] inline-block px-2 py-0.5 rounded-full mt-1 ${
                    pedido.estado === 'ok' ? 'bg-[#EAF3DE] text-[#2D5016]' : 'bg-[#FDF3E0] text-[#8C5A0A]'
                  }`}>
                    {pedido.estado === 'ok' ? 'Completo' : 'Anticipo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white border border-black/8 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3.5">
            <div className="text-[13px] font-medium text-[#1A1814]">
              Productos más vendidos
            </div>
            <div className="text-[11px] text-[#9E9890]">
              Este mes
            </div>
          </div>

          <div className="space-y-3">
            {[
              { nombre: 'Dragon Ball', categoria: 'Manga', ventas: 24, max: 30 },
              { nombre: 'One Piece', categoria: 'Manga', ventas: 18, max: 30 },
              { nombre: 'Batman: Hush', categoria: 'Cómic', ventas: 15, max: 30 },
              { nombre: 'Inuyasha', categoria: 'Manga', ventas: 12, max: 30 },
              { nombre: 'Pokemon Adventures', categoria: 'Manga', ventas: 10, max: 30 },
            ].map((producto, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <div className="flex-1">
                  <div className="text-[11px] text-[#6B6560] w-20 flex-shrink-0">
                    {producto.nombre}
                  </div>
                </div>
                <div className="flex-1 h-[7px] bg-[#F0EDE6] rounded overflow-hidden">
                  <div
                    className="h-full bg-[#2D5016] rounded transition-all duration-500"
                    style={{ width: `${(producto.ventas / producto.max) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#9E9890] w-8 text-right">
                  {producto.ventas}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock bajo y alertas */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Stock bajo */}
        <div className="bg-white border border-black/8 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3.5">
            <div className="text-[13px] font-medium text-[#1A1814]">
              Stock bajo
            </div>
            <span className="text-[10px] bg-[#8C1A1A] text-white rounded-full px-2 py-0.5">
              {metrics.stockBajo}
            </span>
          </div>

          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-[11px] text-[#9E9890] border-b border-black/8">
                <th className="text-left pb-2 font-medium">Producto</th>
                <th className="text-right pb-2 font-medium">Stock</th>
                <th className="text-right pb-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { nombre: 'All-Star Superman', stock: 2, umbral: 5 },
                { nombre: '1001 Obras de Arte', stock: 3, umbral: 5 },
                { nombre: 'Batman: Hush', stock: 4, umbral: 10 },
              ].map((item, index) => (
                <tr key={index} className="border-b border-black/8 last:border-0">
                  <td className="py-2.5 text-[#1A1814]">{item.nombre}</td>
                  <td className="py-2.5 text-right text-[#1A1814]">{item.stock}</td>
                  <td className="py-2.5 text-right">
                    <span className="text-[10px] bg-[#FDF3E0] text-[#8C5A0A] px-2 py-0.5 rounded-full">
                      Bajo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertas pendientes */}
        <div className="bg-white border border-black/8 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3.5">
            <div className="text-[13px] font-medium text-[#1A1814]">
              Alertas pendientes
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { icon: 'ti-alert-triangle', color: 'amber', titulo: 'Stock bajo', desc: '3 productos necesitan reabastecimiento' },
              { icon: 'ti-clock', color: 'blue', titulo: 'Pedidos pendientes', desc: '2 pedidos esperan confirmación' },
              { icon: 'ti-credit-card', color: 'red', titulo: 'Pagos pendientes', desc: '1 cliente debe 2do pago' },
            ].map((alerta, index) => (
              <div key={index} className="flex gap-2.5 items-start py-2.5 border-b border-black/8 last:border-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alerta.color === 'amber' ? 'bg-[#FDF3E0]' :
                  alerta.color === 'blue' ? 'bg-[#E6EEF8]' :
                  'bg-[#FDEAEA]'
                }`}>
                  <i className={`${alerta.icon} text-sm ${
                    alerta.color === 'amber' ? 'text-[#8C5A0A]' :
                    alerta.color === 'blue' ? 'text-[#1A3E6B]' :
                    'text-[#8C1A1A]'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-[#1A1814]">
                    {alerta.titulo}
                  </div>
                  <div className="text-[11px] text-[#9E9890] mt-0.5">
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
