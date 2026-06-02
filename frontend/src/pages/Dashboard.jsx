import {
  TbLayoutDashboard,
  TbShoppingCart,
  TbPackage,
  TbTag,
  TbUsers,
  TbBuildingStore,
  TbBell,
  TbSettings,
  TbLogout,
  TbHome,
  TbPlus,
} from "react-icons/tb";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerAlertas } from "../services/adminService";
import ResumenView from "../components/admin/ResumenView";
import VentasView from "../components/admin/VentasView";
import InventarioView from "../components/admin/InventarioView";
import PreciosView from "../components/admin/PreciosView";
import ClientesView from "../components/admin/ClientesView";
import ProveedoresView from "../components/admin/ProveedoresView";
import AlertasView from "../components/admin/AlertasView";
import ConfiguracionView from "../components/admin/ConfiguracionView";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("resumen");
  const [alertasPendientes, setAlertasPendientes] = useState(0);

  useEffect(() => {
    const cargarAlertas = async () => {
      try {
        const data = await obtenerAlertas();
        setAlertasPendientes(data.resumen?.pendientes || 0);
      } catch {
        setAlertasPendientes(0);
      }
    };
    if (user?.rol === "admin") cargarAlertas();
  }, [user]);

  const pages = {
    resumen: {
      title: "Resumen general",
      sub: "Visión global del negocio",
      icon: <TbLayoutDashboard size={18} />,
    },
    ventas: {
      title: "Ventas",
      sub: "Historial y pedidos activos",
      icon: <TbShoppingCart size={18} />,
    },
    inventario: {
      title: "Inventario",
      sub: "Control de stock y productos",
      icon: <TbPackage size={18} />,
    },
    precios: {
      title: "Precios",
      sub: "Reglas y políticas de precio",
      icon: <TbTag size={18} />,
    },
    clientes: {
      title: "Clientes",
      sub: "Base de datos de compradores",
      icon: <TbUsers size={18} />,
    },
    proveedores: {
      title: "Proveedores",
      sub: "Directorio y estado de relaciones",
      icon: <TbBuildingStore size={18} />,
    },
    alertas: {
      title: "Alertas",
      sub: "Notificaciones pendientes",
      icon: <TbBell size={18} />,
      badge: alertasPendientes,
    },
    configuracion: {
      title: "Configuración",
      sub: "Ajustes del sistema",
      icon: <TbSettings size={18} />,
    },
  };

  const navigateToView = (view) => {
    setActiveView(view);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Verificar si el usuario es admin
  if (user?.rol !== "admin") {
    navigate("/");
    return null;
  }

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0c0e12] text-gray-100 font-poppins">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#13151b] border-r border-white/5 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="font-poppins font-bold text-sm text-accent-blue leading-tight uppercase tracking-wider">
            Mundos de Papel
          </div>
          <div className="text-[9px] text-accent-pink uppercase font-semibold tracking-widest mt-0.5">
            AdminPanel
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow overflow-y-auto py-4">
          {/* Principal */}
          <div className="px-5 pt-3 pb-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
            Principal
          </div>
          <div
            onClick={() => navigateToView("resumen")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "resumen"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.resumen.icon}
            Resumen
          </div>
          <div
            onClick={() => navigateToView("ventas")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "ventas"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.ventas.icon}
            Ventas
          </div>

          {/* Gestión */}
          <div className="px-5 pt-4 pb-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold mt-2">
            Gestión
          </div>
          <div
            onClick={() => navigateToView("inventario")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "inventario"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.inventario.icon}
            Inventario
          </div>
          <div
            onClick={() => navigateToView("precios")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "precios"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.precios.icon}
            Precios
          </div>
          <div
            onClick={() => navigateToView("clientes")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "clientes"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.clientes.icon}
            Clientes
          </div>
          <div
            onClick={() => navigateToView("proveedores")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "proveedores"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.proveedores.icon}
            Proveedores
          </div>

          {/* Sistema */}
          <div className="px-5 pt-4 pb-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold mt-2">
            Sistema
          </div>
          <div
            onClick={() => navigateToView("alertas")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "alertas"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.alertas.icon}
            Alertas
            {pages.alertas.badge > 0 && (
              <span className="ml-auto text-[9px] font-bold bg-accent-pink text-white rounded-full px-1.5 py-0.5">
                {pages.alertas.badge}
              </span>
            )}
          </div>
          <div
            onClick={() => navigateToView("configuracion")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
              activeView === "configuracion"
                ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            {pages.configuracion.icon}
            Configuración
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-white/5 flex items-center gap-2.5 text-xs text-gray-400">
          <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue flex-shrink-0">
            {user?.nombre?.[0]}
            {user?.apellido?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate text-xs">
              {user?.nombre} {user?.apellido}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <TbLogout size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-[#13151b] border-b border-white/5 px-7 py-3.5 flex items-center justify-between flex-shrink-0 text-white">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-poppins font-bold text-lg text-white">
              {pages[activeView].title}
            </h1>
            <p className="text-xs text-gray-400">{pages[activeView].sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold bg-white/5 rounded-lg px-3 py-2 text-gray-300 border border-white/5">
              {currentDate}
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 bg-transparent text-gray-200 text-xs hover:bg-white/5 transition-all font-semibold"
            >
              <TbHome size={16} />
              Ver tienda
            </button>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-bg text-xs hover:opacity-90 transition-all font-bold border-none shadow-md">
              <TbPlus size={16} />
              Nuevo pedido
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0c0e12]">
          {activeView === "resumen" && <ResumenView />}
          {activeView === "ventas" && <VentasView />}
          {activeView === "inventario" && <InventarioView />}
          {activeView === "precios" && <PreciosView />}
          {activeView === "clientes" && <ClientesView />}
          {activeView === "proveedores" && <ProveedoresView />}
          {activeView === "alertas" && <AlertasView />}
          {activeView === "configuracion" && <ConfiguracionView />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
