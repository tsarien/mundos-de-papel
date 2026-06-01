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
    <div className="flex flex-col gap-5">
      {/* Métricas de clientes */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Total clientes
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {clientes.length}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Registrados
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Clientes VIP
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {clientes.filter(c => c.estado === 'VIP').length}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            +10 pedidos
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Nuevos este mes
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {clientes.filter(c => c.estado === 'Nuevo').length}
          </div>
          <div className="text-[11px] text-[#4A7C28] mt-1.5">
            +25% vs anterior
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Valor promedio
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            ${Math.round(clientes.reduce((acc, c) => acc + c.total, 0) / clientes.length / 1000)}K
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Por cliente
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] font-medium text-[#1A1814]">
            Base de datos de clientes
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Buscar cliente..."
              className="text-[12px] px-3 py-1.5 rounded-lg border border-black/14 bg-white text-[#1A1814] w-48"
            />
            <button className="text-[12px] px-3 py-1.5 rounded-lg bg-[#2D5016] text-white hover:bg-[#4A7C28] transition-colors">
              Exportar
            </button>
          </div>
        </div>

        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] text-[#9E9890] uppercase border-b border-black/8">
              <th className="text-left pb-2 font-medium">Cliente</th>
              <th className="text-right pb-2 font-medium">Pedidos</th>
              <th className="text-right pb-2 font-medium">Total comprado</th>
              <th className="text-left pb-2 font-medium">Última compra</th>
              <th className="text-right pb-2 font-medium">Estado</th>
              <th className="text-right pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-black/8 last:border-0">
                <td className="py-2.5">
                  <div className="font-medium text-[#1A1814]">{cliente.nombre}</div>
                  <div className="text-[11px] text-[#9E9890] mt-0.5">{cliente.email}</div>
                </td>
                <td className="py-2.5 text-right text-[#1A1814]">
                  {cliente.pedidos}
                </td>
                <td className="py-2.5 text-right font-medium text-[#1A1814]">
                  ${cliente.total.toLocaleString()}
                </td>
                <td className="py-2.5 text-[#6B6560]">{cliente.ultima}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    cliente.estado === 'VIP' 
                      ? 'bg-[#E6EEF8] text-[#1A3E6B]' 
                      : cliente.estado === 'Nuevo'
                      ? 'bg-[#EAF3DE] text-[#2D5016]'
                      : 'bg-[#F0EDE6] text-[#6B6560]'
                  }`}>
                    {cliente.estado}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-1 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Ver perfil"
                    >
                      <i className="ti-eye text-sm text-[#6B6560]"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Enviar email"
                    >
                      <i className="ti-mail text-sm text-[#6B6560]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top clientes */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Top clientes por compras
        </div>
        <div className="space-y-3">
          {clientes
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map((cliente, index) => (
              <div key={cliente.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF0E1] flex items-center justify-center text-[10px] font-medium text-[#2D5016]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[#1A1814]">{cliente.nombre}</div>
                  <div className="text-[10px] text-[#9E9890] mt-0.5">{cliente.pedidos} pedidos</div>
                </div>
                <div className="text-[12px] font-medium text-[#1A1814]">
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
