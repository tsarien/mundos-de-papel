const ProveedoresView = () => {
  const proveedores = [
    { id: 1, nombre: 'Distribuidora Manga Plus', contacto: 'contacto@mangaplus.com', telefono: '555-0101', productos: 45, ultimoPedido: '15 May 2026', estado: 'Activo' },
    { id: 2, nombre: 'Editorial Comics SA', contacto: 'ventas@comics.com', telefono: '555-0202', productos: 32, ultimoPedido: '10 May 2026', estado: 'Activo' },
    { id: 3, nombre: 'Libros de Arte Internacional', contacto: 'info@artbooks.com', telefono: '555-0303', productos: 18, ultimoPedido: '5 May 2026', estado: 'Activo' },
    { id: 4, nombre: 'Importadora Nippon', contacto: 'pedidos@nippon.com', telefono: '555-0404', productos: 28, ultimoPedido: '25 Abr 2026', estado: 'Pendiente' },
  ];

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Métricas de proveedores */}
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
            {proveedores.filter(p => p.estado === 'Activo').length}
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
            {proveedores.reduce((acc, p) => acc + p.productos, 0)}
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
            {proveedores.filter(p => p.estado === 'Pendiente').length}
          </div>
          <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider mt-2.5">
            Por confirmar
          </div>
        </div>
      </div>

      {/* Tabla de proveedores */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Directorio de proveedores
          </div>
          <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:opacity-90 hover:shadow-md transition-all border-none cursor-pointer">
            + Agregar proveedor
          </button>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">Proveedor</th>
              <th className="text-left pb-2 font-bold tracking-wider">Contacto</th>
              <th className="text-right pb-2 font-bold tracking-wider">Productos</th>
              <th className="text-left pb-2 font-bold tracking-wider">Último pedido</th>
              <th className="text-right pb-2 font-bold tracking-wider">Estado</th>
              <th className="text-right pb-2 font-bold tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-2.5">
                  <div className="font-semibold text-white">{proveedor.nombre}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{proveedor.telefono}</div>
                </td>
                <td className="py-2.5 text-gray-300">{proveedor.contacto}</td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {proveedor.productos}
                </td>
                <td className="py-2.5 text-gray-300">{proveedor.ultimoPedido}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    proveedor.estado === 'Activo' 
                      ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
                      : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {proveedor.estado}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Ver detalles"
                    >
                      <i className="ti-eye text-sm"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Editar"
                    >
                      <i className="ti-pencil text-sm"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Hacer pedido"
                    >
                      <i className="ti-shopping-cart text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribución de productos por proveedor */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Distribución de productos
        </div>
        <div className="space-y-4">
          {proveedores
            .sort((a, b) => b.productos - a.productos)
            .map((proveedor) => {
              const total = proveedores.reduce((acc, p) => acc + p.productos, 0);
              const pct = (proveedor.productos / total) * 100;
              return (
                <div key={proveedor.id} className="flex items-center gap-4">
                  <div className="text-xs font-semibold text-gray-300 w-48 truncate">{proveedor.nombre}</div>
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
