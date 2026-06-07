import { useState, useEffect, useMemo, useCallback } from "react";
import { formatearFecha } from "../../utils/formatters.js";
import { obtenerVentas } from "../../services/adminService";
import api from "../../services/api";
import StatCard from "./StatCard";
import ModalDetallePedido from "./modal/ModalDetallePedido.jsx";
import {
  ESTADOS_PEDIDO,
  ESTADOS_PAGO,
  claseEstado,
  claseTipo,
  labelEstado,
  labelTipo,
  valorEstado,
  valorTipo,
} from "../../utils/constants.js";

const descargarCSV = (pedidos) => {
  if (!pedidos.length) return;
  const encabezados = [
    "Número",
    "Cliente",
    "Producto",
    "Fecha",
    "Tipo de Pago",
    "Total",
    "Estado",
  ];
  const filas = pedidos.map((p) => [
    p.numero,
    p.cliente,
    p.producto,
    formatearFecha(p.fecha),
    labelTipo(p.tipo),
    p.total,
    labelEstado(p.estado),
  ]);
  const csv = [encabezados, ...filas]
    .map((f) =>
      f.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `ventas-${new Date().toISOString().slice(0, 10)}.csv`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const CLS_INPUT =
  "w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] text-white " +
  "placeholder-gray-600 focus:outline-none focus:border-accent-blue/40 transition-colors";
const CLS_SELECT =
  "w-full bg-[#0d0d1a] border border-white/10 rounded px-2 py-1 text-[10px] text-white " +
  "focus:outline-none focus:border-accent-blue/40 transition-colors cursor-pointer";
const CLS_DATE =
  "bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] text-white " +
  "focus:outline-none focus:border-accent-blue/40 transition-colors [color-scheme:dark]";
const CLS_INLINE_SELECT =
  "bg-[#0d0d1a] border border-accent-blue/50 rounded text-[9px] text-white px-2 py-0.5 focus:outline-none cursor-pointer";

const VentasView = () => {
  const [ventas, setVentas] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [ordenTotal, setOrdenTotal] = useState(null);

  const [editando, setEditando] = useState(null);
  const [actualizando, setActualizando] = useState(null);
  const [modalPedidoId, setModalPedidoId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerVentas();
        setVentas(data.ventas);
        setPedidos(data.ventas?.pedidos ?? []);
      } catch {
        setVentas(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    let lista = [...pedidos];
    if (fechaInicio) {
      const desde = new Date(fechaInicio);
      lista = lista.filter((p) => new Date(p.fecha) >= desde);
    }
    if (fechaFin) {
      const hasta = new Date(fechaFin);
      hasta.setHours(23, 59, 59, 999);
      lista = lista.filter((p) => new Date(p.fecha) <= hasta);
    }
    if (busquedaCliente.trim()) {
      const q = busquedaCliente.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.cliente?.toLowerCase().includes(q) ||
          p.producto?.toLowerCase().includes(q) ||
          p.numero?.toLowerCase().includes(q),
      );
    }
    if (filtroTipo)
      lista = lista.filter((p) => labelTipo(p.tipo) === filtroTipo);
    if (filtroEstado)
      lista = lista.filter((p) => labelEstado(p.estado) === filtroEstado);
    if (ordenTotal === "asc") lista.sort((a, b) => a.total - b.total);
    if (ordenTotal === "desc") lista.sort((a, b) => b.total - a.total);
    return lista;
  }, [
    pedidos,
    fechaInicio,
    fechaFin,
    busquedaCliente,
    filtroTipo,
    filtroEstado,
    ordenTotal,
  ]);

  const hayFiltros = !!(
    fechaInicio ||
    fechaFin ||
    busquedaCliente ||
    filtroTipo ||
    filtroEstado ||
    ordenTotal
  );

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setBusquedaCliente("");
    setFiltroTipo("");
    setFiltroEstado("");
    setOrdenTotal(null);
  };

  const actualizarEstado = async (pedidoId, nuevoValor) => {
    setEditando(null);
    setActualizando(pedidoId);
    try {
      await api.put(`/pedidos/${pedidoId}/estado`, { estado: nuevoValor });
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoValor } : p)),
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    } finally {
      setActualizando(null);
    }
  };

  const actualizarPago = async (pedidoId, nuevoValor) => {
    setEditando(null);
    setActualizando(pedidoId);
    try {
      await api.put(`/pedidos/${pedidoId}/estado-pago`, {
        estadoPago: nuevoValor,
      });
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, tipo: labelTipo(nuevoValor) } : p,
        ),
      );
    } catch (err) {
      console.error("Error al actualizar pago:", err);
    } finally {
      setActualizando(null);
    }
  };

  const toggleOrdenTotal = () =>
    setOrdenTotal((prev) =>
      prev === null ? "desc" : prev === "desc" ? "asc" : null,
    );

  const cerrarModal = useCallback(() => setModalPedidoId(null), []);

  if (loading)
    return <p className="text-gray-400 text-sm">Cargando ventas...</p>;
  if (!ventas)
    return (
      <p className="text-gray-400 text-sm">No se pudieron cargar las ventas.</p>
    );

  return (
    <>
      <div className="flex flex-col gap-5 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Ventas hoy"
            valor={`$${ventas.ventasHoy.toLocaleString()}`}
            sub={`${ventas.pedidosHoy} pedidos`}
            subColor="text-accent-green"
          />
          <StatCard
            label="Promedio por pedido"
            valor={`$${Math.round(ventas.promedioPedido / 1000)}K`}
            sub="Hoy"
          />
          <StatCard
            label="Completados"
            valor={ventas.completadosMes}
            sub="Este mes"
          />
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          {/* Barra superior: título + fechas + descarga */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-5 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">
                Todos los pedidos
              </span>
              {hayFiltros && (
                <>
                  <span className="text-[9px] bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {pedidosFiltrados.length} resultado
                    {pedidosFiltrados.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={limpiarFiltros}
                    className="text-[9px] text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                  >
                    Limpiar filtros
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <svg
                  className="w-3 h-3 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className={`${CLS_DATE} w-28`}
                />
                <span className="text-gray-600 text-[10px] select-none">→</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={`${CLS_DATE} w-28`}
                />
                {(fechaInicio || fechaFin) && (
                  <button
                    onClick={() => {
                      setFechaInicio("");
                      setFechaFin("");
                    }}
                    className="text-gray-500 hover:text-gray-300 transition-colors text-xs ml-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => descargarCSV(pedidosFiltrados)}
                disabled={!pedidosFiltrados.length}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-green/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Descargar Excel
                {hayFiltros && pedidosFiltrados.length !== pedidos.length && (
                  <span className="opacity-60 normal-case font-normal">
                    ({pedidosFiltrados.length})
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
                  <th className="text-left pb-2 font-bold tracking-wider">
                    Cliente / Producto
                  </th>
                  <th className="text-left pb-2 font-bold tracking-wider">
                    Fecha
                  </th>
                  <th className="text-right pb-2 font-bold tracking-wider">
                    Pago
                  </th>
                  <th className="text-right pb-2 font-bold tracking-wider">
                    <button
                      onClick={toggleOrdenTotal}
                      className="ml-auto flex items-center gap-1 hover:text-white transition-colors group"
                    >
                      Total
                      <span className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">
                        {ordenTotal === "asc"
                          ? "↑"
                          : ordenTotal === "desc"
                            ? "↓"
                            : "↕"}
                      </span>
                    </button>
                  </th>
                  <th className="text-right pb-2 font-bold tracking-wider">
                    Estado
                  </th>
                </tr>

                {/* Fila de filtros por columna */}
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-2">
                    <div className="relative">
                      <svg
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-500 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar cliente, producto, #..."
                        value={busquedaCliente}
                        onChange={(e) => setBusquedaCliente(e.target.value)}
                        className={`${CLS_INPUT} pl-6`}
                      />
                      {busquedaCliente && (
                        <button
                          onClick={() => setBusquedaCliente("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-2">
                    <div
                      className={`${CLS_INPUT} flex items-center gap-1.5 cursor-default ${fechaInicio || fechaFin ? "border-accent-blue/30 text-accent-blue/80" : "text-gray-600"}`}
                    >
                      <svg
                        className="w-2.5 h-2.5 shrink-0 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[9px] truncate">
                        {fechaInicio || fechaFin
                          ? `${fechaInicio || "…"} → ${fechaFin || "…"}`
                          : "Usar filtro de fecha ↑"}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pr-0">
                    <select
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      className={CLS_SELECT}
                    >
                      <option value="">Todos los pagos</option>
                      {ESTADOS_PAGO.map((e) => (
                        <option key={e.valor} value={e.label}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <button
                      onClick={toggleOrdenTotal}
                      className={`${CLS_INPUT} flex items-center justify-center gap-1 cursor-pointer hover:border-accent-blue/30 ${ordenTotal ? "border-accent-blue/30 text-accent-blue/80" : "text-gray-600"}`}
                    >
                      <span className="text-[9px]">
                        {ordenTotal === "asc"
                          ? "↑ Menor a mayor"
                          : ordenTotal === "desc"
                            ? "↓ Mayor a menor"
                            : "Ordenar total ↕"}
                      </span>
                    </button>
                  </td>
                  <td className="py-2">
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                      className={CLS_SELECT}
                    >
                      <option value="">Todos los estados</option>
                      {ESTADOS_PEDIDO.map((e) => (
                        <option key={e.valor} value={e.label}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </thead>

              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-gray-600 text-xs"
                    >
                      {hayFiltros
                        ? "No se encontraron pedidos con los filtros actuales."
                        : "No hay pedidos registrados."}
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${actualizando === pedido.id ? "opacity-40 pointer-events-none" : ""}`}
                    >
                      <td className="py-2.5">
                        <button
                          onClick={() => setModalPedidoId(pedido.id)}
                          className="text-left group w-full"
                          title="Ver detalle"
                        >
                          <div className="font-semibold text-white group-hover:text-accent-blue transition-colors flex items-center gap-1.5">
                            <span>
                              {pedido.numero} · {pedido.cliente}
                            </span>
                            <svg
                              className="w-3 h-3 text-gray-600 group-hover:text-accent-blue/70 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {pedido.producto}
                          </div>
                        </button>
                      </td>

                      <td className="py-2.5 text-gray-300">
                        {formatearFecha(pedido.fecha)}
                      </td>

                      <td className="py-2.5 text-right">
                        {editando?.id === pedido.id &&
                        editando?.campo === "tipo" ? (
                          <select
                            autoFocus
                            defaultValue={valorTipo(pedido.tipo)}
                            onChange={(e) =>
                              actualizarPago(pedido.id, e.target.value)
                            }
                            onBlur={() => setEditando(null)}
                            className={CLS_INLINE_SELECT}
                          >
                            {ESTADOS_PAGO.map((e) => (
                              <option key={e.valor} value={e.valor}>
                                {e.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() =>
                              setEditando({ id: pedido.id, campo: "tipo" })
                            }
                            title="Clic para cambiar"
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border transition-all hover:brightness-125 hover:ring-1 hover:ring-white/10 cursor-pointer ${claseTipo(pedido.tipo)}`}
                          >
                            {labelTipo(pedido.tipo)}
                          </button>
                        )}
                      </td>

                      <td className="py-2.5 text-right font-bold text-white">
                        ${pedido.total.toLocaleString()}
                      </td>

                      <td className="py-2.5 text-right">
                        {editando?.id === pedido.id &&
                        editando?.campo === "estado" ? (
                          <select
                            autoFocus
                            defaultValue={valorEstado(pedido.estado)}
                            onChange={(e) =>
                              actualizarEstado(pedido.id, e.target.value)
                            }
                            onBlur={() => setEditando(null)}
                            className={CLS_INLINE_SELECT}
                          >
                            {ESTADOS_PEDIDO.map((e) => (
                              <option key={e.valor} value={e.valor}>
                                {e.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() =>
                              setEditando({ id: pedido.id, campo: "estado" })
                            }
                            title="Clic para cambiar"
                            className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border transition-all hover:brightness-125 hover:ring-1 hover:ring-white/10 cursor-pointer ${claseEstado(pedido.estado)}`}
                          >
                            {labelEstado(pedido.estado)}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {hayFiltros && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500">
                Mostrando{" "}
                <span className="text-white font-semibold">
                  {pedidosFiltrados.length}
                </span>{" "}
                de{" "}
                <span className="text-white font-semibold">
                  {pedidos.length}
                </span>{" "}
                pedidos
              </span>
              <button
                onClick={limpiarFiltros}
                className="text-[10px] text-gray-500 hover:text-accent-blue transition-colors"
              >
                Limpiar todos los filtros ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {modalPedidoId && (
        <ModalDetallePedido pedidoId={modalPedidoId} onClose={cerrarModal} />
      )}
    </>
  );
};

export default VentasView;
