import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TbX, TbDeviceFloppy, TbLoader2, TbTag } from "react-icons/tb";
import { crearReglaPrecio } from "../../../services/adminService";
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

const ModalAgregarOferta = ({ onClose, onSuccess }) => {
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      tipo: "Porcentaje",
      valor: "",
      condicion: CONDICIONES_OFERTA[0],
    },
  });

  const tipo = watch("tipo");

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      await crearReglaPrecio(data);
      toast.success("Oferta creada", {
        description: `"${data.nombre}" fue agregada correctamente.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al crear la oferta", {
        description:
          error.response?.data?.mensaje ||
          error.response?.data?.errores?.[0]?.msg ||
          "Inténtalo de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl w-full max-w-lg border border-white/10 text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-green/10 border border-accent-green/20">
              <TbTag size={16} className="text-accent-green" />
            </div>
            <h2 className="font-poppins text-base font-bold text-white">
              Agregar oferta
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form
            id="form-agregar-oferta"
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
                placeholder="Ej: Black Friday, Descuento de temporada..."
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
                placeholder={tipo === "Porcentaje" ? "Ej: 15" : "Ej: 10000"}
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
              hint="Define a qué productos o situaciones aplica esta oferta"
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
          </form>
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
            form="form-agregar-oferta"
            disabled={enviando}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-lg bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green hover:text-bg transition-all cursor-pointer"
          >
            {enviando ? (
              <>
                <TbLoader2 size={14} className="animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <TbDeviceFloppy size={14} />
                Crear oferta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarOferta;
