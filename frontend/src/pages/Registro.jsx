import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  TbUser,
  TbUsers,
  TbId,
  TbMail,
  TbCalendar,
  TbLock,
  TbLockCheck,
  TbUserPlus,
} from "react-icons/tb";

const Registro = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = (data) => {
    const result = registerUser(data);
    if (result.success) {
      toast.success("¡Cuenta creada con éxito!", {
        description: `Bienvenido, ${data.nombres}`,
      });
      navigate("/cuenta");
    }
  };

  const Field = ({ id, label, icon: Icon, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-bold text-accent-purple uppercase tracking-wider"
      >
        <Icon size={14} />
        {label}
      </label>
      {children}
      {error && (
        <span className="text-red-400 text-xs mt-0.5">{error.message}</span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4">
      <main className="w-full max-w-[640px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel rounded-2xl shadow-[0_8px_32px_0_rgba(182,166,230,0.1)] p-10 flex flex-col gap-7 w-full border border-white/5 hover:border-accent-pink/20 transition-all duration-300 text-white"
        >
          {/* Header */}
          <div className="text-center mb-1">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-purple/20 border border-accent-purple/30 mb-4">
              <TbUserPlus size={28} className="text-accent-purple" />
            </div>
            <h1 className="font-poppins text-2xl font-bold text-accent-purple tracking-wide">
              Crear cuenta
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Completa el formulario para registrarte
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field
              id="usuario"
              label="Usuario"
              icon={TbUser}
              error={errors.usuario}
            >
              <input
                type="text"
                id="usuario"
                placeholder="Ej. jgarcia123"
                {...register("usuario", {
                  required: "El usuario es requerido",
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field
              id="nombres"
              label="Nombres"
              icon={TbUsers}
              error={errors.nombres}
            >
              <input
                type="text"
                id="nombres"
                placeholder="Ej. Juan"
                {...register("nombres", {
                  required: "Los nombres son requeridos",
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field
              id="apellidos"
              label="Apellidos"
              icon={TbUsers}
              error={errors.apellidos}
            >
              <input
                type="text"
                id="apellidos"
                placeholder="Ej. García López"
                {...register("apellidos", {
                  required: "Los apellidos son requeridos",
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field id="cedula" label="Cédula" icon={TbId} error={errors.cedula}>
              <input
                type="number"
                id="cedula"
                placeholder="Ej. 1234567890"
                {...register("cedula", { required: "La cédula es requerida" })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field id="email" label="Email" icon={TbMail} error={errors.email}>
              <input
                type="email"
                id="email"
                placeholder="Ej. juan@correo.com"
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field
              id="fecha"
              label="Fecha de nacimiento"
              icon={TbCalendar}
              error={errors.fechaNacimiento}
            >
              <input
                type="date"
                id="fecha"
                {...register("fechaNacimiento", {
                  required: "La fecha es requerida",
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field
              id="password"
              label="Contraseña"
              icon={TbLock}
              error={errors.password}
            >
              <input
                type="password"
                id="password"
                placeholder="Mínimo 6 caracteres"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>

            <Field
              id="password2"
              label="Confirmar contraseña"
              icon={TbLockCheck}
              error={errors.password2}
            >
              <input
                type="password"
                id="password2"
                placeholder="Repite la contraseña"
                {...register("password2", {
                  required: "Confirma la contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
                className="py-3 px-4 rounded-lg border border-white/10 text-sm premium-input"
              />
            </Field>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent-blue to-accent-purple text-bg font-bold py-3.5 px-6 rounded-2xl text-sm cursor-pointer hover:from-accent-pink hover:to-accent-purple hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(230,140,183,0.3)] mt-2 border-none"
          >
            <TbUserPlus size={18} />
            Registrarse
          </button>

          <div className="flex flex-col gap-3 items-center border-t border-white/5 pt-5">
            <Link
              to="/login"
              className="text-accent-blue text-xs font-bold no-underline hover:text-accent-pink transition-colors tracking-wide uppercase"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Registro;
