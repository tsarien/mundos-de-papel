const AlertasView = () => {
  const alertas = [
    { 
      id: 1, 
      tipo: 'critico', 
      titulo: 'Stock crítico',
      mensaje: 'All-Star Superman tiene solo 2 unidades en stock',
      fecha: 'Hace 2 horas',
      icono: 'ti-alert-circle',
      accion: 'Reabastecer'
    },
    { 
      id: 2, 
      tipo: 'advertencia', 
      titulo: 'Pedido pendiente de pago',
      mensaje: 'Cliente Carlos Méndez debe segundo pago del pedido #2846',
      fecha: 'Hace 5 horas',
      icono: 'ti-credit-card',
      accion: 'Contactar'
    },
    { 
      id: 3, 
      tipo: 'advertencia', 
      titulo: 'Stock bajo',
      mensaje: '1001 Obras de Arte tiene 3 unidades. Umbral: 5',
      fecha: 'Hace 8 horas',
      icono: 'ti-alert-triangle',
      accion: 'Revisar'
    },
    { 
      id: 4, 
      tipo: 'info', 
      titulo: 'Nuevo cliente registrado',
      mensaje: 'Diego Torres se registró en la plataforma',
      fecha: 'Hace 1 día',
      icono: 'ti-user-plus',
      accion: 'Ver perfil'
    },
    { 
      id: 5, 
      tipo: 'info', 
      titulo: 'Pedido completado',
      mensaje: 'Pedido #2847 de Ana Torres fue entregado exitosamente',
      fecha: 'Hace 1 día',
      icono: 'ti-check-circle',
      accion: 'Ver detalles'
    },
    { 
      id: 6, 
      tipo: 'advertencia', 
      titulo: 'Retraso en envío',
      mensaje: 'Pedido #2843 está retrasado 2 días',
      fecha: 'Hace 2 días',
      icono: 'ti-clock',
      accion: 'Actualizar'
    },
  ];

  const alertasCriticas = alertas.filter(a => a.tipo === 'critico').length;
  const alertasAdvertencia = alertas.filter(a => a.tipo === 'advertencia').length;
  const alertasInfo = alertas.filter(a => a.tipo === 'info').length;

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen de alertas */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Total alertas
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {alertas.length}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Pendientes
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Críticas
          </div>
          <div className="font-serif text-[26px] text-[#8C1A1A]">
            {alertasCriticas}
          </div>
          <div className="text-[11px] text-[#8C1A1A] mt-1.5">
            Requieren atención
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Advertencias
          </div>
          <div className="font-serif text-[26px] text-[#8C5A0A]">
            {alertasAdvertencia}
          </div>
          <div className="text-[11px] text-[#8C5A0A] mt-1.5">
            Para revisar
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Información
          </div>
          <div className="font-serif text-[26px] text-[#1A3E6B]">
            {alertasInfo}
          </div>
          <div className="text-[11px] text-[#1A3E6B] mt-1.5">
            Notificaciones
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] font-medium text-[#1A1814]">
            Todas las alertas
          </div>
          <div className="flex gap-2">
            <button className="text-[12px] px-3 py-1.5 rounded-lg border border-black/14 bg-white text-[#1A1814] hover:bg-[#F0EDE6] transition-colors">
              Filtrar
            </button>
            <button className="text-[12px] px-3 py-1.5 rounded-lg border border-black/14 bg-white text-[#1A1814] hover:bg-[#F0EDE6] transition-colors">
              Marcar todas como leídas
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {alertas.map((alerta) => {
            const estilos = {
              critico: {
                bg: 'bg-[#FDEAEA]',
                border: 'border-[#8C1A1A]',
                iconBg: 'bg-[#8C1A1A]',
                iconColor: 'text-white',
                badge: 'bg-[#8C1A1A] text-white'
              },
              advertencia: {
                bg: 'bg-[#FDF3E0]',
                border: 'border-[#8C5A0A]',
                iconBg: 'bg-[#8C5A0A]',
                iconColor: 'text-white',
                badge: 'bg-[#8C5A0A] text-white'
              },
              info: {
                bg: 'bg-[#E6EEF8]',
                border: 'border-[#1A3E6B]',
                iconBg: 'bg-[#1A3E6B]',
                iconColor: 'text-white',
                badge: 'bg-[#1A3E6B] text-white'
              }
            };

            const estilo = estilos[alerta.tipo];

            return (
              <div 
                key={alerta.id} 
                className={`${estilo.bg} border-l-2 ${estilo.border} rounded-lg p-4 transition-all hover:shadow-sm`}
              >
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-lg ${estilo.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <i className={`${alerta.icono} text-base ${estilo.iconColor}`}></i>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-[13px] text-[#1A1814]">
                        {alerta.titulo}
                      </div>
                      <div className="text-[10px] text-[#9E9890]">
                        {alerta.fecha}
                      </div>
                    </div>
                    
                    <div className="text-[12px] text-[#6B6560] mb-2">
                      {alerta.mensaje}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-black/14 text-[#1A1814] hover:bg-[#F0EDE6] transition-colors">
                        {alerta.accion}
                      </button>
                      <button className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-black/14 text-[#6B6560] hover:bg-[#F0EDE6] transition-colors">
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
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Configuración de notificaciones
        </div>

        <div className="space-y-3">
          {[
            { nombre: 'Stock bajo', desc: 'Notificar cuando el stock esté por debajo del umbral', activo: true },
            { nombre: 'Nuevos pedidos', desc: 'Recibir alerta de cada nuevo pedido', activo: true },
            { nombre: 'Pagos pendientes', desc: 'Alertar sobre pagos pendientes después de 24h', activo: true },
            { nombre: 'Nuevos clientes', desc: 'Notificar cuando un nuevo cliente se registre', activo: false },
            { nombre: 'Reseñas nuevas', desc: 'Alertar sobre nuevas reseñas de productos', activo: false },
          ].map((config, index) => (
            <div key={index} className="flex items-start justify-between py-3 border-b border-black/8 last:border-0">
              <div className="flex-1">
                <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                  {config.nombre}
                </div>
                <div className="text-[11px] text-[#9E9890]">
                  {config.desc}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked={config.activo}
                />
                <div className="w-9 h-5 bg-[#F0EDE6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2D5016]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertasView;
