import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";

const Cuenta = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: user || {},
  });
  const [seccionActiva, setSeccionActiva] = useState("info");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const onSubmitInfo = (data) => {
    updateProfile(data);
    alert("Información actualizada correctamente");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const pedidosEjemplo = [
    {
      id: 1,
      nombre: "Batman",
      fecha: "12/04/2024",
      estado: "Entregado",
      imagen: "/productos/batman.jpg",
    },
    {
      id: 2,
      nombre: "Dragon Ball",
      fecha: "28/03/2024",
      estado: "En proceso",
      imagen: "/productos/dragon-ball.webp",
    },
  ];

  return (
    <main className="mt-[94px] mb-10 container mx-auto px-4 max-w-7xl">
      <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
        Mi Cuenta
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
        {/* Menú lateral */}
        <nav className="bg-white rounded-2xl shadow-md p-8 min-w-[180px] max-w-[260px] w-full lg:sticky lg:top-24">
          <ul className="list-none m-0 p-0 flex flex-col gap-5">
            {[
              { id: "info", nombre: "Información personal" },
              { id: "pedidos", nombre: "Historial de pedidos" },
              { id: "password", nombre: "Cambiar contraseña" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setSeccionActiva(item.id)}
                  className={`w-full text-left font-poppins text-base font-semibold py-3 px-4 rounded-xl transition-all border-none cursor-pointer
                    ${
                      seccionActiva === item.id
                        ? "bg-accent-purple text-white"
                        : "bg-transparent text-gray-700 hover:bg-accent-purple hover:text-white"
                    }`}
                >
                  {item.nombre}
                </button>
              </li>
            ))}

            {user?.rol === "admin" && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="w-full text-left font-poppins text-base font-semibold py-3 px-4 rounded-xl transition-all border-none cursor-pointer bg-accent-pink text-white hover:opacity-85 block text-center"
                >
                  ⚙️ Panel Admin
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left font-poppins text-base font-bold py-3 px-4 rounded-xl transition-all border-none cursor-pointer bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>

        {/* Contenido */}
        <section className="bg-white rounded-2xl shadow-md p-10 min-w-0">
          {/* Información personal */}
          {seccionActiva === "info" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6">
                Información personal
              </h2>
              <form
                onSubmit={handleSubmit(onSubmitInfo)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl"
              >
                <label className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-accent-purple">
                    Nombre completo
                  </span>
                  <input
                    type="text"
                    {...register("nombre")}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-accent-purple">
                    Apellido
                  </span>
                  <input
                    type="text"
                    {...register("apellido")}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-accent-purple">
                    Email
                  </span>
                  <input
                    type="email"
                    {...register("email")}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-accent-purple">
                    Teléfono
                  </span>
                  <input
                    type="tel"
                    {...register("telefono")}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1 col-span-full">
                  <span className="text-base font-semibold text-accent-purple">
                    Dirección
                  </span>
                  <input
                    type="text"
                    {...register("direccion")}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    className="bg-accent-blue text-bg font-semibold py-3 px-6 rounded-2xl border-none cursor-pointer hover:bg-accent-pink transition-all"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="reset"
                    className="bg-white text-accent-blue font-semibold py-3 px-6 rounded-2xl border-2 border-accent-blue cursor-pointer hover:bg-accent-blue hover:text-bg transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Historial de pedidos */}
          {seccionActiva === "pedidos" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6">
                Historial de pedidos
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-5">
                {pedidosEjemplo.map((pedido) => (
                  <li
                    key={pedido.id}
                    className="flex items-center gap-5 bg-gray-100 rounded-xl p-5 shadow-sm justify-between"
                  >
                    <img
                      src={pedido.imagen}
                      alt={pedido.nombre}
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-accent-blue text-base block">
                        {pedido.nombre}
                      </span>
                      <span className="text-accent-pink text-sm mr-3">
                        {pedido.fecha}
                      </span>
                      <span
                        className={`text-sm font-semibold rounded-lg py-1 px-3 ml-2 ${
                          pedido.estado === "Entregado"
                            ? "bg-accent-blue text-white"
                            : "bg-accent-pink text-white"
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </div>
                    <button className="bg-white text-accent-blue font-semibold py-2 px-4 rounded-xl border-2 border-accent-blue cursor-pointer hover:bg-accent-blue hover:text-white transition-all">
                      Ver detalles
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cambiar contraseña */}
          {seccionActiva === "password" && (
            <div>
              <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6">
                Cambiar contraseña
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                <label className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-accent-purple">
                    Contraseña actual
                  </span>
                  <input
                    type="password"
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-accent-purple">
                    Nueva contraseña
                  </span>
                  <input
                    type="password"
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1 col-span-full">
                  <span className="text-base font-semibold text-accent-purple">
                    Confirmar nueva contraseña
                  </span>
                  <input
                    type="password"
                    className="py-3 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1 outline-none focus:border-accent-pink transition-colors"
                  />
                </label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    className="bg-accent-blue text-bg font-semibold py-3 px-6 rounded-2xl border-none cursor-pointer hover:bg-accent-pink transition-all"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="reset"
                    className="bg-white text-accent-blue font-semibold py-3 px-6 rounded-2xl border-2 border-accent-blue cursor-pointer hover:bg-accent-blue hover:text-bg transition-all"
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
