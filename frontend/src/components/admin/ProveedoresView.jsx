import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  TbSearch,
  TbX,
  TbDownload,
  TbShoppingBag,
  TbLoader2,
  TbBuildingStore,
  TbChevronDown,
  TbPlus,
} from "react-icons/tb";
import {
  obtenerProveedores,
  actualizarEstadoProveedor,
} from "../../services/adminService";
import { formatearFecha } from "../../utils/formatters";
import StatCard from "./StatCard";
import ModalDetalleProveedor from "./modal/ModalDetalleProveedor";
import ModalHacerPedido from "./modal/ModalHacerPedido";

const ESTADOS_PROVEEDOR = [
  {
    valor: "activo",
    label: "Activo",
    cls: "bg-accent-green/10 text-accent-green border-accent-green/20",
  },
  {
    valor: "pendiente",
    label: "Pendiente",
    cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  {
    valor: "inactivo",
    label: "Inactivo",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
  },
];

const clsEstado = (v) =>
  ESTADOS_PROVEEDOR.find((e) => e.valor === v)?.cls ??
  "bg-white/5 text-gray-300 border-white/10";

const labelEstado = (v) =>
  ESTADOS_PROVEEDOR.find((e) => e.valor === v)?.label ?? v;

const EstadoDropdown = ({ id, estadoActual, onChange }) => {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSelect = async (nuevoEstado) => {
    if (nuevoEstado === estadoActual) {
      setAbierto(false);
      return;
    }
    setCargando(true);
    setAbierto(false);
    try {
      await actualizarEstadoProveedor(id, nuevoEstado);
      onChange(id, nuevoEstado);
      toast.success("Estado actualizado");
    } catch {
      toast.error("Error al actualizar el estado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        disabled={cargando}
        className={`flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border transition-all cursor-pointer ${clsEstado(estadoActual)} disabled:opacity-60`}
      >
        {cargando ? (
          <TbLoader2 size={9} className="animate-spin" />
        ) : (
          <>
            {labelEstado(estadoActual)}
            <TbChevronDown size={9} />
          </>
        )}
      </button>
      {abierto && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAbierto(false)}
          />
          <div className="absolute right-0 mt-1 z-20 bg-[#1a1d24] rounded-xl border border-white/10 shadow-xl overflow-hidden min-w-[110px]">
            {ESTADOS_PROVEEDOR.map((e) => (
              <button
                key={e.valor}
                type="button"
                onClick={() => handleSelect(e.valor)}
                className={`w-full text-left px-3 py-2 text-[10px] font-bold transition-colors hover:bg-white/5 flex items-center gap-2 cursor-pointer ${
                  estadoActual === e.valor ? "text-white" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    e.valor === "activo"
                      ? "bg-accent-green"
                      : e.valor === "pendiente"
                        ? "bg-yellow-500"
                        : "bg-red-400"
                  }`}
                />
                {e.label}
                {estadoActual === e.valor && (
                  <span className="ml-auto text-[8px] text-gray-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProveedoresView = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalPedido, setModalPedido] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerProveedores();
      setProveedores(data.proveedores || []);
    } catch {
      toast.error("No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const proveedoresFiltrados = useMemo(() => {
    return proveedores.filter((p) => {
      const q = busqueda.toLowerCase();
      const matchBusqueda =
        !busqueda ||
        p.nombre?.toLowerCase().includes(q) ||
        p.contacto?.toLowerCase().includes(q) ||
        p.telefono?.toLowerCase().includes(q);

      const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;

      let matchFecha = true;
      if (fechaDesde || fechaHasta) {
        const fecha = p.ultimoPedido ? new Date(p.ultimoPedido) : null;
        if (!fecha) {
          matchFecha = false;
        } else {
          if (fechaDesde)
            matchFecha = matchFecha && fecha >= new Date(fechaDesde);
          if (fechaHasta) {
            const hasta = new Date(fechaHasta);
            hasta.setHours(23, 59, 59);
            matchFecha = matchFecha && fecha <= hasta;
          }
        }
      }

      return matchBusqueda && matchEstado && matchFecha;
    });
  }, [proveedores, busqueda, filtroEstado, fechaDesde, fechaHasta]);

  const activos = proveedores.filter((p) => p.estado === "activo").length;
  const pendientes = proveedores.filter((p) => p.estado === "pendiente").length;
  const totalProductos = proveedores.reduce(
    (acc, p) => acc + (p.productos || 0),
    0,
  );

  const handleEstadoChange = (id, nuevoEstado) => {
    setProveedores((prev) =>
      prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p)),
    );
  };

  const descargarExcel = () => {
    const BOM = "\uFEFF";
    const encabezados = [
      "Proveedor",
      "Contacto",
      "Teléfono",
      "Productos",
      "Último pedido",
      "Estado",
    ];
    const filas = proveedoresFiltrados.map((p) => [
      p.nombre || "",
      p.contacto || "",
      p.telefono || "",
      p.productos ?? 0,
      p.ultimoPedido
        ? new Date(p.ultimoPedido).toLocaleDateString("es-CO")
        : "—",
      labelEstado(p.estado),
    ]);
    const csv =
      BOM +
      [encabezados, ...filas]
        .map((fila) =>
          fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proveedores-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Excel descargado", {
      description: `${proveedoresFiltrados.length} proveedores exportados.`,
    });
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("todos");
    setFechaDesde("");
    setFechaHasta("");
  };

  const hayFiltros =
    busqueda || filtroEstado !== "todos" || fechaDesde || fechaHasta;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <TbLoader2 size={24} className="animate-spin text-accent-blue" />
      </div>
    );
  }

  const maxProductos = Math.max(...proveedores.map((p) => p.productos || 0), 1);

  return (
    <>
      <div className="flex flex-col gap-5 text-white">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total proveedores"
            valor={proveedores.length}
            sub="Registrados"
          />
          <StatCard
            label="Proveedores activos"
            valor={activos}
            sub="Con pedidos recientes"
            subColor="text-accent-green"
          />
          <StatCard
            label="Productos totales"
            valor={totalProductos}
            sub="En catálogo"
          />
          <StatCard
            label="Pendientes"
            valor={pendientes}
            sub="Por confirmar"
            subColor="text-yellow-400"
            hoverColor="hover:border-yellow-500/30"
          />
        </div>

        {/* Directorio principal */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/5 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Directorio de proveedores
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={descargarExcel}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green hover:bg-accent-green/20 transition-all cursor-pointer"
              >
                <TbDownload size={12} />
                Descargar Excel
              </button>
              <button
                onClick={() => {
                  // Open pedido modal without pre-selected supplier
                  setModalPedido({ _id: null, nombre: "Seleccionar" });
                }}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple hover:bg-accent-purple/20 transition-all cursor-pointer"
              >
                <TbShoppingBag size={12} />
                Hacer Pedido
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Búsqueda */}
            <div className="relative lg:col-span-2">
              <TbSearch
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Buscar por nombre, contacto o teléfono…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-white/10 bg-[#13151b] text-white placeholder-gray-600 focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>

            {/* Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-white/10 bg-[#13151b] text-white focus:outline-none focus:border-accent-blue transition-colors cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              {ESTADOS_PROVEEDOR.map((e) => (
                <option key={e.valor} value={e.valor}>
                  {e.label}
                </option>
              ))}
            </select>

            {/* Limpiar */}
            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center justify-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <TbX size={12} />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Filtros de fecha */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Último pedido:
              </span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#13151b] text-white focus:outline-none focus:border-accent-blue transition-colors [color-scheme:dark]"
              />
              <span className="text-[10px] text-gray-500">hasta</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#13151b] text-white focus:outline-none focus:border-accent-blue transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Tabla */}
          {proveedoresFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <TbBuildingStore size={32} className="text-gray-600" />
              <p className="text-sm text-gray-500">
                No se encontraron proveedores
              </p>
              {hayFiltros && (
                <button
                  onClick={limpiarFiltros}
                  className="text-xs text-accent-blue hover:underline mt-1"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
                    <th className="text-left pb-2.5 font-bold tracking-wider w-[35%]">
                      Proveedor
                    </th>
                    <th className="text-left pb-2.5 font-bold tracking-wider w-[25%]">
                      Contacto
                    </th>
                    <th className="text-center pb-2.5 font-bold tracking-wider w-[12%]">
                      Productos
                    </th>
                    <th className="text-left pb-2.5 font-bold tracking-wider w-[18%] pl-4">
                      Último pedido
                    </th>
                    <th className="text-right pb-2.5 font-bold tracking-wider w-[10%]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proveedoresFiltrados.map((proveedor) => (
                    <tr
                      key={proveedor._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Proveedor */}
                      <td className="py-3 pr-4">
                        <button
                          type="button"
                          onClick={() => setModalDetalle(proveedor._id)}
                          className="font-semibold text-white hover:text-accent-blue transition-colors text-left cursor-pointer bg-transparent border-none group-hover:underline underline-offset-2"
                        >
                          {proveedor.nombre}
                        </button>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {proveedor.telefono || "Sin teléfono"}
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="py-3 pr-4 text-gray-300">
                        {proveedor.contacto || "—"}
                      </td>

                      {/* Productos */}
                      <td className="py-3 text-center">
                        <span className="font-bold text-white">
                          {proveedor.productos ?? 0}
                        </span>
                      </td>

                      {/* Último pedido */}
                      <td className="py-3 pl-4">
                        {proveedor.ultimoPedido ? (
                          <button
                            type="button"
                            onClick={() => setModalDetalle(proveedor._id)}
                            className="text-gray-300 hover:text-accent-blue transition-colors cursor-pointer bg-transparent border-none text-left hover:underline underline-offset-2"
                          >
                            {formatearFecha(proveedor.ultimoPedido)}
                          </button>
                        ) : (
                          <span className="text-gray-600">Sin pedidos</span>
                        )}
                      </td>

                      {/* Estado dropdown */}
                      <td className="py-3 text-right">
                        <EstadoDropdown
                          id={proveedor._id}
                          estadoActual={proveedor.estado || "activo"}
                          onChange={handleEstadoChange}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer con conteo */}
          {proveedoresFiltrados.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
              <span>
                Mostrando{" "}
                <span className="text-gray-300 font-bold">
                  {proveedoresFiltrados.length}
                </span>{" "}
                de{" "}
                <span className="text-gray-300 font-bold">
                  {proveedores.length}
                </span>{" "}
                proveedores
              </span>
              <button
                onClick={() => setModalPedido(null)}
                className="sr-only"
              />
            </div>
          )}
        </div>

        {/* Distribución de productos */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
            Distribución de productos por proveedor
          </div>
          <div className="space-y-4">
            {[...proveedores]
              .sort((a, b) => (b.productos || 0) - (a.productos || 0))
              .map((proveedor) => {
                const pct = totalProductos
                  ? ((proveedor.productos || 0) / totalProductos) * 100
                  : 0;
                return (
                  <div key={proveedor._id} className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setModalDetalle(proveedor._id)}
                      className="text-xs font-semibold text-gray-300 w-44 truncate text-left hover:text-accent-blue transition-colors cursor-pointer bg-transparent border-none"
                    >
                      {proveedor.nombre}
                    </button>
                    <div className="flex-1 h-2 bg-[#13151b] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-accent-blue rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(126,195,230,0.5)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-400 w-20 text-right flex-shrink-0">
                      {proveedor.productos ?? 0}{" "}
                      <span className="text-gray-600">({pct.toFixed(0)}%)</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Modal Detalle/Editar Proveedor */}
      {modalDetalle && (
        <ModalDetalleProveedor
          proveedorId={modalDetalle}
          onClose={() => setModalDetalle(null)}
          onSuccess={cargar}
          onHacerPedido={(prov) => {
            setModalDetalle(null);
            setModalPedido(prov);
          }}
        />
      )}

      {/* Modal Hacer Pedido */}
      {modalPedido && modalPedido._id && (
        <ModalHacerPedido
          proveedor={modalPedido}
          onClose={() => setModalPedido(null)}
          onSuccess={() => {
            cargar();
            setModalPedido(null);
          }}
        />
      )}

      {/* Selector de proveedor para "Hacer Pedido" desde el header */}
      {modalPedido && !modalPedido._id && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setModalPedido(null)}
        >
          <div
            className="glass-panel rounded-2xl border border-white/10 w-full max-w-sm p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
                  <TbShoppingBag size={15} className="text-accent-purple" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Seleccionar proveedor
                </h3>
              </div>
              <button
                onClick={() => setModalPedido(null)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                <TbX size={16} />
              </button>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {proveedores
                .filter(
                  (p) => p.estado === "activo" || p.estado === "pendiente",
                )
                .map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => setModalPedido(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors cursor-pointer bg-transparent border border-transparent hover:border-white/10"
                  >
                    <TbBuildingStore
                      size={14}
                      className="text-accent-blue flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {p.nombre}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                        {p.contacto}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${clsEstado(p.estado)}`}
                    >
                      {labelEstado(p.estado)}
                    </span>
                  </button>
                ))}
              {proveedores.filter(
                (p) => p.estado === "activo" || p.estado === "pendiente",
              ).length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">
                  No hay proveedores activos
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProveedoresView;
