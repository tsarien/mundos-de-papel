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
  TbDatabaseExport,
  TbDatabaseImport,
  TbAlertTriangle,
  TbCircleCheck,
  TbX,
} from "react-icons/tb";
import { useState, useEffect, useRef } from "react";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("resumen");
  const [alertasPendientes, setAlertasPendientes] = useState(0);

  const [descargandoBackup, setDescargandoBackup] = useState(false);
  const [cargandoBackup, setCargandoBackup] = useState(false);
  const [modalRestaurar, setModalRestaurar] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const inputArchivoRef = useRef(null);

  const cargarContadorAlertas = async () => {
    try {
      const data = await obtenerAlertas();
      const pendientes = (data.alertas || []).filter((a) => !a.leida).length;
      setAlertasPendientes(pendientes);
    } catch {
      setAlertasPendientes(0);
    }
  };

  useEffect(() => {
    if (user?.rol === "admin") cargarContadorAlertas();
  }, [user]);

  useEffect(() => {
    if (!notificacion) return;
    const t = setTimeout(() => setNotificacion(null), 4000);
    return () => clearTimeout(t);
  }, [notificacion]);

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

  const navigateToView = (view) => setActiveView(view);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDescargarBackup = async () => {
    if (descargandoBackup) return;
    setDescargandoBackup(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/backup`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al generar el backup");

      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      const filename = match ? match[1] : "backup-mundos-de-papel.json";

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setNotificacion({
        tipo: "error",
        mensaje: "No se pudo descargar el backup",
      });
    } finally {
      setDescargandoBackup(false);
    }
  };

  const handleSeleccionarArchivo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoSeleccionado(file);
    setModalRestaurar(true);
    e.target.value = "";
  };

  const handleCancelarRestaurar = () => {
    setModalRestaurar(false);
    setArchivoSeleccionado(null);
  };

  const handleConfirmarRestaurar = async () => {
    if (!archivoSeleccionado || cargandoBackup) return;
    setCargandoBackup(true);
    try {
      const texto = await archivoSeleccionado.text();
      const backup = JSON.parse(texto);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/backup/restaurar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backup),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || "Error al restaurar");

      setNotificacion({
        tipo: "ok",
        mensaje: `Base de datos restaurada — ${data.resumen.totalRestaurados} registros`,
      });
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje: err.message.startsWith("{")
          ? "Archivo de backup inválido"
          : err.message,
      });
    } finally {
      setCargandoBackup(false);
      setModalRestaurar(false);
      setArchivoSeleccionado(null);
    }
  };

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
      {/* Modal restaurar */}
      {modalRestaurar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#13151b] border border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <TbAlertTriangle size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Restaurar base de datos
                  </h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelarRestaurar}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <TbX size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                Estás a punto de reemplazar{" "}
                <span className="text-white font-semibold">
                  todos los datos actuales
                </span>{" "}
                con el contenido del archivo seleccionado.
              </p>
              <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3 border border-white/5">
                <TbDatabaseImport
                  size={18}
                  className="text-accent-blue flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {archivoSeleccionado?.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {archivoSeleccionado
                      ? `${(archivoSeleccionado.size / 1024).toFixed(1)} KB`
                      : ""}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-amber-400/80 leading-relaxed">
                ⚠️ Se recomienda descargar un backup de los datos actuales antes
                de continuar.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleCancelarRestaurar}
                disabled={cargandoBackup}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarRestaurar}
                disabled={cargandoBackup}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cargandoBackup ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    Restaurando...
                  </>
                ) : (
                  "Sí, restaurar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {notificacion && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold transition-all ${
            notificacion.tipo === "ok"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {notificacion.tipo === "ok" ? (
            <TbCircleCheck size={16} />
          ) : (
            <TbAlertTriangle size={16} />
          )}
          {notificacion.mensaje}
          <button
            onClick={() => setNotificacion(null)}
            className="ml-1 opacity-60 hover:opacity-100"
          >
            <TbX size={14} />
          </button>
        </div>
      )}

      <input
        ref={inputArchivoRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleSeleccionarArchivo}
      />

      {/* Sidebar */}
      <aside className="w-[220px] bg-[#13151b] border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="font-poppins font-bold text-sm text-accent-blue leading-tight uppercase tracking-wider">
            Mundos de Papel
          </div>
          <div className="text-[9px] text-accent-pink uppercase font-semibold tracking-widest mt-0.5">
            AdminPanel
          </div>
        </div>

        <nav className="flex-grow overflow-y-auto py-4">
          <div className="px-5 pt-3 pb-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
            Principal
          </div>
          {["resumen", "ventas"].map((view) => (
            <div
              key={view}
              onClick={() => navigateToView(view)}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
                activeView === view
                  ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {pages[view].icon}
              {pages[view].title}
            </div>
          ))}

          <div className="px-5 pt-4 pb-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold mt-2">
            Gestión
          </div>
          {["inventario", "precios", "clientes", "proveedores"].map((view) => (
            <div
              key={view}
              onClick={() => navigateToView(view)}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
                activeView === view
                  ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {pages[view].icon}
              {pages[view].title}
            </div>
          ))}

          <div className="px-5 pt-4 pb-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold mt-2">
            Sistema
          </div>
          {["alertas", "configuracion"].map((view) => (
            <div
              key={view}
              onClick={() => navigateToView(view)}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-xs cursor-pointer transition-all border-l-2 ${
                activeView === view
                  ? "text-white bg-accent-blue/10 border-accent-blue font-semibold"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {pages[view].icon}
              {pages[view].title}
              {view === "alertas" && pages.alertas.badge > 0 && (
                <span className="ml-auto text-[9px] font-bold bg-accent-pink text-white rounded-full px-1.5 py-0.5">
                  {pages.alertas.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

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

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
              onClick={handleDescargarBackup}
              disabled={descargandoBackup}
              title="Descargar backup de la base de datos"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                descargandoBackup
                  ? "border-accent-blue/30 bg-accent-blue/10 text-accent-blue cursor-not-allowed"
                  : "border-accent-blue/40 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 hover:border-accent-blue/60"
              }`}
            >
              <TbDatabaseExport
                size={16}
                className={descargandoBackup ? "animate-pulse" : ""}
              />
              {descargandoBackup ? "Generando..." : "Descargar data"}
            </button>
            <button
              onClick={() => inputArchivoRef.current?.click()}
              disabled={cargandoBackup}
              title="Restaurar base de datos desde un backup"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 hover:border-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbDatabaseImport size={16} />
              Cargar data
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 bg-transparent text-gray-200 text-xs hover:bg-white/5 transition-all font-semibold"
            >
              <TbHome size={16} />
              Ver tienda
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-[#0c0e12]">
          {activeView === "resumen" && <ResumenView />}
          {activeView === "ventas" && <VentasView />}
          {activeView === "inventario" && <InventarioView />}
          {activeView === "precios" && <PreciosView />}
          {activeView === "clientes" && <ClientesView />}
          {activeView === "proveedores" && <ProveedoresView />}
          {activeView === "alertas" && (
            <AlertasView
              onNavigate={navigateToView}
              onAlertasChange={cargarContadorAlertas}
            />
          )}
          {activeView === "configuracion" && <ConfiguracionView />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
