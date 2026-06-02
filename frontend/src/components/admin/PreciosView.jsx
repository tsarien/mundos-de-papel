const PreciosView = () => {
  const reglas = [
    {
      id: 1,
      nombre: "Descuento por volumen",
      tipo: "Porcentaje",
      valor: "10%",
      condicion: "Compras > $500.000",
      activo: true,
    },
    {
      id: 2,
      nombre: "Promoción manga",
      tipo: "Fijo",
      valor: "$5.000",
      condicion: "Categoría: Manga",
      activo: true,
    },
    {
      id: 3,
      nombre: "Cliente frecuente",
      tipo: "Porcentaje",
      valor: "15%",
      condicion: "> 10 pedidos",
      activo: true,
    },
    {
      id: 4,
      nombre: "Black Friday",
      tipo: "Porcentaje",
      valor: "30%",
      condicion: "Fecha específica",
      activo: false,
    },
  ];

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Métricas de precios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Precio promedio",
            value: "$75K",
            sub: "Por producto",
            subColor: "text-gray-400",
          },
          {
            label: "Margen promedio",
            value: "42%",
            sub: "Rentabilidad",
            subColor: "text-accent-blue",
          },
          {
            label: "Productos en oferta",
            value: "5",
            sub: "De 8 totales",
            subColor: "text-gray-400",
          },
          {
            label: "Descuento promedio",
            value: "18%",
            sub: "En promociones",
            subColor: "text-gray-400",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft"
          >
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
              {m.label}
            </div>
            <div className="font-poppins font-bold text-2xl text-white">
              {m.value}
            </div>
            <div
              className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 ${m.subColor}`}
            >
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Reglas de precio */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Reglas de precio activas
          </div>
          <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:opacity-90 hover:shadow-md transition-all border-none cursor-pointer">
            + Nueva regla
          </button>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">Regla</th>
              <th className="text-left pb-2 font-bold tracking-wider">Tipo</th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Descuento
              </th>
              <th className="text-left pb-2 font-bold tracking-wider">
                Condición
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Estado
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {reglas.map((regla) => (
              <tr
                key={regla.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5">
                  <div className="font-semibold text-white">{regla.nombre}</div>
                </td>
                <td className="py-2.5 text-gray-300">{regla.tipo}</td>
                <td className="py-2.5 text-right font-bold text-white">
                  {regla.valor}
                </td>
                <td className="py-2.5 text-gray-300">{regla.condicion}</td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      regla.activo
                        ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                        : "bg-white/5 text-gray-400 border border-white/5"
                    }`}
                  >
                    {regla.activo ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Editar"
                    >
                      <i className="ti-pencil text-sm"></i>
                    </button>
                    <button
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title={regla.activo ? "Desactivar" : "Activar"}
                    >
                      <i
                        className={`ti-${regla.activo ? "x" : "check"} text-sm`}
                      ></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rangos de precio por categoría */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
          Rangos de precio por categoría
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { categoria: "Manga", min: 50000, max: 80000, promedio: 62000 },
            { categoria: "Cómic", min: 70000, max: 90000, promedio: 80000 },
            { categoria: "Arte", min: 100000, max: 150000, promedio: 120000 },
          ].map((cat) => (
            <div
              key={cat.categoria}
              className="bg-white/5 rounded-xl p-4 border border-white/5"
            >
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                {cat.categoria}
              </div>
              <div className="space-y-2">
                {[
                  { label: "Mínimo", value: cat.min },
                  { label: "Promedio", value: cat.promedio },
                  { label: "Máximo", value: cat.max },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="text-white font-semibold">
                      ${row.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreciosView;
