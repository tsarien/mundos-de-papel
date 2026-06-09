import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TbDeviceFloppy, TbLoader2, TbRefresh } from "react-icons/tb";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from "../../services/adminService";

const inputCls =
  "w-full text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#232632] text-white focus:outline-none focus:border-accent-blue transition-colors";

const ConfiguracionView = () => {
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [configOriginal, setConfigOriginal] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await obtenerConfiguracion();
      const cfg = data.configuracion;
      setConfigOriginal(cfg);
      // Flatten for react-hook-form
      reset(flattenConfig(cfg));
    } catch {
      toast.error("No se pudo cargar la configuración");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const flattenConfig = (cfg) => ({
    "tienda.nombre": cfg.tienda?.nombre || "",
    "tienda.email": cfg.tienda?.email || "",
    "tienda.telefono": cfg.tienda?.telefono || "",
    "tienda.direccion": cfg.tienda?.direccion || "",
    "pedidos.pedidoMinimo": cfg.pedidos?.pedidoMinimo ?? 30000,
    "pedidos.envioGratisDesde": cfg.pedidos?.envioGratisDesde ?? 100000,
    "pedidos.costoEnvio": cfg.pedidos?.costoEnvio ?? 10000,
    "pedidos.iva": cfg.pedidos?.iva ?? 19,
    "inventario.umbralStockBajo": cfg.inventario?.umbralStockBajo ?? 5,
    "inventario.umbralStockCritico": cfg.inventario?.umbralStockCritico ?? 2,
    ...Object.fromEntries(
      (cfg.metodosPago || []).map((m, i) => [
        `metodosPago.${i}.activo`,
        m.activo,
      ]),
    ),
    ...Object.fromEntries(
      (cfg.notificaciones || []).map((n, i) => [
        `notificaciones.${i}.activo`,
        n.activo,
      ]),
    ),
  });

  const onSubmit = async (formData) => {
    setGuardando(true);
    try {
      const metodosPago = (configOriginal.metodosPago || []).map((m, i) => ({
        ...m,
        activo: formData[`metodosPago.${i}.activo`] ?? m.activo,
      }));
      const notificaciones = (configOriginal.notificaciones || []).map(
        (n, i) => ({
          ...n,
          activo: formData[`notificaciones.${i}.activo`] ?? n.activo,
        }),
      );

      const payload = {
        tienda: {
          nombre: formData["tienda.nombre"],
          email: formData["tienda.email"],
          telefono: formData["tienda.telefono"],
          direccion: formData["tienda.direccion"],
        },
        pedidos: {
          pedidoMinimo: Number(formData["pedidos.pedidoMinimo"]),
          envioGratisDesde: Number(formData["pedidos.envioGratisDesde"]),
          costoEnvio: Number(formData["pedidos.costoEnvio"]),
          iva: Number(formData["pedidos.iva"]),
        },
        inventario: {
          umbralStockBajo: Number(formData["inventario.umbralStockBajo"]),
          umbralStockCritico: Number(formData["inventario.umbralStockCritico"]),
        },
        metodosPago,
        notificaciones,
      };

      const res = await actualizarConfiguracion(payload);
      setConfigOriginal(res.configuracion);
      reset(flattenConfig(res.configuracion));
      toast.success("Configuración guardada", {
        description: "Los cambios se aplicarán en toda la tienda.",
      });
    } catch (error) {
      toast.error("Error al guardar", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <TbLoader2 size={24} className="animate-spin text-accent-blue" />
      </div>
    );
  }

  if (!configOriginal) {
    return (
      <p className="text-gray-400 text-sm">
        No se pudo cargar la configuración.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 text-white"
    >
      {/* Botón guardar flotante si hay cambios */}
      {isDirty && (
        <div className="glass-panel rounded-xl px-4 py-3 border border-accent-blue/30 bg-accent-blue/5 flex items-center justify-between">
          <span className="text-xs text-accent-blue font-semibold">
            Tienes cambios sin guardar
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cargar}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer bg-transparent"
            >
              <TbRefresh size={13} />
              Descartar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer disabled:opacity-50"
            >
              {guardando ? (
                <TbLoader2 size={13} className="animate-spin" />
              ) : (
                <TbDeviceFloppy size={13} />
              )}
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {/* Información de la tienda */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-5 border-b border-white/5 pb-2.5">
          Información de la tienda
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Nombre de la tienda",
              key: "tienda.nombre",
              type: "text",
            },
            { label: "Email de contacto", key: "tienda.email", type: "email" },
            { label: "Teléfono", key: "tienda.telefono", type: "tel" },
            { label: "Dirección", key: "tienda.direccion", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                {...register(field.key)}
                className={inputCls}
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
              label: "Pedido mínimo (COP)",
              desc: "Monto mínimo para realizar un pedido",
              key: "pedidos.pedidoMinimo",
            },
            {
              label: "Envío gratis desde (COP)",
              desc: "Monto mínimo para envío gratuito",
              key: "pedidos.envioGratisDesde",
            },
            {
              label: "Costo de envío (COP)",
              desc: "Costo estándar de envío",
              key: "pedidos.costoEnvio",
            },
            {
              label: "IVA (%)",
              desc: "Porcentaje de IVA aplicado",
              key: "pedidos.iva",
            },
          ].map((item, i, arr) => (
            <div
              key={item.key}
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
                {...register(item.key)}
                className="w-32 text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#232632] text-white text-right focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Inventario */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-5 border-b border-white/5 pb-2.5">
          Configuración de inventario
        </div>
        <div>
          {[
            {
              label: "Umbral de stock bajo",
              desc: "Cantidad mínima antes de alertar",
              key: "inventario.umbralStockBajo",
            },
            {
              label: "Alerta de stock crítico",
              desc: "Notificar cuando el stock sea menor o igual a este valor",
              key: "inventario.umbralStockCritico",
            },
          ].map((item, i, arr) => (
            <div
              key={item.key}
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
                {...register(item.key)}
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
          {(configOriginal.metodosPago || []).map((metodo, index, arr) => (
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
                  {...register(`metodosPago.${index}.activo`)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#13151b] border border-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue peer-checked:after:bg-white" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notificaciones */}
      {configOriginal.notificaciones?.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-5 border-b border-white/5 pb-2.5">
            Notificaciones del sistema
          </div>
          <div>
            {configOriginal.notificaciones.map((notif, index, arr) => (
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
                    {...register(`notificaciones.${index}.activo`)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#13151b] border border-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue peer-checked:after:bg-white" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón guardar fijo al final */}
      <div className="flex justify-end pb-2">
        <button
          type="submit"
          disabled={guardando || !isDirty}
          className="flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {guardando ? (
            <>
              <TbLoader2 size={14} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <TbDeviceFloppy size={14} />
              Guardar configuración
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ConfiguracionView;
