const ProveedoresView = () => {
  const proveedores = [
    { id: 1, nombre: 'Distribuidora Manga Plus', contacto: 'contacto@mangaplus.com', telefono: '555-0101', productos: 45, ultimoPedido: '15 May 2026', estado: 'Activo' },
    { id: 2, nombre: 'Editorial Comics SA', contacto: 'ventas@comics.com', telefono: '555-0202', productos: 32, ultimoPedido: '10 May 2026', estado: 'Activo' },
    { id: 3, nombre: 'Libros de Arte Internacional', contacto: 'info@artbooks.com', telefono: '555-0303', productos: 18, ultimoPedido: '5 May 2026', estado: 'Activo' },
    { id: 4, nombre: 'Importadora Nippon', contacto: 'pedidos@nippon.com', telefono: '555-0404', productos: 28, ultimoPedido: '25 Abr 2026', estado: 'Pendiente' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Métricas de proveedores */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Total proveedores
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {proveedores.length}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Registrados
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Proveedores activos
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {proveedores.filter(p => p.estado === 'Activo').length}
          </div>
          <div className="text-[11px] text-[#4A7C28] mt-1.5">
            Con pedidos recientes
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Productos totales
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {proveedores.reduce((acc, p) => acc + p.productos, 0)}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            En catálogo
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Pedidos pendientes
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {proveedores.filter(p => p.estado === 'Pendiente').length}
          </div>
          <div className="text-[11px] text-[#8C5A0A] mt-1.5">
            Por confirmar
          </div>
        </div>
      </div>

      {/* Tabla de proveedores */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] font-medium text-[#1A1814]">
            Directorio de proveedores
          </div>
          <button className="text-[12px] px-3 py-1.5 rounded-lg bg-[#2D5016] text-white hover:bg-[#4A7C28] transition-colors">
            + Agregar proveedor
          </button>
        </div>

        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] text-[#9E9890] uppercase border-b border-black/8">
              <th className="text-left pb-2 font-medium">Proveedor</th>
              <th className="text-left pb-2 font-medium">Contacto</th>
              <th className="text-right pb-2 font-medium">Productos</th>
              <th className="text-left pb-2 font-medium">Último pedido</th>
              <th className="text-right pb-2 font-medium">Estado</th>
              <th className="text-right pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id} className="border-b border-black/8 last:border-0">
                <td className="py-2.5">
                  <div className="font-medium text-[#1A1814]">{proveedor.nombre}</div>
                  <div className="text-[11px] text-[#9E9890] mt-0.5">{proveedor.telefono}</div>
                </td>
                <td className="py-2.5 text-[#6B6560]">{proveedor.contacto}</td>
                <td className="py-2.5 text-right text-[#1A1814]">
                  {proveedor.productos}
                </td>
                <td className="py-2.5 text-[#6B6560]">{proveedor.ultimoPedido}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    proveedor.estado === 'Activo' 
                      ? 'bg-[#EAF3DE] text-[#2D5016]' 
                      : 'bg-[#FDF3E0] text-[#8C5A0A]'
                  }`}>
                    {proveedor.estado}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-1 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Ver detalles"
                    >
                      <i className="ti-eye text-sm text-[#6B6560]"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Editar"
                    >
                      <i className="ti-pencil text-sm text-[#6B6560]"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Hacer pedido"
                    >
                      <i className="ti-shopping-cart text-sm text-[#6B6560]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribución de productos por proveedor */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Distribución de productos
        </div>
        <div className="space-y-3">
          {proveedores
            .sort((a, b) => b.productos - a.productos)
            .map((proveedor) => {
              const total = proveedores.reduce((acc, p) => acc + p.productos, 0);
              const pct = (proveedor.productos / total) * 100;
              return (
                <div key={proveedor.id} className="flex items-center gap-3">
                  <div className="text-[11px] text-[#6B6560] w-48 truncate">{proveedor.nombre}</div>
                  <div className="flex-1 h-[7px] bg-[#F0EDE6] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#2D5016] rounded transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#9E9890] w-16 text-right">
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
