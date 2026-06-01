import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/cuenta");
    } else {
      setError(result.mensaje || "Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-bg">
      <div className="flex flex-col items-center mb-10">
        <div className="h-[70px] w-[70px] rounded-full overflow-hidden border-[2.5px] border-accent-blue bg-white mb-3">
          <div className="w-full h-full bg-gradient-to-br from-accent-purple to-accent-pink" />
        </div>
        <span className="font-poppins font-bold text-xl text-accent-blue tracking-wide">
          Mundos de Papel
        </span>
      </div>

      <main className="w-full max-w-[370px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-5 w-full"
        >
          <h1 className="font-poppins text-2xl font-bold text-accent-purple mb-2 text-center">
            Iniciar sesión
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 gap-3 border border-gray-300 focus-within:border-accent-pink transition-colors">
            <span className="text-xl text-accent-purple opacity-80">👤</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo inválido",
                },
              })}
              className="border-none outline-none bg-transparent text-base w-full py-2"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 gap-3 border border-gray-300 focus-within:border-accent-pink transition-colors">
            <span className="text-xl text-accent-purple opacity-80">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es requerida",
              })}
              className="border-none outline-none bg-transparent text-base w-full py-2"
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          <button
            type="submit"
            className="bg-accent-blue text-bg font-semibold py-3 px-6 rounded-2xl text-base cursor-pointer hover:bg-accent-pink transition-all shadow-md mt-2"
          >
            Iniciar sesión
          </button>

          <div className="flex justify-center items-center gap-3 mt-3 flex-wrap">
            <Link
              to="/recuperar"
              className="text-accent-purple text-sm font-semibold no-underline hover:text-accent-pink hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <span className="text-gray-400 text-lg font-bold">|</span>
            <Link
              to="/registro"
              className="text-accent-purple text-sm font-semibold no-underline hover:text-accent-pink hover:underline transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
