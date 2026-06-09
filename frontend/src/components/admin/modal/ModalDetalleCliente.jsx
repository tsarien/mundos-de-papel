import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TbX,
  TbDeviceFloppy,
  TbLoader2,
  TbTrash,
  TbUser,
  TbAlertTriangle,
  TbShoppingBag,
} from "react-icons/tb";
import { formatearFecha } from "../../../utils/formatters.js";
import {
  obtenerDetalleCliente,
  actualizarCliente,
  eliminarCliente,
} from "../../../services/adminService";

const inputCls =
  "py-2 px-3 rounded-lg border border-white/10 bg-[#13151b] text-white text-xs focus:outline-none focus:border-accent-blue transition-colors w-full";

const claseEstadoCliente = (estado) => {
  if (estado === "VIP")
    return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
  if (estado === "Nuevo")
    return "bg-accent-green/10 text-accent-green border-accent-green/20";
  return "bg-white/5 text-gray-300 border-white/10";
};

const FieldModal = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">
      {label}
    </span>
    {children}
    {error && (
      <span className="text-red-400 text-[10px] mt-0.5">{error.message}</span>
    )}
  </div>
);

const StatMini = ({ label, valor }) => (
  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
    <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">
      {label}
    </div>
    <div className="text-sm font-bold text-white font-poppins">{valor}</div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <section>
    <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
      {icon && (
        <svg
          className="w-3 h-3 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={icon}
          />
        </svg>
      )}
      {title}
    </div>
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      {children}
    </div>
  </section>
);

const ModalDetalleCliente = ({ clienteResumen, onClose, onSuccess }) => {
  const [loadingDetalle, setLoadingDetalle] = useState(true);
  const [detalleCliente, setDetalleCliente] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const clienteId = clienteResumen.id || clienteResumen._id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingDetalle(true);
        const data = await obtenerDetalleCliente(clienteId);
        const c = data.cliente;
        setDetalleCliente(c);
        reset({
          nombre: c.nombre || "",
          apellido: c.apellido || "",
          email: c.email || "",
          telefono: c.telefono || "",
          direccion: c.direccion || "",
        });
      } catch {
        toast.error("No se pudo cargar el cliente");
        onClose();
      } finally {
        setLoadingDetalle(false);
      }
    };
    cargar();
  }, [clienteId]);

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      await actualizarCliente(clienteId, data);
      toast.success("Perfil actualizado", {
        description: `Los datos de ${data.nombre} fueron guardados correctamente.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al actualizar", {
        description:
          error.response?.data?.mensaje ||
          error.response?.data?.errores?.[0]?.msg ||
          "Inténtalo de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await eliminarCliente(clienteId);
      toast.success("Cuenta eliminada", {
        description: `La cuenta de ${detalleCliente?.nombre} fue borrada permanentemente.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al eliminar", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-2xl w-full max-w-2xl border border-white/10 text-white shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
              <TbUser size={16} className="text-accent-purple" />
            </div>
            <div>
              <h2 className="font-poppins text-base font-bold text-white">
                Detalle del cliente
              </h2>
              {detalleCliente && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500">
                    {detalleCliente.email}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${claseEstadoCliente(clienteResumen.estado)}`}
                  >
                    {clienteResumen.estado}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        {loadingDetalle ? (
          <div className="flex items-center justify-center flex-1 py-16">
            <TbLoader2 size={28} className="animate-spin text-accent-blue" />
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <StatMini
                  label="Total pedidos"
                  valor={clienteResumen.pedidos}
                />
                <StatMini
                  label="Total comprado"
                  valor={`$${clienteResumen.total.toLocaleString()}`}
                />
                <StatMini
                  label="Miembro desde"
                  valor={formatearFecha(detalleCliente?.createdAt)}
                />
              </div>

              {/* Edit form */}
              <Section
                title="Información personal"
                icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              >
                <form
                  id="form-editar-cliente"
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <FieldModal label="Nombre *" error={errors.nombre}>
                    <input
                      type="text"
                      {...register("nombre", {
                        required: "El nombre es requerido",
                      })}
                      className={inputCls}
                    />
                  </FieldModal>

                  <FieldModal label="Apellido *" error={errors.apellido}>
                    <input
                      type="text"
                      {...register("apellido", {
                        required: "El apellido es requerido",
                      })}
                      className={inputCls}
                    />
                  </FieldModal>

                  <FieldModal label="Email *" error={errors.email}>
                    <input
                      type="email"
                      {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Email inválido",
                        },
                      })}
                      className={inputCls}
                    />
                  </FieldModal>

                  <FieldModal label="Teléfono" error={errors.telefono}>
                    <input
                      type="text"
                      {...register("telefono")}
                      placeholder="Ej: +57 300 123 4567"
                      className={inputCls}
                    />
                  </FieldModal>

                  <FieldModal label="Dirección" error={errors.direccion}>
                    <input
                      type="text"
                      {...register("direccion")}
                      placeholder="Dirección habitual de envío"
                      className={`${inputCls} sm:col-span-2`}
                    />
                  </FieldModal>
                </form>
              </Section>

              {/* Recent orders */}
              {detalleCliente?.pedidosRecientes?.length > 0 && (
                <Section
                  title={`Pedidos recientes (${detalleCliente.pedidosRecientes.length})`}
                  icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                >
                  <div className="flex flex-col divide-y divide-white/5">
                    {detalleCliente.pedidosRecientes.map((pedido, i) => (
                      <div
                        key={pedido._id || i}
                        className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <TbShoppingBag
                            size={13}
                            className="text-gray-600 shrink-0"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              #
                              {(pedido._id?.toString() || "")
                                .slice(-4)
                                .toUpperCase()}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {formatearFecha(pedido.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white">
                          ${pedido.total?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Danger zone */}
              {!confirmDelete ? (
                <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">
                    Zona de peligro
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                    Borrar la cuenta elimina permanentemente al cliente y todos
                    sus datos. Esta acción no se puede deshacer.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <TbTrash size={13} />
                    Borrar cuenta
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <TbAlertTriangle
                      size={16}
                      className="text-red-400 shrink-0"
                    />
                    <div className="text-[11px] font-bold text-red-300">
                      ¿Confirmar eliminación permanente?
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">
                    Esto borrará definitivamente la cuenta de{" "}
                    <strong className="text-white">
                      {detalleCliente?.nombre} {detalleCliente?.apellido}
                    </strong>{" "}
                    junto con todos sus datos. No hay marcha atrás.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      disabled={eliminando}
                      className="text-xs font-bold px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer bg-transparent"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleEliminar}
                      disabled={eliminando}
                      className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      {eliminando ? (
                        <>
                          <TbLoader2 size={13} className="animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <TbTrash size={13} />
                          Sí, eliminar definitivamente
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer bg-transparent"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-editar-cliente"
                disabled={enviando}
                className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-lg bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple hover:text-bg transition-all cursor-pointer"
              >
                {enviando ? (
                  <>
                    <TbLoader2 size={14} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <TbDeviceFloppy size={14} />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalDetalleCliente;
