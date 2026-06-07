import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TbX,
  TbDeviceFloppy,
  TbLoader2,
  TbEdit,
  TbTrash,
  TbAlertTriangle,
} from "react-icons/tb";
import {
  actualizarReglaPrecio,
  eliminarReglaPrecio,
} from "../../../services/adminService";
import { CONDICIONES_OFERTA } from "../../../utils/constants";

const inputCls =
  "py-2 px-3 rounded-lg border border-white/10 bg-[#13151b] text-white text-xs focus:outline-none focus:border-accent-blue transition-colors w-full";

const FieldModal = ({ label, error, children, full = false, hint }) => (
  <div className={`flex flex-col gap-1.5 ${full ? "col-span-full" : ""}`}>
    <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">
      {label}
    </span>
    {children}
    {hint && !error && (
      <span className="text-[10px] text-gray-600">{hint}</span>
    )}
    {error && (
      <span className="text-red-400 text-[10px] mt-0.5">{error.message}</span>
    )}
  </div>
);

const ModalEditarOferta = ({ regla, onClose, onSuccess }) => {
  const [enviando, setEnviando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: regla.nombre || "",
      tipo: regla.tipo || "Porcentaje",
      valor: regla.valor || "",
      condicion: CONDICIONES_OFERTA.includes(regla.condicion)
        ? regla.condicion
        : CONDICIONES_OFERTA[0],
      activo: regla.activo ?? true,
    },
  });

  const tipo = watch("tipo");

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      await actualizarReglaPrecio(regla._id, data);
      toast.success("Oferta actualizada", {
        description: `"${data.nombre}" fue guardada correctamente.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al actualizar la oferta", {
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
      await eliminarReglaPrecio(regla._id);
      toast.success("Oferta eliminada", {
        description: `"${regla.nombre}" fue borrada correctamente.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al eliminar la oferta", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl w-full max-w-lg border border-white/10 text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
              <TbEdit size={16} className="text-accent-blue" />
            </div>
            <div>
              <h2 className="font-poppins text-base font-bold text-white">
                Editar oferta
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">{regla.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          {/* ── Edit form ── */}
          <form
            id="form-editar-oferta"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <FieldModal
              label="Nombre de la oferta *"
              error={errors.nombre}
              full
            >
              <input
                type="text"
                {...register("nombre", {
                  required: "El nombre es requerido",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
                className={inputCls}
              />
            </FieldModal>

            <FieldModal label="Tipo de descuento *" error={errors.tipo}>
              <select
                {...register("tipo", { required: "El tipo es requerido" })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="Porcentaje">Porcentaje (%)</option>
                <option value="Fijo">Valor fijo (COP)</option>
              </select>
            </FieldModal>

            <FieldModal
              label={tipo === "Porcentaje" ? "Valor (%) *" : "Valor (COP) *"}
              error={errors.valor}
              hint={
                tipo === "Porcentaje"
                  ? "Ej: 15 para un 15% de descuento"
                  : "Ej: 10000 para $10.000 de descuento"
              }
            >
              <input
                type="text"
                {...register("valor", {
                  required: "El valor es requerido",
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: "Ingresa solo números",
                  },
                })}
                className={inputCls}
              />
            </FieldModal>

            {/* ── Condición: dropdown estandarizado ── */}
            <FieldModal
              label="Condición *"
              error={errors.condicion}
              hint="Define a qué productos o situaciones aplica"
            >
              <select
                {...register("condicion", {
                  required: "La condición es requerida",
                })}
                className={`${inputCls} cursor-pointer`}
              >
                {CONDICIONES_OFERTA.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FieldModal>

            <FieldModal label="Estado" full>
              <div className="flex items-center gap-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    {...register("activo")}
                    className="accent-accent-blue w-3.5 h-3.5 cursor-pointer"
                  />
                  Regla activa
                </label>
                <span className="text-[10px] text-gray-600">
                  Las reglas inactivas no se aplican en la tienda
                </span>
              </div>
            </FieldModal>
          </form>

          {/* ── Danger zone ── */}
          {!confirmDelete ? (
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">
                Zona de peligro
              </div>
              <p className="text-[11px] text-gray-400 mb-3">
                Eliminar esta regla la borrará permanentemente de la tienda.
              </p>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <TbTrash size={13} />
                Eliminar oferta
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <TbAlertTriangle size={15} className="text-red-400 shrink-0" />
                <div className="text-[11px] font-bold text-red-300">
                  ¿Confirmar eliminación?
                </div>
              </div>
              <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                La oferta{" "}
                <strong className="text-white">"{regla.nombre}"</strong> será
                borrada definitivamente. No hay marcha atrás.
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
                      Sí, eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
            form="form-editar-oferta"
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
      </div>
    </div>
  );
};

export default ModalEditarOferta;
