const ClientesView = () => {
  const clientes = [
    { id: 1, nombre: 'Ana Torres', email: 'ana@example.com', pedidos: 8, total: 520000, ultima: '18 May 2026', estado: 'Activo' },
    { id: 2, nombre: 'Carlos Méndez', email: 'carlos@example.com', pedidos: 5, total: 350000, ultima: '17 May 2026', estado: 'Activo' },
    { id: 3, nombre: 'Laura Jiménez', email: 'laura@example.com', pedidos: 12, total: 890000, ultima: '16 May 2026', estado: 'VIP' },
    { id: 4, nombre: 'Roberto Silva', email: 'roberto@example.com', pedidos: 3, total: 180000, ultima: '15 May 2026', estado: 'Activo' },
    { id: 5, nombre: 'María López', email: 'maria@example.com', pedidos: 15, total: 1200000, ultima: '14 May 2026', estado: 'VIP' },
    { id: 6, nombre: 'Diego Torres', email: 'diego@example.com', pedidos: 1, total: 60000, ultima: '12 May 2026', estado: 'Nuevo' },
  ];

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Métricas de clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Total clientes
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {clientes.length}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Registrados
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Clientes VIP
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {clientes.filter(c => c.estado === 'VIP').length}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            +10 pedidos
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Nuevos este mes
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {clientes.filter(c => c.estado === 'Nuevo').length}
          </div>
          <div className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-2.5">
            +25% vs anterior
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Valor promedio
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            ${Math.round(clientes.reduce((acc, c) => acc + c.total, 0) / clientes.length / 1000)}K
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Por cliente
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Base de datos de clientes
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Buscar cliente..."
              className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-[#232632] text-white focus:outline-none focus:border-accent-blue w-48"
            />
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:opacity-90 hover:shadow-md transition-all border-none cursor-pointer">
              Exportar
            </button>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">Cliente</th>
              <th className="text-right pb-2 font-bold tracking-wider">Pedidos</th>
              <th className="text-right pb-2 font-bold tracking-wider">Total comprado</th>
              <th className="text-left pb-2 font-bold tracking-wider">Última compra</th>
              <th className="text-right pb-2 font-bold tracking-wider">Estado</th>
              <th className="text-right pb-2 font-bold tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-2.5">
                  <div className="font-semibold text-white">{cliente.nombre}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{cliente.email}</div>
                </td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {cliente.pedidos}
                </td>
                <td className="py-2.5 text-right font-bold text-white">
                  ${cliente.total.toLocaleString()}
                </td>
                <td className="py-2.5 text-gray-300">{cliente.ultima}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    cliente.estado === 'VIP' 
                      ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' 
                      : cliente.estado === 'Nuevo'
                      ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                      : 'bg-white/5 text-gray-300 border border-white/5'
                  }`}>
                    {cliente.estado}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Ver perfil"
                    >
                      <i className="ti-eye text-sm"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Enviar email"
                    >
                      <i className="ti-mail text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top clientes */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Top clientes por compras
        </div>
        <div className="space-y-3.5 mt-2">
          {clientes
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map((cliente, index) => (
              <div key={cliente.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue border border-accent-blue/20">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white">{cliente.nombre}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{cliente.pedidos} pedidos</div>
                </div>
                <div className="text-xs font-bold text-white">
                  ${cliente.total.toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClientesView;
