import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TbX,
  TbPhoto,
  TbDeviceFloppy,
  TbLoader2,
  TbTrash,
  TbAlertTriangle,
} from "react-icons/tb";
import {
  subirImagenProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../../services/adminService";
import { obtenerProductoPorId } from "../../../services/productoService";

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

const ModalDetalleProducto = ({
  productoResumen,
  onClose,
  onSuccess,
  listaCategorias,
}) => {
  const [loadingDetalle, setLoadingDetalle] = useState(true);
  const [nombreProducto, setNombreProducto] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const enOferta = watch("enOferta");
  const productoId = (productoResumen.id || productoResumen._id)?.toString();

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingDetalle(true);
        const data = await obtenerProductoPorId(productoId);
        const p = data.producto;
        setNombreProducto(p.nombre || "");
        reset({
          nombre: p.nombre || "",
          autor: p.autor || "",
          editorial: p.editorial || "",
          categoria:
            p.categoria?._id?.toString() || p.categoria?.toString() || "",
          precio: p.precio || 0,
          paginas: p.paginas || 0,
          stock: p.stock ?? 0,
          idioma: p.idioma || "Español España",
          presentacion: p.presentacion || "Tapa Blanda",
          descripcion: p.descripcion || "",
          descripcionCompleta: p.descripcionCompleta || "",
          enOferta: p.enOferta ?? false,
          destacado: p.destacado ?? false,
          descuento: p.descuento ?? 0,
        });
        if (p.imagen && p.imagen.startsWith("http")) {
          setImagenPreview(p.imagen);
        }
      } catch {
        toast.error("No se pudo cargar el producto");
        onClose();
      } finally {
        setLoadingDetalle(false);
      }
    };
    cargar();
  }, [productoId]);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      await actualizarProducto(productoId, {
        ...data,
        precio: Number(data.precio),
        paginas: Number(data.paginas),
        stock: Number(data.stock),
        descuento: Number(data.descuento) || 0,
      });
      if (imagenFile) {
        await subirImagenProducto(productoId, imagenFile);
      }
      toast.success("Producto actualizado", {
        description: `"${data.nombre}" fue guardado correctamente.`,
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
      await eliminarProducto(productoId);
      toast.success("Producto eliminado", {
        description: `"${nombreProducto}" fue desactivado del catálogo.`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl w-full max-w-2xl border border-white/10 text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <h2 className="font-poppins text-lg font-bold text-accent-purple">
            Editar producto
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
          >
            <TbX size={18} />
          </button>
        </div>

        {loadingDetalle ? (
          <div className="flex items-center justify-center flex-1 py-16">
            <TbLoader2 size={28} className="animate-spin text-accent-blue" />
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
              {/* ── Edit form ── */}
              <form
                id="form-editar-producto"
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Imagen */}
                <FieldModal label="Imagen del producto" full>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-20 rounded-lg border border-white/10 bg-[#13151b] overflow-hidden flex items-center justify-center">
                      {imagenPreview ? (
                        <img
                          src={imagenPreview}
                          alt="Producto"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <TbPhoto size={24} className="text-gray-600" />
                      )}
                    </div>
                    <label className="flex items-center gap-2 py-2 px-3 rounded-lg border border-dashed border-white/20 bg-[#13151b] text-xs text-gray-400 hover:border-accent-blue/50 hover:text-accent-blue transition-all cursor-pointer flex-1">
                      <TbPhoto size={14} />
                      {imagenFile ? imagenFile.name : "Cambiar imagen..."}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagen}
                        className="hidden"
                      />
                    </label>
                  </div>
                </FieldModal>

                <FieldModal label="Nombre *" error={errors.nombre} full>
                  <input
                    type="text"
                    {...register("nombre", {
                      required: "El nombre es requerido",
                    })}
                    className={inputCls}
                  />
                </FieldModal>

                <FieldModal label="Autor *" error={errors.autor}>
                  <input
                    type="text"
                    {...register("autor", {
                      required: "El autor es requerido",
                    })}
                    className={inputCls}
                  />
                </FieldModal>

                <FieldModal label="Editorial *" error={errors.editorial}>
                  <input
                    type="text"
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
                    min="1"
                    {...register("precio", {
                      required: "El precio es requerido",
                      min: { value: 1, message: "Debe ser mayor a 0" },
                    })}
                    className={inputCls}
                  />
                </FieldModal>

                <FieldModal label="Páginas *" error={errors.paginas}>
                  <input
                    type="number"
                    min="1"
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
                    {...register("stock", {
                      required: "El stock es requerido",
                      min: { value: 0, message: "No puede ser negativo" },
                    })}
                    className={inputCls}
                  />
                </FieldModal>

                <FieldModal label="Idioma">
                  <input
                    type="text"
                    {...register("idioma")}
                    className={inputCls}
                  />
                </FieldModal>

                <FieldModal label="Presentación">
                  <select
                    {...register("presentacion")}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="Tapa Blanda">Tapa Blanda</option>
                    <option value="Tapa Dura">Tapa Dura</option>
                    <option value="Digital">Digital</option>
                  </select>
                </FieldModal>

                <FieldModal
                  label="Descripción *"
                  error={errors.descripcion}
                  full
                >
                  <textarea
                    rows={3}
                    {...register("descripcion", {
                      required: "La descripción es requerida",
                      maxLength: {
                        value: 1000,
                        message: "Máximo 1000 caracteres",
                      },
                    })}
                    className={`${inputCls} resize-none`}
                  />
                </FieldModal>

                <FieldModal label="Descripción completa" full>
                  <textarea
                    rows={3}
                    {...register("descripcionCompleta")}
                    className={`${inputCls} resize-none`}
                  />
                </FieldModal>

                <FieldModal label="Opciones" full>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                      <input
                        type="checkbox"
                        {...register("enOferta")}
                        className="accent-accent-blue w-3.5 h-3.5 cursor-pointer"
                      />
                      En oferta
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                      <input
                        type="checkbox"
                        {...register("destacado")}
                        className="accent-accent-purple w-3.5 h-3.5 cursor-pointer"
                      />
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
                      {...register("descuento", {
                        min: { value: 0, message: "Mínimo 0%" },
                        max: { value: 100, message: "Máximo 100%" },
                      })}
                      className={inputCls}
                    />
                  </FieldModal>
                )}
              </form>

              {/* ── Danger zone ── */}
              {!confirmDelete ? (
                <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">
                    Zona de peligro
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                    Eliminar el producto lo desactivará del catálogo. No
                    aparecerá en la tienda ni en las búsquedas.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <TbTrash size={13} />
                    Eliminar producto
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <TbAlertTriangle
                      size={15}
                      className="text-red-400 shrink-0"
                    />
                    <div className="text-[11px] font-bold text-red-300">
                      ¿Confirmar eliminación?
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                    El producto{" "}
                    <strong className="text-white">"{nombreProducto}"</strong>{" "}
                    será desactivado del catálogo. Los pedidos existentes no se
                    verán afectados.
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
                form="form-editar-producto"
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

export default ModalDetalleProducto;
