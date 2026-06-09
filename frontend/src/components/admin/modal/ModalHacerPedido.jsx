import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  TbX,
  TbSend,
  TbLoader2,
  TbPlus,
  TbTrash,
  TbShoppingBag,
  TbNotes,
} from "react-icons/tb";
import { crearPedidoProveedor } from "../../../services/adminService";
import { formatearMoneda } from "../../../utils/formatters";

const inputCls =
  "w-full text-xs px-3 py-2.5 rounded-lg border border-white/10 bg-[#13151b] text-white focus:outline-none focus:border-accent-blue transition-colors";

const ModalHacerPedido = ({ proveedor, onClose, onSuccess }) => {
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ nombre: "", cantidad: 1, precioUnitario: 0 }],
      notas: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const total = (watchItems || []).reduce((acc, item) => {
    const cant = parseFloat(item.cantidad) || 0;
    const precio = parseFloat(item.precioUnitario) || 0;
    return acc + cant * precio;
  }, 0);

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
    const itemsValidos = data.items.filter(
      (i) => i.nombre.trim() && Number(i.cantidad) > 0,
    );
    if (itemsValidos.length === 0) {
      toast.error("Agrega al menos un producto válido");
      return;
    }

    setEnviando(true);
    try {
      await crearPedidoProveedor(proveedor._id, {
        items: itemsValidos.map((i) => ({
          nombre: i.nombre.trim(),
          cantidad: Number(i.cantidad),
          precioUnitario: Number(i.precioUnitario),
        })),
        notas: data.notas || "",
      });
      toast.success("Pedido creado", {
        description: `Pedido registrado para ${proveedor.nombre}.`,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Error al crear el pedido", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col glass-panel rounded-2xl border border-white/10 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
              <TbShoppingBag size={16} className="text-accent-purple" />
            </div>
            <div>
              <h2 className="font-poppins text-base font-bold text-white">
                Nuevo pedido
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {proveedor.nombre}
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
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form
            id="form-pedido-proveedor"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Items table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">
                  Productos del pedido
                </span>
                <button
                  type="button"
                  onClick={() =>
                    append({ nombre: "", cantidad: 1, precioUnitario: 0 })
                  }
                  className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue hover:bg-accent-blue/20 transition-all cursor-pointer"
                >
                  <TbPlus size={11} />
                  Agregar línea
                </button>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_72px_96px_28px] gap-2 px-1 mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  Producto
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 text-center">
                  Cant.
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 text-right">
                  Precio unit.
                </span>
                <span />
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => {
                  const cant = parseFloat(watchItems?.[index]?.cantidad) || 0;
                  const precio =
                    parseFloat(watchItems?.[index]?.precioUnitario) || 0;
                  const subtotal = cant * precio;

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_72px_96px_28px] gap-2 items-start"
                    >
                      {/* Nombre */}
                      <div>
                        <input
                          type="text"
                          placeholder="Nombre del producto"
                          {...register(`items.${index}.nombre`, {
                            required: "Requerido",
                          })}
                          className={`${inputCls} ${errors.items?.[index]?.nombre ? "border-red-500/50" : ""}`}
                        />
                        {subtotal > 0 && (
                          <div className="text-[9px] text-gray-500 mt-0.5 text-right pr-1">
                            Subtotal: {formatearMoneda(subtotal)}
                          </div>
                        )}
                      </div>

                      {/* Cantidad */}
                      <input
                        type="number"
                        min={1}
                        placeholder="1"
                        {...register(`items.${index}.cantidad`, {
                          required: true,
                          min: 1,
                        })}
                        className={`${inputCls} text-center`}
                      />

                      {/* Precio unitario */}
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register(`items.${index}.precioUnitario`, {
                          required: true,
                          min: 0,
                        })}
                        className={`${inputCls} text-right`}
                      />

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length === 1}
                        className="mt-0.5 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer bg-transparent border-none disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <TbTrash size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-3 flex justify-end">
                <div className="bg-white/5 rounded-lg px-4 py-2.5 border border-white/10 flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Total del pedido
                  </span>
                  <span className="text-base font-bold text-white font-poppins">
                    {formatearMoneda(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <TbNotes size={11} />
                Notas del pedido
              </label>
              <textarea
                rows={2}
                placeholder="Instrucciones especiales, plazos de entrega, condiciones…"
                {...register("notas")}
                className={`${inputCls} resize-none`}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/5 flex-shrink-0">
          <div className="text-[10px] text-gray-500">
            Proveedor:{" "}
            <span className="text-gray-300 font-semibold">
              {proveedor.nombre}
            </span>
          </div>
          <div className="flex gap-3">
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
              form="form-pedido-proveedor"
              disabled={enviando || total === 0}
              className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-lg bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple hover:text-bg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <TbLoader2 size={14} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <TbSend size={14} />
                  Registrar pedido
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHacerPedido;
