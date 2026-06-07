import { useState, useEffect, useCallback } from "react";
import { formatearFecha } from "../../../utils/formatters.js";
import api from "../../../services/api.js";
import {
  ESTADOS_PEDIDO,
  ESTADOS_PAGO,
  METODOS_PAGO,
  claseEstado,
  claseTipo,
  dotEstado,
  labelEstado,
  labelTipo,
} from "../../../utils/constants.js";

const FilaDato = ({ label, valor, span2 = false }) =>
  valor ? (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">
        {label}
      </div>
      <div className="text-xs text-white">{valor}</div>
    </div>
  ) : null;

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

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header sticky ── */}
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

        {/* ── Cuerpo ── */}
        <div className="px-6 py-5">
          {/* Cargando */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-accent-blue/30 border-t-accent-blue animate-spin" />
              <span className="text-xs text-gray-500">Cargando detalle…</span>
            </div>
          )}

          {/* Error */}
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

          {/* Datos */}
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
              <Section
                title="Cliente"
                icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              </Section>

              {/* ── Dirección de envío ── */}
              <Section
                title="Dirección de envío"
                icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </Section>

              {/* ── Productos ── */}
              <Section
                title={`Productos (${pedido.items?.length ?? 0})`}
                icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              >
                <div className="flex flex-col gap-2">
                  {pedido.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors"
                    >
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
              </Section>

              {/* ── Resumen de pago ── */}
              <Section
                title="Resumen de pago"
                icon="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              >
                <div className="flex flex-col gap-2 text-xs">
                  <FilaTotal
                    label="Subtotal"
                    valor={`$${pedido.subtotal?.toLocaleString()}`}
                  />
                  {pedido.descuentoTotal > 0 && (
                    <FilaTotal
                      label="Descuento aplicado"
                      valor={`−$${pedido.descuentoTotal?.toLocaleString()}`}
                      className="text-accent-green"
                    />
                  )}
                  <FilaTotal
                    label="IVA (19%)"
                    valor={`$${pedido.iva?.toLocaleString()}`}
                  />
                  <FilaTotal
                    label="Costo de envío"
                    valor={
                      pedido.costoEnvio === 0 ? (
                        <span className="text-accent-green font-bold">
                          Gratis
                        </span>
                      ) : (
                        `$${pedido.costoEnvio?.toLocaleString()}`
                      )
                    }
                  />
                  <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2 mt-1 text-sm">
                    <span>Total</span>
                    <span className="text-accent-green">
                      ${pedido.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Section>

              {/* ── Historial ── */}
              {pedido.historial?.length > 0 && (
                <Section
                  title="Historial del pedido"
                  icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                >
                  <div className="relative pl-1">
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
                </Section>
              )}

              {/* ── Notas ── */}
              {pedido.notas && (
                <Section title="Notas del pedido">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {pedido.notas}
                  </p>
                </Section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <section>
    <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
      {icon && (
        <svg
          className="w-3 h-3 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={icon}
          />
        </svg>
      )}
      {title}
    </div>
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      {children}
    </div>
  </section>
);

const FilaTotal = ({ label, valor, className = "text-gray-300" }) => (
  <div className={`flex justify-between ${className}`}>
    <span>{label}</span>
    <span>{valor}</span>
  </div>
);

export default ModalDetallePedido;
