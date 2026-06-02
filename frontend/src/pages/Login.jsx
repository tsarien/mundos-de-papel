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
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <main className="w-full max-w-[380px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel rounded-2xl shadow-[0_8px_32px_0_rgba(182,166,230,0.1)] p-10 flex flex-col gap-5 w-full border border-white/5 hover:border-accent-pink/20 transition-all duration-300"
        >
          <h1 className="font-poppins text-2xl font-bold text-accent-purple mb-2 text-center tracking-wide">
            Iniciar sesión
          </h1>

          {error && (
            <div className="bg-red-950/50 border border-red-500/30 text-red-200 px-4 py-2.5 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex items-center bg-[#13151b]/80 rounded-xl px-4 py-1.5 gap-3 border border-white/10 focus-within:border-accent-pink transition-all duration-200">
            <span className="text-lg text-accent-purple opacity-80">👤</span>
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
              className="border-none outline-none bg-transparent text-sm text-white placeholder-gray-500 w-full py-2.5"
            />
          </div>
          {errors.email && (
            <span className="text-red-400 text-xs">{errors.email.message}</span>
          )}

          <div className="flex items-center bg-[#13151b]/80 rounded-xl px-4 py-1.5 gap-3 border border-white/10 focus-within:border-accent-pink transition-all duration-200">
            <span className="text-lg text-accent-purple opacity-80">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es requerida",
              })}
              className="border-none outline-none bg-transparent text-sm text-white placeholder-gray-500 w-full py-2.5"
            />
          </div>
          {errors.password && (
            <span className="text-red-400 text-xs">
              {errors.password.message}
            </span>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-accent-blue to-accent-purple text-bg font-bold py-3 px-6 rounded-2xl text-sm cursor-pointer hover:from-accent-pink hover:to-accent-purple hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(230,140,183,0.3)] mt-2 border-none"
          >
            Iniciar sesión
          </button>

          <div className="flex flex-col gap-3 items-center mt-4">
            <Link
              to="/recuperar"
              className="text-accent-purple text-xs font-bold no-underline hover:text-accent-pink transition-colors tracking-wide uppercase"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="w-full h-px bg-white/5 my-1" />
            <Link
              to="/registro"
              className="text-accent-blue text-xs font-bold no-underline hover:text-accent-pink transition-colors tracking-wide uppercase"
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
