const AlertasView = () => {
  const alertas = [
    {
      id: 1,
      tipo: "critico",
      titulo: "Stock crítico",
      mensaje: "All-Star Superman tiene solo 2 unidades en stock",
      fecha: "Hace 2 horas",
      icono: "ti-alert-circle",
      accion: "Reabastecer",
    },
    {
      id: 2,
      tipo: "advertencia",
      titulo: "Pedido pendiente de pago",
      mensaje: "Cliente Carlos Méndez debe segundo pago del pedido #2846",
      fecha: "Hace 5 horas",
      icono: "ti-credit-card",
      accion: "Contactar",
    },
    {
      id: 3,
      tipo: "advertencia",
      titulo: "Stock bajo",
      mensaje: "1001 Obras de Arte tiene 3 unidades. Umbral: 5",
      fecha: "Hace 8 horas",
      icono: "ti-alert-triangle",
      accion: "Revisar",
    },
    {
      id: 4,
      tipo: "info",
      titulo: "Nuevo cliente registrado",
      mensaje: "Diego Torres se registró en la plataforma",
      fecha: "Hace 1 día",
      icono: "ti-user-plus",
      accion: "Ver perfil",
    },
    {
      id: 5,
      tipo: "info",
      titulo: "Pedido completado",
      mensaje: "Pedido #2847 de Ana Torres fue entregado exitosamente",
      fecha: "Hace 1 día",
      icono: "ti-check-circle",
      accion: "Ver detalles",
    },
    {
      id: 6,
      tipo: "advertencia",
      titulo: "Retraso en envío",
      mensaje: "Pedido #2843 está retrasado 2 días",
      fecha: "Hace 2 días",
      icono: "ti-clock",
      accion: "Actualizar",
    },
  ];

  const alertasCriticas = alertas.filter((a) => a.tipo === "critico").length;
  const alertasAdvertencia = alertas.filter(
    (a) => a.tipo === "advertencia",
  ).length;
  const alertasInfo = alertas.filter((a) => a.tipo === "info").length;

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Resumen de alertas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Total alertas
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {alertas.length}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Pendientes
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-red-500/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Críticas
          </div>
          <div className="font-poppins font-bold text-2xl text-red-400">
            {alertasCriticas}
          </div>
          <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider mt-2.5">
            Requieren atención
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Advertencias
          </div>
          <div className="font-poppins font-bold text-2xl text-yellow-500">
            {alertasAdvertencia}
          </div>
          <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider mt-2.5">
            Para revisar
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Información
          </div>
          <div className="font-poppins font-bold text-2xl text-accent-blue">
            {alertasInfo}
          </div>
          <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mt-2.5">
            Notificaciones
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Todas las alertas
          </div>
          <div className="flex gap-2">
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#232632] border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer">
              Filtrar
            </button>
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#232632] border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer">
              Marcar todas como leídas
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {alertas.map((alerta) => {
            const estilos = {
              critico: {
                bg: "bg-red-500/10",
                border: "border-red-500/30",
                iconBg: "bg-red-500/20",
                iconColor: "text-red-400",
                badge: "bg-red-500/20 text-red-300",
              },
              advertencia: {
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/30",
                iconBg: "bg-yellow-500/20",
                iconColor: "text-yellow-400",
                badge: "bg-yellow-500/20 text-yellow-300",
              },
              info: {
                bg: "bg-accent-blue/10",
                border: "border-accent-blue/30",
                iconBg: "bg-accent-blue/20",
                iconColor: "text-accent-blue",
                badge: "bg-accent-blue/20 text-accent-blue",
              },
            };

            const estilo = estilos[alerta.tipo];

            return (
              <div
                key={alerta.id}
                className={`${estilo.bg} border-l-2 ${estilo.border} rounded-xl p-4 transition-all hover:shadow-sm`}
              >
                <div className="flex gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg ${estilo.iconBg} flex items-center justify-center flex-shrink-0 border border-white/5`}
                  >
                    <i
                      className={`${alerta.icono} text-base ${estilo.iconColor}`}
                    ></i>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-xs text-white">
                        {alerta.titulo}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {alerta.fecha}
                      </div>
                    </div>

                    <div className="text-xs text-gray-300 mb-3">
                      {alerta.mensaje}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#13151b] border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer">
                        {alerta.accion}
                      </button>
                      <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-transparent border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                        Descartar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuración de alertas */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Configuración de notificaciones
        </div>

        <div className="space-y-3">
          {[
            {
              nombre: "Stock bajo",
              desc: "Notificar cuando el stock esté por debajo del umbral",
              activo: true,
            },
            {
              nombre: "Nuevos pedidos",
              desc: "Recibir alerta de cada nuevo pedido",
              activo: true,
            },
            {
              nombre: "Pagos pendientes",
              desc: "Alertar sobre pagos pendientes después de 24h",
              activo: true,
            },
            {
              nombre: "Nuevos clientes",
              desc: "Notificar cuando un nuevo cliente se registre",
              activo: false,
            },
            {
              nombre: "Reseñas nuevas",
              desc: "Alertar sobre nuevas reseñas de productos",
              activo: false,
            },
          ].map((config, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-3.5 border-b border-white/5 last:border-0"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="text-xs font-semibold text-white mb-1">
                  {config.nombre}
                </div>
                <div className="text-[10px] text-gray-400 font-medium">
                  {config.desc}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={config.activo}
                />
                <div className="w-9 h-5 bg-[#13151b] border border-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue peer-checked:after:bg-white"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertasView;
