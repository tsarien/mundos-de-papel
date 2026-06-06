import { formatearFecha } from "../../utils/formatters.js";
import { useState, useEffect, useMemo, useCallback } from "react";
import { obtenerVentas } from "../../services/adminService";
import api from "../../services/api";

/* ─────────────────────────────────────────────────────────────────────────────
   Constantes de dominio
───────────────────────────────────────────────────────────────────────────── */

const ESTADOS_PEDIDO = [
  { valor: "procesando", label: "Procesando" },
  { valor: "confirmado", label: "Confirmado" },
  { valor: "enviado", label: "Enviado" },
  { valor: "entregado", label: "Completado" },
  { valor: "cancelado", label: "Cancelado" },
];

const ESTADOS_PAGO = [
  { valor: "pagado", label: "Contado" },
  { valor: "pendiente", label: "Anticipo" },
  { valor: "fallido", label: "Fallido" },
  { valor: "reembolsado", label: "Reembolsado" },
];

const METODOS_PAGO = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta de crédito",
  transferencia: "Transferencia bancaria",
  pse: "PSE",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers de etiquetas y colores
───────────────────────────────────────────────────────────────────────────── */

const labelEstado = (v) =>
  ESTADOS_PEDIDO.find((e) => e.valor === v || e.label === v)?.label ?? v ?? "—";

const labelTipo = (v) =>
  ESTADOS_PAGO.find((e) => e.valor === v || e.label === v)?.label ?? v ?? "—";

const valorEstado = (v) =>
  ESTADOS_PEDIDO.find((e) => e.valor === v || e.label === v)?.valor ?? v ?? "";

const valorTipo = (v) =>
  ESTADOS_PAGO.find((e) => e.valor === v || e.label === v)?.valor ?? v ?? "";

const claseEstado = (v) => {
  const l = labelEstado(v).toLowerCase();
  if (["completado", "entregado"].includes(l))
    return "bg-accent-green/10 text-accent-green border-accent-green/20";
  if (["enviado", "confirmado"].includes(l))
    return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
  if (l === "procesando")
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (l === "cancelado") return "bg-red-500/10 text-red-400 border-red-500/20";
  return "bg-white/5 text-gray-300 border-white/5";
};

const claseTipo = (v) => {
  const l = labelTipo(v).toLowerCase();
  if (["contado", "pagado"].includes(l))
    return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
  if (["anticipo", "pendiente"].includes(l))
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (l === "fallido") return "bg-red-500/10 text-red-400 border-red-500/20";
  if (l === "reembolsado")
    return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  return "bg-white/5 text-gray-300 border-white/5";
};

const dotEstado = (v) => {
  const l = labelEstado(v).toLowerCase();
  if (["completado", "entregado"].includes(l)) return "bg-accent-green";
  if (["enviado", "confirmado"].includes(l)) return "bg-accent-blue";
  if (l === "procesando") return "bg-yellow-500";
  if (l === "cancelado") return "bg-red-400";
  return "bg-gray-500";
};

/* ─────────────────────────────────────────────────────────────────────────────
   Descarga CSV compatible con Excel (UTF-8 BOM)
───────────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────────
   Clases base reutilizables
───────────────────────────────────────────────────────────────────────────── */

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
  "bg-[#0d0d1a] border border-accent-blue/50 rounded text-[9px] text-white " +
  "px-2 py-0.5 focus:outline-none cursor-pointer";

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-componente: tarjeta de métrica
───────────────────────────────────────────────────────────────────────────── */

const MetricCard = ({ label, valor, sub, subColor = "text-gray-400" }) => (
  <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="font-poppins font-bold text-2xl text-white">{valor}</div>
    <div
      className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 ${subColor}`}
    >
      {sub}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-componente: campo de dato en el modal
───────────────────────────────────────────────────────────────────────────── */

const FilaDato = ({ label, valor, span2 = false }) =>
  valor ? (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">
        {label}
      </div>
      <div className="text-xs text-white">{valor}</div>
    </div>
  ) : null;

/* ─────────────────────────────────────────────────────────────────────────────
   Modal de detalle de pedido
───────────────────────────────────────────────────────────────────────────── */

const ModalDetallePedido = ({ pedidoId, onClose }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get(`/pedidos/${pedidoId}`)
      .then((r) => setPedido(r.data.pedido))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [pedidoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const numero = pedido
    ? `#${pedido._id.toString().slice(-4).toUpperCase()}`
    : "…";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header sticky */}
        <div className="sticky top-0 z-10 glass-panel flex items-center justify-between px-6 py-4 border-b border-white/5 rounded-t-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-poppins font-bold text-white">
              Pedido {numero}
            </span>
            {pedido && (
              <>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${claseEstado(pedido.estado)}`}
                >
                  {labelEstado(pedido.estado)}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${claseTipo(pedido.estadoPago)}`}
                >
                  {labelTipo(pedido.estadoPago)}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5">
          {/* Estado: cargando */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-accent-blue/30 border-t-accent-blue animate-spin" />
              <span className="text-xs text-gray-500">Cargando detalle…</span>
            </div>
          )}

          {/* Estado: error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
              <span className="text-3xl">⚠️</span>
              <span className="text-sm text-gray-300 font-semibold">
                No se pudo cargar el pedido
              </span>
              <span className="text-xs text-gray-500">
                Verifica tu conexión e intenta de nuevo.
              </span>
              <button
                onClick={cargar}
                className="mt-2 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-all uppercase tracking-wider"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Estado: datos listos */}
          {pedido && !loading && (
            <div className="flex flex-col gap-5">
              {/* Meta rápida */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FilaDato
                  label="Fecha del pedido"
                  valor={formatearFecha(pedido.createdAt)}
                />
                <FilaDato
                  label="Método de pago"
                  valor={METODOS_PAGO[pedido.metodoPago] ?? pedido.metodoPago}
                />
                <FilaDato
                  label="Entrega estimada"
                  valor={
                    pedido.fechaEstimadaEntrega
                      ? formatearFecha(pedido.fechaEstimadaEntrega)
                      : "—"
                  }
                />
                <FilaDato label="Tracking" valor={pedido.tracking ?? "—"} />
              </div>

              {/* ── Cliente ── */}
              <section>
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Cliente
                </div>
                <div className="bg-white/5 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-white/5">
                  <FilaDato
                    label="Nombre completo"
                    valor={
                      `${pedido.usuario?.nombre ?? ""} ${pedido.usuario?.apellido ?? ""}`.trim() ||
                      "—"
                    }
                  />
                  <FilaDato
                    label="Correo electrónico"
                    valor={pedido.usuario?.email ?? "—"}
                  />
                  <FilaDato
                    label="Teléfono de contacto"
                    valor={pedido.direccionEnvio?.telefono ?? "—"}
                  />
                </div>
              </section>

              {/* ── Dirección de envío ── */}
              <section>
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Dirección de envío
                </div>
                <div className="bg-white/5 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-white/5">
                  <FilaDato
                    label="Dirección"
                    valor={pedido.direccionEnvio?.direccion}
                  />
                  <FilaDato
                    label="Ciudad"
                    valor={pedido.direccionEnvio?.ciudad}
                  />
                  <FilaDato
                    label="Departamento"
                    valor={pedido.direccionEnvio?.departamento}
                  />
                  <FilaDato
                    label="Código postal"
                    valor={pedido.direccionEnvio?.codigoPostal}
                  />
                  {pedido.direccionEnvio?.notas && (
                    <FilaDato
                      label="Notas de envío"
                      valor={pedido.direccionEnvio.notas}
                      span2
                    />
                  )}
                </div>
              </section>

              {/* ── Productos ── */}
              <section>
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Productos ({pedido.items?.length ?? 0})
                </div>
                <div className="flex flex-col gap-2">
                  {pedido.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Portada */}
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                        {item.producto?.imagen ? (
                          <img
                            src={item.producto.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-base">📖</span>
                        )}
                      </div>

                      {/* Info del libro */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-xs truncate">
                          {item.nombre}
                        </div>
                        {item.producto?.autor && (
                          <div className="text-[10px] text-gray-400 truncate">
                            {item.producto.autor}
                          </div>
                        )}
                        {item.producto?.editorial && (
                          <div className="text-[10px] text-gray-500 truncate">
                            {item.producto.editorial}
                          </div>
                        )}
                      </div>

                      {/* Cantidad × precio */}
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-gray-400">
                          {item.cantidad} × ${item.precio?.toLocaleString()}
                          {item.descuento > 0 && (
                            <span className="ml-1 text-accent-green font-bold">
                              −{item.descuento}%
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-white text-xs mt-0.5">
                          ${item.subtotal?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Resumen de pago ── */}
              <section>
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Resumen de pago
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${pedido.subtotal?.toLocaleString()}</span>
                  </div>
                  {pedido.descuentoTotal > 0 && (
                    <div className="flex justify-between text-accent-green">
                      <span>Descuento aplicado</span>
                      <span>−${pedido.descuentoTotal?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>IVA (19%)</span>
                    <span>${pedido.iva?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Costo de envío</span>
                    <span>
                      {pedido.costoEnvio === 0 ? (
                        <span className="text-accent-green font-bold">
                          Gratis
                        </span>
                      ) : (
                        `$${pedido.costoEnvio?.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2 mt-1 text-sm">
                    <span>Total</span>
                    <span className="text-accent-green">
                      ${pedido.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>

              {/* ── Historial de estados ── */}
              {pedido.historial?.length > 0 && (
                <section>
                  <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Historial del pedido
                  </div>
                  <div className="relative pl-1">
                    {/* Línea vertical */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                    {[...pedido.historial].reverse().map((h, i) => (
                      <div key={i} className="flex items-start gap-3 py-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 border-[#0d1117] shrink-0 mt-0.5 z-10 ${dotEstado(h.estado)}`}
                        />
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-semibold text-white">
                              {labelEstado(h.estado)}
                            </span>
                            <span className="text-[9px] text-gray-500">
                              {formatearFecha(h.fecha)}
                            </span>
                          </div>
                          {h.comentario && (
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {h.comentario}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Notas del pedido ── */}
              {pedido.notas && (
                <section>
                  <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2">
                    Notas del pedido
                  </div>
                  <p className="text-xs text-gray-300 bg-white/5 rounded-xl p-4 border border-white/5 leading-relaxed">
                    {pedido.notas}
                  </p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Componente principal: VentasView
───────────────────────────────────────────────────────────────────────────── */

const VentasView = () => {
  /* ── State de datos ─────────────────────────────────────────────────────── */
  const [ventas, setVentas] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── State de filtros ───────────────────────────────────────────────────── */
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [ordenTotal, setOrdenTotal] = useState(null);

  /* ── State de edición inline ────────────────────────────────────────────── */
  const [editando, setEditando] = useState(null);
  const [actualizando, setActualizando] = useState(null);

  /* ── State del modal ────────────────────────────────────────────────────── */
  const [modalPedidoId, setModalPedidoId] = useState(null);

  /* ── Carga de datos ─────────────────────────────────────────────────────── */
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

  /* ── Filtrado y orden reactivo ──────────────────────────────────────────── */
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

  /* ── Actualizar estado del pedido ───────────────────────────────────────── */
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

  /* ── Actualizar estado de pago ──────────────────────────────────────────── */
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

  /* ── Renders de carga / error ───────────────────────────────────────────── */
  if (loading)
    return <p className="text-gray-400 text-sm">Cargando ventas...</p>;
  if (!ventas)
    return (
      <p className="text-gray-400 text-sm">No se pudieron cargar las ventas.</p>
    );

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="flex flex-col gap-5 text-white">
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Ventas hoy"
            valor={`$${ventas.ventasHoy.toLocaleString()}`}
            sub={`${ventas.pedidosHoy} pedidos`}
            subColor="text-accent-green"
          />
          <MetricCard
            label="Promedio por pedido"
            valor={`$${Math.round(ventas.promedioPedido / 1000)}K`}
            sub="Hoy"
          />
          <MetricCard
            label="Completados"
            valor={ventas.completadosMes}
            sub="Este mes"
          />
        </div>

        {/* Panel de tabla */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          {/* Barra superior */}
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
              {/* Filtro de fechas */}
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
                    title="Limpiar fechas"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Descargar Excel */}
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

          {/* Tabla */}
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
                      title="Ordenar por total"
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

                {/* Filtros por columna */}
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
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
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
                      className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                        actualizando === pedido.id
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                    >
                      {/* Cliente / Producto — clickeable para ver detalle */}
                      <td className="py-2.5">
                        <button
                          onClick={() => setModalPedidoId(pedido.id)}
                          className="text-left group w-full"
                          title="Ver detalle del pedido"
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

                      {/* Fecha */}
                      <td className="py-2.5 text-gray-300">
                        {formatearFecha(pedido.fecha)}
                      </td>

                      {/* Pago — badge editable */}
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
                            title="Clic para cambiar estado de pago"
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border transition-all hover:brightness-125 hover:ring-1 hover:ring-white/10 cursor-pointer ${claseTipo(pedido.tipo)}`}
                          >
                            {labelTipo(pedido.tipo)}
                          </button>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-2.5 text-right font-bold text-white">
                        ${pedido.total.toLocaleString()}
                      </td>

                      {/* Estado — badge editable */}
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
                            title="Clic para cambiar estado del pedido"
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

          {/* Footer de conteo */}
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

      {/* Modal — montado fuera del flujo de la tabla */}
      {modalPedidoId && (
        <ModalDetallePedido pedidoId={modalPedidoId} onClose={cerrarModal} />
      )}
    </>
  );
};

export default VentasView;
