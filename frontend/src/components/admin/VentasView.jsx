const VentasView = () => {
  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Métricas de ventas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Ventas hoy
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            $850.000
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            5 pedidos
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Promedio por pedido
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            $170K
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            +12% esta semana
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Completados
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            127
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Este mes
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Todos los pedidos
          </div>
          <div className="flex gap-2">
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#232632] border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer">
              Filtrar
            </button>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">Cliente / Producto</th>
              <th className="text-left pb-2 font-bold tracking-wider">Fecha</th>
              <th className="text-right pb-2 font-bold tracking-wider">Pago</th>
              <th className="text-right pb-2 font-bold tracking-wider">Total</th>
              <th className="text-right pb-2 font-bold tracking-wider">Estado</th>
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
              <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-2.5">
                  <div className="font-semibold text-white">{pedido.id} · {pedido.cliente}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{pedido.producto}</div>
                </td>
                <td className="py-2.5 text-gray-300">{pedido.fecha}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    pedido.tipo === 'Contado' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {pedido.tipo}
                  </span>
                </td>
                <td className="py-2.5 text-right font-bold text-white">
                  ${pedido.total.toLocaleString()}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    pedido.estado === 'Completado' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' :
                    pedido.estado === 'Enviado' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' :
                    pedido.estado === 'Pendiente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    'bg-white/5 text-gray-300 border border-white/5'
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
