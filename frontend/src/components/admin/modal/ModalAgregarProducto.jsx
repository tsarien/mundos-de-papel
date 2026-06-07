import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TbX, TbPhoto, TbDeviceFloppy, TbLoader2 } from "react-icons/tb";
import {
  crearProducto,
  subirImagenProducto,
} from "../../../services/adminService";

const inputCls =
  "py-2 px-3 rounded-lg border border-white/10 bg-[#13151b] text-white text-xs focus:outline-none focus:border-accent-blue transition-colors";

const FieldModal = ({ label, error, children, full = false }) => (
  <div className={`flex flex-col gap-1.5 ${full ? "col-span-full" : ""}`}>
    <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">
      {label}
    </span>
    {children}
    {error && (
      <span className="text-red-400 text-[10px] mt-0.5">{error.message}</span>
    )}
  </div>
);

const ModalAgregarProducto = ({ onClose, onSuccess, listaCategorias }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idioma: "Español España",
      presentacion: "Tapa Blanda",
      stock: 0,
      descuento: 0,
      enOferta: false,
      destacado: false,
    },
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const enOferta = watch("enOferta");

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      const result = await crearProducto({
        ...data,
        precio: Number(data.precio),
        paginas: Number(data.paginas),
        stock: Number(data.stock),
        descuento: Number(data.descuento),
      });
      if (imagenFile && result.producto?._id) {
        await subirImagenProducto(result.producto._id, imagenFile);
      }
      toast.success("Producto creado", {
        description: `"${data.nombre}" fue agregado al inventario.`,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error al crear producto", {
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
      <div className="glass-panel rounded-2xl w-full max-w-2xl border border-white/10 text-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <h2 className="font-poppins text-lg font-bold text-accent-blue">
            Agregar producto
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form
            id="form-producto"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Campos según el original, mismo contenido */}
            <FieldModal label="Nombre *" error={errors.nombre} full>
              <input
                type="text"
                placeholder="Ej. Dragon Ball Z Vol. 1"
                {...register("nombre", { required: "El nombre es requerido" })}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Autor *" error={errors.autor}>
              <input
                type="text"
                placeholder="Ej. Akira Toriyama"
                {...register("autor", { required: "El autor es requerido" })}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Editorial *" error={errors.editorial}>
              <input
                type="text"
                placeholder="Ej. Planeta Cómic"
                {...register("editorial", {
                  required: "La editorial es requerida",
                })}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Categoría *" error={errors.categoria}>
              <select
                {...register("categoria", {
                  required: "La categoría es requerida",
                })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Selecciona una categoría</option>
                {listaCategorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </FieldModal>
            <FieldModal label="Precio (COP) *" error={errors.precio}>
              <input
                type="number"
                min="0"
                placeholder="Ej. 45000"
                {...register("precio", {
                  required: "El precio es requerido",
                  min: { value: 0, message: "Debe ser mayor a 0" },
                })}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Páginas *" error={errors.paginas}>
              <input
                type="number"
                min="1"
                placeholder="Ej. 192"
                {...register("paginas", {
                  required: "Las páginas son requeridas",
                  min: { value: 1, message: "Mínimo 1 página" },
                })}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Stock *" error={errors.stock}>
              <input
                type="number"
                min="0"
                placeholder="Ej. 25"
                {...register("stock", {
                  required: "El stock es requerido",
                  min: { value: 0, message: "No puede ser negativo" },
                })}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Idioma" error={errors.idioma}>
              <input
                type="text"
                placeholder="Español España"
                {...register("idioma")}
                className={inputCls}
              />
            </FieldModal>
            <FieldModal label="Presentación" error={errors.presentacion}>
              <select
                {...register("presentacion")}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="Tapa Blanda">Tapa Blanda</option>
                <option value="Tapa Dura">Tapa Dura</option>
                <option value="Digital">Digital</option>
              </select>
            </FieldModal>
            <FieldModal label="Descripción *" error={errors.descripcion} full>
              <textarea
                rows={3}
                placeholder="Descripción breve del producto..."
                {...register("descripcion", {
                  required: "La descripción es requerida",
                  maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
                })}
                className={`${inputCls} resize-none`}
              />
            </FieldModal>
            <FieldModal label="Descripción completa" full>
              <textarea
                rows={3}
                placeholder="Descripción extendida (opcional)..."
                {...register("descripcionCompleta")}
                className={`${inputCls} resize-none`}
              />
            </FieldModal>
            <FieldModal label="Imagen del producto" full>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg border border-dashed border-white/20 bg-[#13151b] text-xs text-gray-400 group-hover:border-accent-blue/50 group-hover:text-accent-blue transition-all flex-1">
                  <TbPhoto size={16} />
                  {imagenFile ? imagenFile.name : "Seleccionar imagen..."}
                </div>
                {imagenPreview && (
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="w-12 h-16 object-contain rounded-lg border border-white/10 bg-[#232632]"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  className="hidden"
                />
              </label>
            </FieldModal>
            <FieldModal label="Opciones" full>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    {...register("enOferta")}
                    className="accent-accent-blue w-3.5 h-3.5 cursor-pointer"
                  />{" "}
                  En oferta
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    {...register("destacado")}
                    className="accent-accent-purple w-3.5 h-3.5 cursor-pointer"
                  />{" "}
                  Producto destacado
                </label>
              </div>
            </FieldModal>
            {enOferta && (
              <FieldModal label="Descuento (%)" error={errors.descuento}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ej. 15"
                  {...register("descuento", {
                    min: { value: 0, message: "Mínimo 0%" },
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  className={inputCls}
                />
              </FieldModal>
            )}
          </form>
        </div>
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
            form="form-producto"
            disabled={enviando}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue hover:text-bg transition-all cursor-pointer"
          >
            {enviando ? (
              <>
                <TbLoader2 size={14} className="animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <TbDeviceFloppy size={14} /> Agregar producto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarProducto;
