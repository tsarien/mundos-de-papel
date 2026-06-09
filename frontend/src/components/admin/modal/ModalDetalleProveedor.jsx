import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TbX,
  TbDeviceFloppy,
  TbLoader2,
  TbBuildingStore,
  TbTrash,
  TbAlertTriangle,
  TbPackage,
  TbPlus,
  TbEdit,
} from "react-icons/tb";
import {
  obtenerDetalleProveedor,
  actualizarProveedor,
  eliminarProveedor,
  actualizarEstadoPedidoProveedor,
  eliminarPedidoProveedor,
} from "../../../services/adminService";
import { formatearFecha } from "../../../utils/formatters";

const ESTADOS_PEDIDO_PROV = [
  {
    valor: "activo",
    label: "Activo",
    cls: "bg-accent-green/10 text-accent-green border-accent-green/20",
  },
  {
    valor: "en_proceso",
    label: "En proceso",
    cls: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  },
  {
    valor: "incompleto",
    label: "Incompleto",
    cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  {
    valor: "cancelado",
    label: "Cancelado",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
  },
];

const clsEstadoPedido = (v) =>
  ESTADOS_PEDIDO_PROV.find((e) => e.valor === v)?.cls ??
  "bg-white/5 text-gray-300 border-white/10";

const labelEstadoPedido = (v) =>
  ESTADOS_PEDIDO_PROV.find((e) => e.valor === v)?.label ?? v;

const inputCls =
  "w-full text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#13151b] text-white focus:outline-none focus:border-accent-blue transition-colors";

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    {children}
    {error && <span className="text-red-400 text-[10px]">{error.message}</span>}
  </div>
);

const PedidoRow = ({ pedido, onEstadoChange, onEliminar }) => {
  const [estadoLocal, setEstadoLocal] = useState(pedido.estado);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [expandido, setExpandido] = useState(false);

  const handleEstado = async (nuevoEstado) => {
    setGuardando(true);
    try {
      await actualizarEstadoPedidoProveedor(pedido._id, nuevoEstado);
      setEstadoLocal(nuevoEstado);
      onEstadoChange(pedido._id, nuevoEstado);
      toast.success("Estado actualizado");
    } catch {
      toast.error("Error al actualizar estado");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await eliminarPedidoProveedor(pedido._id);
      onEliminar(pedido._id);
      toast.success("Pedido eliminado");
    } catch {
      toast.error("Error al eliminar pedido");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
      {/* Row header */}
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="flex-1 flex items-center gap-3 text-left cursor-pointer bg-transparent border-none"
        >
          <TbPackage size={14} className="text-accent-blue flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white">
              Pedido del {formatearFecha(pedido.createdAt)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {pedido.items?.length ?? 0} producto
              {pedido.items?.length !== 1 ? "s" : ""} ·{" "}
              <span className="text-white font-bold">
                ${pedido.total?.toLocaleString("es-CO")}
              </span>
            </div>
          </div>
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${clsEstadoPedido(estadoLocal)}`}
          >
            {labelEstadoPedido(estadoLocal)}
          </span>
        </button>
      </div>

      {/* Expanded detail */}
      {expandido && (
        <div className="border-t border-white/5 p-3 space-y-3">
          {/* Items */}
          <div className="space-y-1.5">
            {(pedido.items || []).map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
              >
                <span className="text-gray-300 flex-1 truncate">
                  {item.nombre}
                </span>
                <span className="text-gray-400 mx-3 flex-shrink-0">
                  {item.cantidad} ×{" "}
                  <span className="text-white">
                    ${item.precioUnitario?.toLocaleString("es-CO")}
                  </span>
                </span>
                <span className="text-white font-bold flex-shrink-0">
                  ${item.subtotal?.toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>

          {pedido.notas && (
            <p className="text-[10px] text-gray-400 italic">
              Nota: {pedido.notas}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Cambiar estado:
            </span>
            {ESTADOS_PEDIDO_PROV.map((e) => (
              <button
                key={e.valor}
                type="button"
                onClick={() => handleEstado(e.valor)}
                disabled={guardando || estadoLocal === e.valor}
                className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer disabled:opacity-40 ${
                  estadoLocal === e.valor
                    ? e.cls + " opacity-100"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}
              >
                {guardando && estadoLocal !== e.valor ? (
                  <TbLoader2 size={9} className="animate-spin inline" />
                ) : null}{" "}
                {e.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleEliminar}
              disabled={eliminando}
              className="ml-auto flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {eliminando ? (
                <TbLoader2 size={9} className="animate-spin" />
              ) : (
                <TbTrash size={9} />
              )}
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ModalDetalleProveedor = ({
  proveedorId,
  onClose,
  onSuccess,
  onHacerPedido,
}) => {
  const [proveedor, setProveedor] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerDetalleProveedor(proveedorId);
      setProveedor(data.proveedor);
      setPedidos(data.pedidos || []);
      reset({
        nombre: data.proveedor.nombre || "",
        contacto: data.proveedor.contacto || "",
        telefono: data.proveedor.telefono || "",
        productos: data.proveedor.productos ?? 0,
      });
    } catch {
      toast.error("No se pudo cargar el proveedor");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [proveedorId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

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

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      await actualizarProveedor(proveedorId, {
        nombre: data.nombre,
        contacto: data.contacto,
        telefono: data.telefono,
        productos: Number(data.productos),
      });
      toast.success("Proveedor actualizado");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al actualizar", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await eliminarProveedor(proveedorId);
      toast.success("Proveedor eliminado");
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

  const handlePedidoEstado = (id, nuevoEstado) => {
    setPedidos((prev) =>
      prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p)),
    );
  };

  const handlePedidoEliminar = (id) => {
    setPedidos((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-panel rounded-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass-panel flex items-center justify-between px-6 py-4 border-b border-white/5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
              <TbBuildingStore size={16} className="text-accent-blue" />
            </div>
            <div>
              <h2 className="font-poppins text-base font-bold text-white">
                {loading ? "Cargando…" : proveedor?.nombre}
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Detalle del proveedor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {loading ? (
            <div className="flex items-center justify-center py-14">
              <TbLoader2 size={24} className="animate-spin text-accent-blue" />
            </div>
          ) : (
            <>
              {/* Edit form */}
              <section>
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-3">
                  Información del proveedor
                </div>
                <form
                  id="form-proveedor"
                  onSubmit={handleSubmit(onSubmit)}
                  className="bg-white/5 rounded-xl p-4 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <Field label="Nombre *" error={errors.nombre}>
                    <input
                      type="text"
                      {...register("nombre", {
                        required: "El nombre es requerido",
                      })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email de contacto *" error={errors.contacto}>
                    <input
                      type="text"
                      {...register("contacto", {
                        required: "El contacto es requerido",
                      })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Teléfono" error={errors.telefono}>
                    <input
                      type="text"
                      {...register("telefono")}
                      className={inputCls}
                    />
                  </Field>
                  <Field
                    label="Nº productos en catálogo"
                    error={errors.productos}
                  >
                    <input
                      type="number"
                      min={0}
                      {...register("productos")}
                      className={inputCls}
                    />
                  </Field>
                </form>
              </section>

              {/* Order history */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] text-accent-purple font-bold uppercase tracking-wider">
                    Historial de pedidos ({pedidos.length})
                  </div>
                  {onHacerPedido && (
                    <button
                      type="button"
                      onClick={() => onHacerPedido(proveedor)}
                      className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple hover:bg-accent-purple/20 transition-all cursor-pointer"
                    >
                      <TbPlus size={11} />
                      Nuevo pedido
                    </button>
                  )}
                </div>

                {pedidos.length === 0 ? (
                  <div className="bg-white/5 rounded-xl border border-white/5 p-6 flex flex-col items-center gap-2">
                    <TbPackage size={28} className="text-gray-600" />
                    <p className="text-xs text-gray-500">
                      Sin pedidos registrados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pedidos.map((pedido) => (
                      <PedidoRow
                        key={pedido._id}
                        pedido={pedido}
                        onEstadoChange={handlePedidoEstado}
                        onEliminar={handlePedidoEliminar}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Danger zone */}
              {!confirmDelete ? (
                <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">
                    Zona de peligro
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3">
                    Eliminar este proveedor borrará también todo su historial de
                    pedidos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <TbTrash size={13} />
                    Eliminar proveedor
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <TbAlertTriangle size={15} className="text-red-400" />
                    <div className="text-[11px] font-bold text-red-300">
                      ¿Confirmar eliminación?
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                    El proveedor{" "}
                    <strong className="text-white">
                      "{proveedor?.nombre}"
                    </strong>{" "}
                    y todos sus pedidos serán eliminados permanentemente.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      disabled={eliminando}
                      className="text-xs font-bold px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer bg-transparent"
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
                        <TbLoader2 size={13} className="animate-spin" />
                      ) : (
                        <TbTrash size={13} />
                      )}
                      Sí, eliminar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="text-xs font-bold px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer bg-transparent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-proveedor"
              disabled={enviando || !isDirty}
              className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer disabled:opacity-40"
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
        )}
      </div>
    </div>
  );
};

export default ModalDetalleProveedor;
