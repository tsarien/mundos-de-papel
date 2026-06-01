const PreciosView = () => {
  const reglas = [
    { id: 1, nombre: 'Descuento por volumen', tipo: 'Porcentaje', valor: '10%', condicion: 'Compras > $500.000', activo: true },
    { id: 2, nombre: 'Promoción manga', tipo: 'Fijo', valor: '$5.000', condicion: 'Categoría: Manga', activo: true },
    { id: 3, nombre: 'Cliente frecuente', tipo: 'Porcentaje', valor: '15%', condicion: '> 10 pedidos', activo: true },
    { id: 4, nombre: 'Black Friday', tipo: 'Porcentaje', valor: '30%', condicion: 'Fecha específica', activo: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Métricas de precios */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Precio promedio
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            $75K
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Por producto
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Margen promedio
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            42%
          </div>
          <div className="text-[11px] text-[#4A7C28] mt-1.5">
            Rentabilidad
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Productos en oferta
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            5
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            De 8 totales
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Descuento promedio
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            18%
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            En promociones
          </div>
        </div>
      </div>

      {/* Reglas de precio */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] font-medium text-[#1A1814]">
            Reglas de precio activas
          </div>
          <button className="text-[12px] px-3 py-1.5 rounded-lg bg-[#2D5016] text-white hover:bg-[#4A7C28] transition-colors">
            + Nueva regla
          </button>
        </div>

        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] text-[#9E9890] uppercase border-b border-black/8">
              <th className="text-left pb-2 font-medium">Regla</th>
              <th className="text-left pb-2 font-medium">Tipo</th>
              <th className="text-right pb-2 font-medium">Descuento</th>
              <th className="text-left pb-2 font-medium">Condición</th>
              <th className="text-right pb-2 font-medium">Estado</th>
              <th className="text-right pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reglas.map((regla) => (
              <tr key={regla.id} className="border-b border-black/8 last:border-0">
                <td className="py-2.5">
                  <div className="font-medium text-[#1A1814]">{regla.nombre}</div>
                </td>
                <td className="py-2.5 text-[#6B6560]">{regla.tipo}</td>
                <td className="py-2.5 text-right font-medium text-[#1A1814]">
                  {regla.valor}
                </td>
                <td className="py-2.5 text-[#6B6560]">{regla.condicion}</td>
                <td className="py-2.5 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    regla.activo 
                      ? 'bg-[#EAF3DE] text-[#2D5016]' 
                      : 'bg-[#F0EDE6] text-[#6B6560]'
                  }`}>
                    {regla.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-1 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Editar"
                    >
                      <i className="ti-pencil text-sm text-[#6B6560]"></i>
                    </button>
                    <button 
                      className={`w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center transition-colors ${
                        regla.activo ? 'hover:bg-[#FDEAEA]' : 'hover:bg-[#EAF3DE]'
                      }`}
                      title={regla.activo ? 'Desactivar' : 'Activar'}
                    >
                      <i className={`ti-${regla.activo ? 'x' : 'check'} text-sm text-[#6B6560]`}></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rangos de precio por categoría */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { categoria: 'Manga', min: 50000, max: 80000, promedio: 62000 },
          { categoria: 'Cómic', min: 70000, max: 90000, promedio: 80000 },
          { categoria: 'Arte', min: 100000, max: 150000, promedio: 120000 },
        ].map((cat) => (
          <div key={cat.categoria} className="bg-white border border-black/8 rounded-2xl p-4">
            <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
              {cat.categoria}
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#9E9890]">Mínimo</span>
                <span className="text-[#1A1814] font-medium">${cat.min.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#9E9890]">Promedio</span>
                <span className="text-[#1A1814] font-medium">${cat.promedio.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#9E9890]">Máximo</span>
                <span className="text-[#1A1814] font-medium">${cat.max.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreciosView;
