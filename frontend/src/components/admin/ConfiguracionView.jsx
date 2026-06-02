const ConfiguracionView = () => {
  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Información de la tienda */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-5 border-b border-white/5 pb-2.5">
          Información de la tienda
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Nombre de la tienda",
              type: "text",
              value: "Mundos de Papel",
            },
            {
              label: "Email de contacto",
              type: "email",
              value: "contacto@mundosdepapel.com",
            },
            { label: "Teléfono", type: "tel", value: "+57 300 123 4567" },
            {
              label: "Dirección",
              type: "text",
              value: "Calle 45 #67-89, Bogotá",
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                defaultValue={field.value}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#232632] text-white focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Configuración de pedidos */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
          Configuración de pedidos
        </div>
        <div>
          {[
            {
              label: "Pedido mínimo",
              desc: "Monto mínimo para realizar un pedido",
              value: "30000",
            },
            {
              label: "Envío gratis desde",
              desc: "Monto mínimo para envío gratuito",
              value: "100000",
            },
            {
              label: "Costo de envío",
              desc: "Costo estándar de envío",
              value: "10000",
            },
            {
              label: "IVA (%)",
              desc: "Porcentaje de IVA aplicado",
              value: "19",
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-3.5 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="flex-1">
                <div className="text-xs font-semibold text-white mb-0.5">
                  {item.label}
                </div>
                <div className="text-[10px] text-gray-400">{item.desc}</div>
              </div>
              <input
                type="number"
                defaultValue={item.value}
                className="w-32 text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#232632] text-white text-right focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Configuración de inventario */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-5 border-b border-white/5 pb-2.5">
          Configuración de inventario
        </div>
        <div>
          {[
            {
              label: "Umbral de stock bajo",
              desc: "Cantidad mínima antes de alertar",
              value: "5",
            },
            {
              label: "Alerta de stock crítico",
              desc: "Notificar cuando el stock sea menor o igual a este valor",
              value: "2",
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-3.5 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="flex-1">
                <div className="text-xs font-semibold text-white mb-0.5">
                  {item.label}
                </div>
                <div className="text-[10px] text-gray-400">{item.desc}</div>
              </div>
              <input
                type="number"
                defaultValue={item.value}
                className="w-32 text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#232632] text-white text-right focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
          Métodos de pago
        </div>
        <div>
          {[
            { nombre: "Tarjeta de crédito/débito", activo: true },
            { nombre: "Transferencia bancaria", activo: true },
            { nombre: "PSE", activo: true },
            { nombre: "Efectivo contra entrega", activo: true },
            { nombre: "Anticipo + saldo", activo: true },
          ].map((metodo, index, arr) => (
            <div
              key={metodo.nombre}
              className={`flex items-center justify-between py-3.5 ${index < arr.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="text-xs font-semibold text-white">
                {metodo.nombre}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={metodo.activo}
                />
                <div className="w-9 h-5 bg-[#13151b] border border-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue peer-checked:after:bg-white"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="glass-panel rounded-2xl p-6 border border-red-500/30">
        <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-5 border-b border-white/5 pb-2.5">
          Zona de peligro
        </div>
        <div>
          <div className="flex items-center justify-between py-3.5 border-b border-white/5">
            <div className="flex-1">
              <div className="text-xs font-semibold text-white mb-0.5">
                Exportar datos
              </div>
              <div className="text-[10px] text-gray-400">
                Descargar todos los datos del sistema
              </div>
            </div>
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              Exportar
            </button>
          </div>
          <div className="flex items-center justify-between py-3.5 border-b border-white/5">
            <div className="flex-1">
              <div className="text-xs font-semibold text-white mb-0.5">
                Limpiar caché
              </div>
              <div className="text-[10px] text-gray-400">
                Eliminar archivos temporales y caché del sistema
              </div>
            </div>
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              Limpiar
            </button>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex-1">
              <div className="text-xs font-semibold text-red-400 mb-0.5">
                Restablecer configuración
              </div>
              <div className="text-[10px] text-gray-400">
                Volver a los valores predeterminados
              </div>
            </div>
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer">
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2">
        <button className="text-[11px] font-bold px-4 py-2 rounded-lg border border-white/10 bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
          Cancelar
        </button>
        <button className="text-[11px] font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:opacity-90 hover:shadow-md transition-all border-none cursor-pointer">
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionView;
