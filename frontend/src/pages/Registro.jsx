import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

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
      navigate("/cuenta");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <main className="w-full max-w-[480px] px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel rounded-2xl shadow-[0_8px_32px_0_rgba(182,166,230,0.1)] p-10 flex flex-col gap-5 w-full border border-white/5 hover:border-accent-pink/20 transition-all duration-300 text-white"
        >
          <h1 className="font-poppins text-2xl font-bold text-accent-purple mb-2 text-center tracking-wide">
            Crear cuenta
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="usuario"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Usuario
              </label>
              <input
                type="text"
                id="usuario"
                {...register("usuario", {
                  required: "El usuario es requerido",
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.usuario && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.usuario.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="nombres"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                {...register("nombres", {
                  required: "Los nombres son requeridos",
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.nombres && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.nombres.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="apellidos"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                {...register("apellidos", {
                  required: "Los apellidos son requeridos",
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.apellidos && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.apellidos.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="cedula"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Cédula
              </label>
              <input
                type="number"
                id="cedula"
                {...register("cedula", { required: "La cédula es requerida" })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.cedula && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.cedula.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.email && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="fecha"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Fecha de nacimiento
              </label>
              <input
                type="date"
                id="fecha"
                {...register("fechaNacimiento", {
                  required: "La fecha es requerida",
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.fechaNacimiento && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.fechaNacimiento.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.password && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password2"
                className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1"
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="password2"
                {...register("password2", {
                  required: "Confirma la contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
                className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
              />
              {errors.password2 && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.password2.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-accent-blue to-accent-purple text-bg font-bold py-3 px-6 rounded-2xl text-sm cursor-pointer hover:from-accent-pink hover:to-accent-purple hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(230,140,183,0.3)] mt-4 border-none"
          >
            Registrarse
          </button>

          <div className="flex flex-col gap-3 items-center mt-4 border-t border-white/5 pt-4">
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
