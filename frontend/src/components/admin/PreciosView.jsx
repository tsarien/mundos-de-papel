import { useAdminData } from "../../hooks/useAdminData";
import StatCard from "./StatCard";

const PreciosView = () => {
  const { data: precios, loading } = useAdminData("precios");

  if (loading)
    return <p className="text-gray-400 text-sm">Cargando precios...</p>;
  if (!precios)
    return (
      <p className="text-gray-400 text-sm">
        No se pudieron cargar los precios.
      </p>
    );

  const reglasActivas = precios.reglas.filter((r) => r.activo).length;

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Precio promedio"
          valor={`$${Math.round(precios.precioPromedio / 1000)}K`}
          sub="Por producto"
        />
        <StatCard
          label="Productos en oferta"
          valor={precios.productosEnOferta}
          sub={`De ${precios.totalProductos} totales`}
        />
        <StatCard
          label="Reglas activas"
          valor={reglasActivas}
          sub="Políticas de precio"
        />
        <StatCard
          label="Descuento promedio"
          valor={`${precios.descuentoPromedio}%`}
          sub="En promociones"
        />
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Reglas de precio activas
          </div>
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
            </tr>
          </thead>
          <tbody>
            {precios.reglas.map((regla) => (
              <tr
                key={regla._id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5 font-semibold text-white">
                  {regla.nombre}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
          Rangos de precio por categoría
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {precios.categorias.map((cat) => (
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
