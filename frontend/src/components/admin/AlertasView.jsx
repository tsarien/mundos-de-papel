import { tiempoRelativo } from "../../utils/formatters.js";
import { useAdminData } from "../../hooks/useAdminData";
import StatCard from "./StatCard";

const ESTILOS = {
  critico: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
  },
  advertencia: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  info: {
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/30",
    iconBg: "bg-accent-blue/20",
    iconColor: "text-accent-blue",
  },
};

const AlertasView = () => {
  const { data, loading } = useAdminData("alertas");

  if (loading)
    return <p className="text-gray-400 text-sm">Cargando alertas...</p>;
  if (!data)
    return (
      <p className="text-gray-400 text-sm">
        No se pudieron cargar las alertas.
      </p>
    );

  const { alertas, resumen } = data;

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total alertas"
          valor={resumen.total}
          sub="Pendientes"
        />
        <StatCard
          label="Críticas"
          valor={resumen.criticas}
          sub="Requieren atención"
          subColor="text-red-300"
          hoverColor="hover:border-red-500/30"
        />
        <StatCard
          label="Advertencias"
          valor={resumen.advertencias}
          sub="Para revisar"
          subColor="text-yellow-500"
        />
        <StatCard
          label="Información"
          valor={resumen.info}
          sub="Notificaciones"
          subColor="text-accent-blue"
        />
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Todas las alertas
          </div>
        </div>

        <div className="space-y-3.5">
          {alertas.map((alerta) => {
            const estilo = ESTILOS[alerta.tipo] ?? ESTILOS.info;
            return (
              <div
                key={alerta._id}
                className={`${estilo.bg} border-l-2 ${estilo.border} rounded-xl p-4 transition-all hover:shadow-sm`}
              >
                <div className="flex gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg ${estilo.iconBg} flex items-center justify-center flex-shrink-0 border border-white/5`}
                  >
                    <i
                      className={`${alerta.icono} text-base ${estilo.iconColor}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-xs text-white">
                        {alerta.titulo}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {tiempoRelativo(alerta.createdAt)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-300 mb-3">
                      {alerta.mensaje}
                    </div>
                    <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#13151b] border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer">
                      {alerta.accion}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertasView;
