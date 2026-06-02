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
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-bg py-10">
      <main className="w-full max-w-[420px] px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-5 w-full"
        >
          <h1 className="font-poppins text-2xl font-bold text-accent-purple mb-2 text-center">
            Crear cuenta
          </h1>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="usuario"
                className="text-base font-semibold text-accent-purple"
              >
                Usuario
              </label>
              <input
                type="text"
                id="usuario"
                {...register("usuario", {
                  required: "El usuario es requerido",
                })}
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.usuario && (
                <span className="text-red-500 text-xs">
                  {errors.usuario.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="nombres"
                className="text-base font-semibold text-accent-purple"
              >
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                {...register("nombres", {
                  required: "Los nombres son requeridos",
                })}
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.nombres && (
                <span className="text-red-500 text-xs">
                  {errors.nombres.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="apellidos"
                className="text-base font-semibold text-accent-purple"
              >
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                {...register("apellidos", {
                  required: "Los apellidos son requeridos",
                })}
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.apellidos && (
                <span className="text-red-500 text-xs">
                  {errors.apellidos.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="cedula"
                className="text-base font-semibold text-accent-purple"
              >
                Cédula
              </label>
              <input
                type="number"
                id="cedula"
                {...register("cedula", { required: "La cédula es requerida" })}
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.cedula && (
                <span className="text-red-500 text-xs">
                  {errors.cedula.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-base font-semibold text-accent-purple"
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
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="fecha"
                className="text-base font-semibold text-accent-purple"
              >
                Fecha de nacimiento
              </label>
              <input
                type="date"
                id="fecha"
                {...register("fechaNacimiento", {
                  required: "La fecha es requerida",
                })}
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.fechaNacimiento && (
                <span className="text-red-500 text-xs">
                  {errors.fechaNacimiento.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-base font-semibold text-accent-purple"
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
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password2"
                className="text-base font-semibold text-accent-purple"
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
                className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
              />
              {errors.password2 && (
                <span className="text-red-500 text-xs">
                  {errors.password2.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-accent-blue text-bg font-semibold py-3 px-6 rounded-2xl text-base cursor-pointer hover:bg-accent-pink transition-all shadow-md mt-2"
          >
            Registrarse
          </button>

          <div className="flex justify-center items-center mt-5">
            <Link
              to="/login"
              className="text-accent-purple text-sm font-semibold no-underline hover:text-accent-pink hover:underline transition-colors"
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
