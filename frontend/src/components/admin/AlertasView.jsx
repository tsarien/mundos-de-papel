import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  TbCheck,
  TbChecks,
  TbTrash,
  TbLoader2,
  TbBell,
  TbBellOff,
  TbAlertTriangle,
  TbAlertCircle,
  TbInfoCircle,
  TbCircleCheck,
  TbArrowRight,
  TbPackage,
  TbUsers,
  TbTag,
  TbShoppingCart,
  TbBuildingStore,
  TbSettings,
} from "react-icons/tb";
import {
  obtenerAlertas,
  marcarAlertaLeida,
  marcarTodasAlertasLeidas,
  eliminarAlerta,
} from "../../services/adminService";
import StatCard from "./StatCard";

const ESTILOS = {
  critico: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    Icon: TbAlertCircle,
  },
  advertencia: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    Icon: TbAlertTriangle,
  },
  info: {
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/30",
    iconBg: "bg-accent-blue/20",
    iconColor: "text-accent-blue",
    Icon: TbInfoCircle,
  },
};

const ACCION_A_VISTA = {
  Reabastecer: { vista: "inventario", Icon: TbPackage },
  Revisar: { vista: "inventario", Icon: TbPackage },
  Contactar: { vista: "clientes", Icon: TbUsers },
  "Ver perfil": { vista: "clientes", Icon: TbUsers },
  "Ver detalles": { vista: "ventas", Icon: TbShoppingCart },
  Actualizar: { vista: "ventas", Icon: TbShoppingCart },
  "Ver pedido": { vista: "ventas", Icon: TbShoppingCart },
  "Ver precios": { vista: "precios", Icon: TbTag },
  Proveedor: { vista: "proveedores", Icon: TbBuildingStore },
  Configurar: { vista: "configuracion", Icon: TbSettings },
};

const AlertaCard = ({ alerta, onLeer, onEliminar, onNavigate }) => {
  const [loadingLeer, setLoadingLeer] = useState(false);
  const [loadingEliminar, setLoadingEliminar] = useState(false);

  const estilo = ESTILOS[alerta.tipo] ?? ESTILOS.info;
  const { Icon } = estilo;
  const nav = ACCION_A_VISTA[alerta.accion];
  const NavIcon = nav?.Icon;

  const handleLeer = async () => {
    if (alerta.leida || loadingLeer) return;
    setLoadingLeer(true);
    try {
      await marcarAlertaLeida(alerta._id);
      onLeer(alerta._id);
      toast.success("Alerta marcada como leída");
    } catch {
      toast.error("No se pudo actualizar la alerta");
    } finally {
      setLoadingLeer(false);
    }
  };

  const handleEliminar = async () => {
    setLoadingEliminar(true);
    try {
      await eliminarAlerta(alerta._id);
      onEliminar(alerta._id);
      toast.success("Alerta eliminada");
    } catch {
      toast.error("No se pudo eliminar la alerta");
    } finally {
      setLoadingEliminar(false);
    }
  };

  return (
    <div
      className={`${estilo.bg} border-l-2 ${estilo.border} rounded-xl p-4 transition-all hover:shadow-sm ${
        alerta.leida ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-3.5">
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-lg ${estilo.iconBg} flex items-center justify-center flex-shrink-0 border border-white/5`}
        >
          <Icon size={16} className={estilo.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold text-xs text-white">
                {alerta.titulo}
              </div>
              {alerta.leida && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 uppercase tracking-wider border border-white/5">
                  Leída
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0">
              {tiempoRelativo(alerta.createdAt)}
            </div>
          </div>

          <div className="text-xs text-gray-300 mb-3 leading-relaxed">
            {alerta.mensaje}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Navigate button */}
            {nav && (
              <button
                onClick={() => onNavigate(nav.vista)}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-[#13151b] border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                {NavIcon && <NavIcon size={11} />}
                {alerta.accion}
                <TbArrowRight size={10} />
              </button>
            )}

            {/* Mark as read */}
            {!alerta.leida && (
              <button
                onClick={handleLeer}
                disabled={loadingLeer}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green hover:bg-accent-green/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingLeer ? (
                  <TbLoader2 size={11} className="animate-spin" />
                ) : (
                  <TbCheck size={11} />
                )}
                Marcar leída
              </button>
            )}

            {/* Delete */}
            <button
              onClick={handleEliminar}
              disabled={loadingEliminar}
              className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50 ml-auto"
            >
              {loadingEliminar ? (
                <TbLoader2 size={11} className="animate-spin" />
              ) : (
                <TbTrash size={11} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const tiempoRelativo = (fecha) => {
  if (!fecha) return "";
  const diff = Date.now() - new Date(fecha).getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  if (horas < 1) return "Hace un momento";
  if (horas < 24) return `Hace ${horas}h`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias}d`;
};

const AlertasView = ({ onNavigate, onAlertasChange }) => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtrando, setFiltrando] = useState("todas");
  const [marcandoTodas, setMarcandoTodas] = useState(false);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerAlertas();
      setAlertas(data.alertas || []);
    } catch {
      toast.error("No se pudieron cargar las alertas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleLeer = (id) => {
    setAlertas((prev) =>
      prev.map((a) => (a._id === id ? { ...a, leida: true } : a)),
    );
    onAlertasChange?.();
  };

  const handleEliminar = (id) => {
    setAlertas((prev) => prev.filter((a) => a._id !== id));
    onAlertasChange?.();
  };

  const handleMarcarTodas = async () => {
    setMarcandoTodas(true);
    try {
      await marcarTodasAlertasLeidas();
      setAlertas((prev) => prev.map((a) => ({ ...a, leida: true })));
      onAlertasChange?.();
      toast.success("Todas las alertas marcadas como leídas");
    } catch {
      toast.error("Error al actualizar alertas");
    } finally {
      setMarcandoTodas(false);
    }
  };

  const noLeidas = alertas.filter((a) => !a.leida).length;
  const criticas = alertas.filter((a) => a.tipo === "critico").length;
  const advertencias = alertas.filter((a) => a.tipo === "advertencia").length;
  const info = alertas.filter((a) => a.tipo === "info").length;

  const alertasFiltradas =
    filtrando === "no_leidas" ? alertas.filter((a) => !a.leida) : alertas;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <TbLoader2 size={24} className="animate-spin text-accent-blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total alertas"
          valor={alertas.length}
          sub="Registradas"
        />
        <StatCard
          label="Sin leer"
          valor={noLeidas}
          sub="Requieren atención"
          subColor={noLeidas > 0 ? "text-accent-pink" : "text-accent-green"}
          hoverColor={
            noLeidas > 0
              ? "hover:border-accent-pink/30"
              : "hover:border-accent-green/30"
          }
        />
        <StatCard
          label="Críticas"
          valor={criticas}
          sub="Alta prioridad"
          subColor="text-red-300"
          hoverColor="hover:border-red-500/30"
        />
        <StatCard
          label="Informativas"
          valor={info}
          sub="Notificaciones"
          subColor="text-accent-blue"
        />
      </div>

      {/* Panel principal */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Alertas del sistema
            </div>
            {noLeidas > 0 && (
              <span className="text-[9px] font-bold bg-accent-pink/20 text-accent-pink border border-accent-pink/30 rounded-full px-2 py-0.5">
                {noLeidas} sin leer
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden text-[10px] font-bold">
              <button
                onClick={() => setFiltrando("todas")}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  filtrando === "todas"
                    ? "bg-accent-blue/20 text-accent-blue"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <TbBell size={12} className="inline mr-1" />
                Todas
              </button>
              <button
                onClick={() => setFiltrando("no_leidas")}
                className={`px-3 py-1.5 transition-colors cursor-pointer border-l border-white/10 ${
                  filtrando === "no_leidas"
                    ? "bg-accent-pink/20 text-accent-pink"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <TbBellOff size={12} className="inline mr-1" />
                Sin leer
              </button>
            </div>

            {/* Mark all read */}
            {noLeidas > 0 && (
              <button
                onClick={handleMarcarTodas}
                disabled={marcandoTodas}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green hover:bg-accent-green/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {marcandoTodas ? (
                  <TbLoader2 size={12} className="animate-spin" />
                ) : (
                  <TbChecks size={12} />
                )}
                Marcar todas leídas
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {alertasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <TbCircleCheck size={36} className="text-accent-green opacity-50" />
            <p className="text-sm font-semibold text-gray-400">
              {filtrando === "no_leidas"
                ? "No hay alertas sin leer"
                : "No hay alertas registradas"}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {alertasFiltradas.map((alerta) => (
              <AlertaCard
                key={alerta._id}
                alerta={alerta}
                onLeer={handleLeer}
                onEliminar={handleEliminar}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertasView;
