const VentasView = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Métricas de ventas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Ventas hoy
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            $850.000
          </div>
          <div className="text-[11px] text-[#4A7C28] mt-1.5">
            5 pedidos
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Promedio por pedido
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            $170K
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            +12% esta semana
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Completados
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            127
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Este mes
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] font-medium text-[#1A1814]">
            Todos los pedidos
          </div>
          <div className="flex gap-2">
            <button className="text-[12px] px-3 py-1.5 rounded-lg bg-[#2D5016] text-white hover:bg-[#4A7C28] transition-colors">
              Filtrar
            </button>
          </div>
        </div>

        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] text-[#9E9890] uppercase border-b border-black/8">
              <th className="text-left pb-2 font-medium">Cliente / Producto</th>
              <th className="text-left pb-2 font-medium">Fecha</th>
              <th className="text-right pb-2 font-medium">Pago</th>
              <th className="text-right pb-2 font-medium">Total</th>
              <th className="text-right pb-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '#2847', cliente: 'Ana Torres', producto: 'Dragon Ball Vol. 1', fecha: '18 May', tipo: 'Contado', total: 54000, estado: 'Completado' },
              { id: '#2846', cliente: 'Carlos Méndez', producto: 'Batman: Hush', fecha: '18 May', tipo: 'Anticipo', total: 80000, estado: 'Pendiente' },
              { id: '#2845', cliente: 'Laura Jiménez', producto: 'One Piece Vol. 3', fecha: '17 May', tipo: 'Contado', total: 48000, estado: 'Enviado' },
              { id: '#2844', cliente: 'Roberto Silva', producto: 'Inuyasha Vol. 12', fecha: '17 May', tipo: 'Anticipo', total: 42000, estado: 'Procesando' },
              { id: '#2843', cliente: 'María López', producto: 'Pokemon Adventures', fecha: '16 May', tipo: 'Contado', total: 80000, estado: 'Completado' },
            ].map((pedido, index) => (
              <tr key={index} className="border-b border-black/8 last:border-0">
                <td className="py-2.5">
                  <div className="font-medium text-[#1A1814]">{pedido.id} · {pedido.cliente}</div>
                  <div className="text-[11px] text-[#9E9890] mt-0.5">{pedido.producto}</div>
                </td>
                <td className="py-2.5 text-[#6B6560]">{pedido.fecha}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    pedido.tipo === 'Contado' ? 'bg-[#E6EEF8] text-[#1A3E6B]' : 'bg-[#FDF3E0] text-[#8C5A0A]'
                  }`}>
                    {pedido.tipo}
                  </span>
                </td>
                <td className="py-2.5 text-right font-medium text-[#1A1814]">
                  ${pedido.total.toLocaleString()}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    pedido.estado === 'Completado' ? 'bg-[#EAF3DE] text-[#2D5016]' :
                    pedido.estado === 'Enviado' ? 'bg-[#E6EEF8] text-[#1A3E6B]' :
                    pedido.estado === 'Pendiente' ? 'bg-[#FDF3E0] text-[#8C5A0A]' :
                    'bg-[#F0EDE6] text-[#6B6560]'
                  }`}>
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
