import { useState, useEffect } from "react";
import { obtenerConfiguracion } from "../../services/adminService";

const ConfiguracionView = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerConfiguracion();
        setConfig(data.configuracion);
      } catch {
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Cargando configuración...</p>;
  }

  if (!config) {
    return (
      <p className="text-gray-400 text-sm">No se pudo cargar la configuración.</p>
    );
  }

  const camposTienda = [
    { label: "Nombre de la tienda", type: "text", value: config.tienda.nombre },
    { label: "Email de contacto", type: "email", value: config.tienda.email },
    { label: "Teléfono", type: "tel", value: config.tienda.telefono },
    { label: "Dirección", type: "text", value: config.tienda.direccion },
  ];

  const camposPedidos = [
    {
      label: "Pedido mínimo",
      desc: "Monto mínimo para realizar un pedido",
      value: config.pedidos.pedidoMinimo,
    },
    {
      label: "Envío gratis desde",
      desc: "Monto mínimo para envío gratuito",
      value: config.pedidos.envioGratisDesde,
    },
    {
      label: "Costo de envío",
      desc: "Costo estándar de envío",
      value: config.pedidos.costoEnvio,
    },
    {
      label: "IVA (%)",
      desc: "Porcentaje de IVA aplicado",
      value: config.pedidos.iva,
    },
  ];

  const camposInventario = [
    {
      label: "Umbral de stock bajo",
      desc: "Cantidad mínima antes de alertar",
      value: config.inventario.umbralStockBajo,
    },
    {
      label: "Alerta de stock crítico",
      desc: "Notificar cuando el stock sea menor o igual a este valor",
      value: config.inventario.umbralStockCritico,
    },
  ];

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-5 border-b border-white/5 pb-2.5">
          Información de la tienda
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {camposTienda.map((field) => (
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

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
          Configuración de pedidos
        </div>
        <div>
          {camposPedidos.map((item, i, arr) => (
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

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-5 border-b border-white/5 pb-2.5">
          Configuración de inventario
        </div>
        <div>
          {camposInventario.map((item, i, arr) => (
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

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
          Métodos de pago
        </div>
        <div>
          {config.metodosPago.map((metodo, index, arr) => (
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

      {config.notificaciones?.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
            Notificaciones
          </div>
          <div>
            {config.notificaciones.map((notif, index, arr) => (
              <div
                key={notif.nombre}
                className={`flex items-center justify-between py-3.5 ${index < arr.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    {notif.nombre}
                  </div>
                  <div className="text-[10px] text-gray-400">{notif.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={notif.activo}
                  />
                  <div className="w-9 h-5 bg-[#13151b] border border-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue peer-checked:after:bg-white"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionView;
