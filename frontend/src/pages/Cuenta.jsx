// frontend/src/pages/Cuenta.jsx (refactorizado)
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import ChatBot from "../components/chatbot/Chatbot";
import { toast } from "sonner";
import api from "../services/api";
import {
  TbUser,
  TbShoppingBag,
  TbLock,
  TbLayoutDashboard,
  TbLogout,
  TbDeviceFloppy,
  TbX,
} from "react-icons/tb";
import InformacionPersonal from "../components/ui/InformacionPersonal";
import HistorialPedidos from "../components/ui/HistorialPedidos";

const Cuenta = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    watch: watchPwd,
    reset: resetPwd,
    formState: { errors: errorsPwd, isSubmitting: isSubmittingPwd },
  } = useForm();

  const [seccionActiva, setSeccionActiva] = useState("info");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const onSubmitPassword = async (data) => {
    try {
      await api.put("/auth/cambiar-password", {
        passwordActual: data.passwordActual,
        passwordNueva: data.passwordNueva,
      });
      toast.success("Contraseña actualizada", {
        description: "Tu contraseña fue cambiada correctamente.",
      });
      resetPwd();
    } catch (error) {
      toast.error("Error al cambiar contraseña", {
        description: error.response?.data?.mensaje || "Inténtalo de nuevo.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="mb-10 container mx-auto px-4 max-w-7xl pt-10">
      <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
        Mi Cuenta
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
        {/* Menú lateral */}
        <nav className="glass-panel rounded-2xl p-6 min-w-[180px] max-w-[260px] w-full lg:sticky lg:top-24 text-white">
          <ul className="list-none m-0 p-0 flex flex-col gap-4">
            {[
              {
                id: "info",
                nombre: "Información personal",
                icon: <TbUser size={18} />,
              },
              {
                id: "pedidos",
                nombre: "Historial de pedidos",
                icon: <TbShoppingBag size={18} />,
              },
              {
                id: "password",
                nombre: "Cambiar contraseña",
                icon: <TbLock size={18} />,
              },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setSeccionActiva(item.id)}
                  className={`w-full text-left font-poppins text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center gap-3
                  ${
                    seccionActiva === item.id
                      ? "bg-accent-purple text-bg font-bold"
                      : "bg-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.nombre}
                </button>
              </li>
            ))}

            {user?.rol === "admin" && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="w-full text-left font-poppins text-sm font-bold py-2.5 px-4 rounded-xl transition-all border-none cursor-pointer bg-accent-pink text-bg hover:opacity-90 block text-left shadow-md"
                >
                  <span className="flex items-center gap-3">
                    <TbLayoutDashboard size={18} />
                    Panel Admin
                  </span>
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left font-poppins text-sm font-bold py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
              >
                <span className="flex items-center gap-3">
                  <TbLogout size={18} />
                  Cerrar sesión
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Contenido */}
        <section className="glass-panel rounded-2xl p-10 min-w-0 text-white">
          {seccionActiva === "info" && (
            <InformacionPersonal user={user} updateProfile={updateProfile} />
          )}
          {seccionActiva === "pedidos" && <HistorialPedidos />}
          {seccionActiva === "password" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6 border-b border-white/5 pb-2">
                Cambiar contraseña
              </h2>
              <form
                onSubmit={handleSubmitPwd(onSubmitPassword)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl"
              >
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
                    Contraseña actual
                  </span>
                  <input
                    type="password"
                    {...registerPwd("passwordActual", {
                      required: "La contraseña actual es requerida",
                    })}
                    className={`py-2.5 px-4 rounded-lg border text-sm premium-input mt-1 ${
                      errorsPwd.passwordActual
                        ? "border-red-500/60"
                        : "border-white/10"
                    }`}
                  />
                  {errorsPwd.passwordActual && (
                    <span className="text-red-400 text-xs mt-1">
                      {errorsPwd.passwordActual.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
                    Nueva contraseña
                  </span>
                  <input
                    type="password"
                    {...registerPwd("passwordNueva", {
                      required: "La nueva contraseña es requerida",
                      minLength: {
                        value: 6,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    })}
                    className={`py-2.5 px-4 rounded-lg border text-sm premium-input mt-1 ${
                      errorsPwd.passwordNueva
                        ? "border-red-500/60"
                        : "border-white/10"
                    }`}
                  />
                  {errorsPwd.passwordNueva && (
                    <span className="text-red-400 text-xs mt-1">
                      {errorsPwd.passwordNueva.message}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1 col-span-full">
                  <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
                    Confirmar nueva contraseña
                  </span>
                  <input
                    type="password"
                    {...registerPwd("confirmarPassword", {
                      required: "Por favor confirma la nueva contraseña",
                      validate: (value) =>
                        value === watchPwd("passwordNueva") ||
                        "Las contraseñas no coinciden",
                    })}
                    className={`py-2.5 px-4 rounded-lg border text-sm premium-input mt-1 ${
                      errorsPwd.confirmarPassword
                        ? "border-red-500/60"
                        : "border-white/10"
                    }`}
                  />
                  {errorsPwd.confirmarPassword && (
                    <span className="text-red-400 text-xs mt-1">
                      {errorsPwd.confirmarPassword.message}
                    </span>
                  )}
                </label>
                <div className="flex gap-4 mt-4 col-span-full">
                  <button
                    type="submit"
                    disabled={isSubmittingPwd}
                    className="bg-accent-blue text-bg font-bold py-2.5 px-6 rounded-xl hover:bg-accent-pink hover:shadow-lg transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      <TbDeviceFloppy size={18} />
                      {isSubmittingPwd ? "Guardando..." : "Guardar cambios"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => resetPwd()}
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
          )}
        </section>
      </div>
      <ChatBot />
    </main>
  );
};

export default Cuenta;
