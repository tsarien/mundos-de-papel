import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { obtenerMisPedidos } from "../services/pedidoService";
import { toast } from "sonner";
import {
  TbUser,
  TbShoppingBag,
  TbLock,
  TbLayoutDashboard,
  TbLogout,
  TbDeviceFloppy,
  TbX,
  TbEye,
} from "react-icons/tb";

const Cuenta = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: user || {},
  });
  const [seccionActiva, setSeccionActiva] = useState("info");
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);

  useEffect(() => {
    if (seccionActiva !== "pedidos") return;

    const cargarPedidos = async () => {
      try {
        setCargandoPedidos(true);
        const data = await obtenerMisPedidos();
        setPedidos(data.pedidos || []);
      } catch {
        setPedidos([]);
      } finally {
        setCargandoPedidos(false);
      }
    };

    cargarPedidos();
  }, [seccionActiva]);

  const formatearEstado = (estado) => {
    const estados = {
      entregado: "Entregado",
      procesando: "En proceso",
      confirmado: "En proceso",
      enviado: "Enviado",
      cancelado: "Cancelado",
    };
    return estados[estado] || estado;
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const onSubmitInfo = async (data) => {
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
          {/* Información personal */}
          {seccionActiva === "info" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6 border-b border-white/5 pb-2">
                Información personal
              </h2>
              <form
                onSubmit={handleSubmit(onSubmitInfo)}
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
                    type="reset"
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

          {/* Historial de pedidos */}
          {seccionActiva === "pedidos" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6 border-b border-white/5 pb-2">
                Historial de pedidos
              </h2>
              {cargandoPedidos ? (
                <p className="text-gray-400 text-sm">Cargando pedidos...</p>
              ) : pedidos.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No tienes pedidos registrados.
                </p>
              ) : (
                <ul className="list-none m-0 p-0 flex flex-col gap-5">
                  {pedidos.map((pedido) => {
                    const item = pedido.items[0];
                    const nombre = item?.nombre || item?.producto?.nombre;
                    const imagen = item?.producto?.imagen;
                    const estadoLabel = formatearEstado(pedido.estado);

                    return (
                      <li
                        key={pedido._id}
                        className="flex items-center gap-5 bg-[#13151b]/80 border border-white/5 rounded-xl p-5 justify-between hover:border-white/10 transition-all"
                      >
                        <div className="w-12 h-16 bg-[#232632] flex items-center justify-center p-1 rounded-lg border border-white/5 flex-shrink-0">
                          {imagen && (
                            <img
                              src={imagen}
                              alt={nombre}
                              className="h-full w-auto object-contain"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-accent-blue text-base block">
                            {nombre}
                          </span>
                          <span className="text-accent-pink text-sm mr-3 font-semibold">
                            {formatearFecha(pedido.createdAt)}
                          </span>
                          <span
                            className={`text-xs font-semibold rounded-lg py-1 px-3 ml-2 inline-block ${
                              pedido.estado === "entregado"
                                ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                                : "bg-accent-pink/20 text-accent-pink border border-accent-pink/30"
                            }`}
                          >
                            {estadoLabel}
                          </span>
                        </div>
                        <button className="bg-transparent text-accent-blue font-bold py-2 px-4 rounded-lg border border-accent-blue/40 cursor-pointer hover:bg-accent-blue hover:text-bg transition-all">
                          <span className="flex items-center gap-2">
                            <TbEye size={18} />
                            Ver detalles
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Cambiar contraseña */}
          {seccionActiva === "password" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6 border-b border-white/5 pb-2">
                Cambiar contraseña
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
                    Contraseña actual
                  </span>
                  <input
                    type="password"
                    className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
                    Nueva contraseña
                  </span>
                  <input
                    type="password"
                    className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
                  />
                </label>
                <label className="flex flex-col gap-1 col-span-full">
                  <span className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-1">
                    Confirmar nueva contraseña
                  </span>
                  <input
                    type="password"
                    className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
                  />
                </label>
                <div className="flex gap-4 mt-4 col-span-full">
                  <button
                    type="submit"
                    className="bg-accent-blue text-bg font-bold py-2.5 px-6 rounded-xl hover:bg-accent-pink hover:shadow-lg transition-all cursor-pointer border-none"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="reset"
                    className="bg-transparent text-accent-blue border border-accent-blue/30 font-bold py-2.5 px-6 rounded-xl hover:bg-accent-blue/10 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Cuenta;
