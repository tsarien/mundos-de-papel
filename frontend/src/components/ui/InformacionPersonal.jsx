import { useForm } from "react-hook-form";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { toast } from "sonner";

const InformacionPersonal = ({ user, updateProfile }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: user || {},
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success("Perfil actualizado", {
        description: "Tu información personal fue guardada correctamente.",
      });
    } else {
      toast.error("Error al actualizar", {
        description: result.mensaje || "Inténtalo de nuevo.",
      });
    }
  };

  const handleCancel = () => {
    reset(user || {});
  };

  return (
    <div>
      <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6 border-b border-white/5 pb-2">
        Información personal
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl"
      >
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
            Nombre completo
          </span>
          <input
            type="text"
            {...register("nombre")}
            className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
            Apellido
          </span>
          <input
            type="text"
            {...register("apellido")}
            className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
            Email
          </span>
          <input
            type="email"
            {...register("email")}
            className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
            Teléfono
          </span>
          <input
            type="tel"
            {...register("telefono")}
            className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
          />
        </label>
        <label className="flex flex-col gap-1 col-span-full">
          <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
            Dirección
          </span>
          <input
            type="text"
            {...register("direccion")}
            className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
          />
        </label>
        <div className="flex gap-4 mt-4 col-span-full">
          <button
            type="submit"
            className="bg-accent-blue text-bg font-bold py-2.5 px-6 rounded-xl hover:bg-accent-pink hover:shadow-lg transition-all cursor-pointer border-none"
          >
            <span className="flex items-center gap-2">
              <TbDeviceFloppy size={18} />
              Guardar cambios
            </span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-transparent text-accent-blue border border-accent-blue/30 font-bold py-2.5 px-6 rounded-xl hover:bg-accent-blue/10 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <TbX size={18} />
              Cancelar
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InformacionPersonal;
