import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  TbSearch,
  TbChevronUp,
  TbChevronDown,
  TbSelector,
  TbLoader2,
  TbCalendar,
  TbX,
  TbFileDownload,
} from "react-icons/tb";
import { formatearFecha } from "../../utils/formatters.js";
import {
  obtenerClientes,
  actualizarEstadoCliente,
} from "../../services/adminService";
import StatCard from "./StatCard.jsx";
import ModalDetalleCliente from "./modal/ModalDetalleCliente";

// ─── Constants ────────────────────────────────────────────────────────────────
const ESTADOS_CLIENTE = ["VIP", "Activo", "Nuevo"];

// ─── Helpers at module scope (no remount) ─────────────────────────────────────
const claseEstadoCliente = (estado) => {
  if (estado === "VIP")
    return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
  if (estado === "Nuevo")
    return "bg-accent-green/10 text-accent-green border-accent-green/20";
  return "bg-white/5 text-gray-300 border-white/10";
};

const CLS_INLINE_SELECT =
  "bg-[#0d0d1a] border border-accent-blue/50 rounded text-[9px] text-white px-2 py-0.5 focus:outline-none cursor-pointer";

const SortIcon = ({ orden }) => {
  if (orden === "asc")
    return <TbChevronUp size={11} className="text-accent-blue shrink-0" />;
  if (orden === "desc")
    return <TbChevronDown size={11} className="text-accent-blue shrink-0" />;
  return <TbSelector size={11} className="text-gray-600 shrink-0" />;
};

// ─── CSV / Excel export ───────────────────────────────────────────────────────
const descargarCSV = (clientes) => {
  if (!clientes.length) {
    toast.warning("No hay datos para exportar");
    return;
  }
  const encabezados = [
    "Nombre",
    "Email",
    "Pedidos",
    "Total comprado (COP)",
    "Última compra",
    "Estado",
  ];
  const filas = clientes.map((c) => [
    c.nombre,
    c.email,
    c.pedidos,
    c.total,
    formatearFecha(c.ultima),
    c.estado,
  ]);
  const csv = [encabezados, ...filas]
    .map((f) =>
      f.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `clientes-${new Date().toISOString().slice(0, 10)}.csv`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Main component ───────────────────────────────────────────────────────────
const ClientesView = () => {
  // ── Data ──
  const [clientes, setClientes] = useState([]);
  const [resumen, setResumen] = useState({
    total: 0,
    vip: 0,
    nuevos: 0,
    valorPromedio: 0,
  });
  const [loading, setLoading] = useState(true);

  // ── Filters & sort ──
  const [busqueda, setBusqueda] = useState("");
  const [ordenPedidos, setOrdenPedidos] = useState(null);
  const [ordenTotal, setOrdenTotal] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // ── Inline editing ──
  const [editandoEstado, setEditandoEstado] = useState(null);
  const [actualizando, setActualizando] = useState(null);

  // ── Modal ──
  const [clienteDetalle, setClienteDetalle] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerClientes();
      const { lista, total, vip, nuevos, valorPromedio } = data.clientes;
      setClientes(lista || []);
      setResumen({
        total: total || 0,
        vip: vip || 0,
        nuevos: nuevos || 0,
        valorPromedio: valorPromedio || 0,
      });
    } catch {
      toast.error("No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const clientesFiltrados = useMemo(() => {
    let lista = [...clientes];

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q),
      );
    }
    if (fechaInicio) {
      const desde = new Date(fechaInicio);
      lista = lista.filter((c) => c.ultima && new Date(c.ultima) >= desde);
    }
    if (fechaFin) {
      const hasta = new Date(fechaFin);
      hasta.setHours(23, 59, 59, 999);
      lista = lista.filter((c) => c.ultima && new Date(c.ultima) <= hasta);
    }
    if (ordenPedidos === "asc") lista.sort((a, b) => a.pedidos - b.pedidos);
    else if (ordenPedidos === "desc")
      lista.sort((a, b) => b.pedidos - a.pedidos);
    else if (ordenTotal === "asc") lista.sort((a, b) => a.total - b.total);
    else if (ordenTotal === "desc") lista.sort((a, b) => b.total - a.total);

    return lista;
  }, [clientes, busqueda, fechaInicio, fechaFin, ordenPedidos, ordenTotal]);

  // ── Sort toggle ────────────────────────────────────────────────────────────
  const toggleOrden = (campo) => {
    if (campo === "pedidos") {
      setOrdenTotal(null);
      setOrdenPedidos((prev) =>
        prev === null ? "desc" : prev === "desc" ? "asc" : null,
      );
    } else {
      setOrdenPedidos(null);
      setOrdenTotal((prev) =>
        prev === null ? "desc" : prev === "desc" ? "asc" : null,
      );
    }
  };

  // ── Status change ──────────────────────────────────────────────────────────
  const cambiarEstadoCliente = async (clienteId, nuevoEstado) => {
    setEditandoEstado(null);
    setActualizando(clienteId);
    try {
      await actualizarEstadoCliente(clienteId, nuevoEstado);
      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteId ? { ...c, estado: nuevoEstado } : c,
        ),
      );
      toast.success("Estado actualizado");
    } catch {
      toast.error("No se pudo actualizar el estado");
    } finally {
      setActualizando(null);
    }
  };

  const hayFiltros = !!(
    busqueda ||
    fechaInicio ||
    fechaFin ||
    ordenPedidos ||
    ordenTotal
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    setOrdenPedidos(null);
    setOrdenTotal(null);
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <TbLoader2 size={16} className="animate-spin" />
        Cargando clientes...
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-5 text-white">
        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total clientes"
            valor={resumen.total}
            sub="Registrados"
          />
          <StatCard
            label="Clientes VIP"
            valor={resumen.vip}
            sub="+10 pedidos"
            subColor="text-accent-blue"
            hoverColor="hover:border-accent-blue/30"
          />
          <StatCard
            label="Nuevos este mes"
            valor={resumen.nuevos}
            sub="Recientes"
            subColor="text-accent-green"
            hoverColor="hover:border-accent-green/30"
          />
          <StatCard
            label="Valor promedio"
            valor={`$${Math.round(resumen.valorPromedio / 1000)}K`}
            sub="Por cliente"
          />
        </div>

        {/* ── Table panel ───────────────────────────────────────────────────── */}
        <div className="glass-panel rounded-2xl border border-white/5 shadow-soft overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
              Base de datos de clientes
            </div>
            <div className="flex items-center gap-3">
              {hayFiltros && (
                <button
                  onClick={limpiarFiltros}
                  className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-accent-blue transition-colors"
                >
                  <TbX size={11} />
                  Limpiar filtros
                </button>
              )}
              <button
                onClick={() => descargarCSV(clientesFiltrados)}
                title={
                  hayFiltros
                    ? "Descargar clientes filtrados"
                    : "Descargar todos los clientes"
                }
                className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-accent-green/15 text-accent-green border border-accent-green/25 hover:bg-accent-green hover:text-bg transition-all cursor-pointer"
              >
                <TbFileDownload size={13} />
                Descargar Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-500">
                  {/* ── Cliente — with name search ── */}
                  <th className="text-left px-5 py-3 font-bold tracking-wider text-[10px] uppercase w-[32%]">
                    <div className="flex flex-col gap-2">
                      <span>Cliente</span>
                      <div className="relative">
                        <TbSearch
                          size={11}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          placeholder="Buscar por nombre..."
                          className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white placeholder-gray-600 focus:outline-none focus:border-accent-blue/40 normal-case font-normal tracking-normal transition-colors"
                        />
                      </div>
                    </div>
                  </th>

                  {/* ── Pedidos — sortable ── */}
                  <th className="text-right px-3 py-3 font-bold tracking-wider text-[10px] uppercase w-[11%]">
                    <button
                      onClick={() => toggleOrden("pedidos")}
                      className={`flex items-center justify-end gap-1 w-full cursor-pointer hover:text-white transition-colors ${
                        ordenPedidos ? "text-accent-blue" : ""
                      }`}
                    >
                      <span>Pedidos</span>
                      <SortIcon orden={ordenPedidos} />
                    </button>
                  </th>

                  {/* ── Total comprado — sortable ── */}
                  <th className="text-right px-5 py-3 font-bold tracking-wider text-[10px] uppercase w-[17%]">
                    <button
                      onClick={() => toggleOrden("total")}
                      className={`flex items-center justify-end gap-1 w-full cursor-pointer hover:text-white transition-colors ${
                        ordenTotal ? "text-accent-blue" : ""
                      }`}
                    >
                      <span>Total comprado</span>
                      <SortIcon orden={ordenTotal} />
                    </button>
                  </th>

                  {/* ── Última compra — date range filter ── */}
                  <th className="text-left px-5 py-3 font-bold tracking-wider text-[10px] uppercase w-[25%]">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <TbCalendar
                          size={11}
                          className={
                            fechaInicio || fechaFin
                              ? "text-accent-blue"
                              : "text-gray-600"
                          }
                        />
                        <span
                          className={
                            fechaInicio || fechaFin ? "text-accent-blue" : ""
                          }
                        >
                          Última compra
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          title="Desde"
                          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] text-white focus:outline-none focus:border-accent-blue/40 [color-scheme:dark] font-normal tracking-normal normal-case transition-colors"
                        />
                        <span className="text-gray-600 text-[10px] shrink-0">
                          —
                        </span>
                        <input
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          title="Hasta"
                          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] text-white focus:outline-none focus:border-accent-blue/40 [color-scheme:dark] font-normal tracking-normal normal-case transition-colors"
                        />
                      </div>
                    </div>
                  </th>

                  {/* ── Estado ── */}
                  <th className="text-right px-5 py-3 font-bold tracking-wider text-[10px] uppercase w-[15%]">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-14 text-center text-gray-600 text-xs italic"
                    >
                      {hayFiltros
                        ? "No se encontraron clientes con los filtros actuales."
                        : "No hay clientes registrados."}
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/[0.025] transition-colors ${
                        actualizando === cliente.id
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                    >
                      {/* ── Cliente: clickable name ── */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setClienteDetalle(cliente)}
                          className="text-left group w-full"
                          title="Ver detalle del cliente"
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-white group-hover:text-accent-purple transition-colors">
                            <span className="truncate max-w-[180px]">
                              {cliente.nombre}
                            </span>
                            <svg
                              className="w-3 h-3 text-gray-600 group-hover:text-accent-purple/70 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {cliente.email}
                          </div>
                        </button>
                      </td>

                      {/* ── Pedidos ── */}
                      <td className="px-3 py-3 text-right font-semibold text-white">
                        {cliente.pedidos}
                      </td>

                      {/* ── Total comprado ── */}
                      <td className="px-5 py-3 text-right font-bold text-white">
                        ${cliente.total.toLocaleString()}
                      </td>

                      {/* ── Última compra ── */}
                      <td className="px-5 py-3 text-gray-300 text-[11px]">
                        {formatearFecha(cliente.ultima)}
                      </td>

                      {/* ── Estado: inline dropdown ── */}
                      <td className="px-5 py-3 text-right">
                        {editandoEstado === cliente.id ? (
                          <select
                            autoFocus
                            defaultValue={cliente.estado}
                            onChange={(e) =>
                              cambiarEstadoCliente(cliente.id, e.target.value)
                            }
                            onBlur={() => setEditandoEstado(null)}
                            className={CLS_INLINE_SELECT}
                          >
                            {ESTADOS_CLIENTE.map((e) => (
                              <option key={e} value={e}>
                                {e}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditandoEstado(cliente.id)}
                            title="Clic para cambiar estado"
                            className={`inline-flex items-center text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border transition-all hover:brightness-125 hover:ring-1 hover:ring-white/10 cursor-pointer ${claseEstadoCliente(cliente.estado)}`}
                          >
                            {cliente.estado}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {hayFiltros && (
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500">
                Mostrando{" "}
                <span className="text-white font-semibold">
                  {clientesFiltrados.length}
                </span>{" "}
                de{" "}
                <span className="text-white font-semibold">
                  {clientes.length}
                </span>{" "}
                clientes
              </span>
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-accent-blue transition-colors"
              >
                <TbX size={11} />
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>

        {/* ── Top clientes ──────────────────────────────────────────────────── */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
            Top clientes por compras
          </div>
          <div className="space-y-3.5 mt-2">
            {[...clientes]
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((cliente, index) => (
                <div key={cliente.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue border border-accent-blue/20 shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {cliente.nombre}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {cliente.pedidos} pedido{cliente.pedidos !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-white shrink-0">
                    ${cliente.total.toLocaleString()}
                  </div>
                </div>
              ))}
            {clientes.length === 0 && (
              <p className="text-xs text-gray-600 italic">
                No hay datos disponibles.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────────── */}
      {clienteDetalle && (
        <ModalDetalleCliente
          clienteResumen={clienteDetalle}
          onClose={() => setClienteDetalle(null)}
          onSuccess={cargar}
        />
      )}
    </>
  );
};

export default ClientesView;
