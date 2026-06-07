import { useState, useEffect, useCallback } from "react";
import { obtenerPedidoPorId } from "../../services/pedidoService";
import { formatearFecha, formatearMoneda } from "../../utils/formatters";
import {
  labelEstado,
  labelTipo,
  claseEstado,
  claseTipo,
  dotEstado,
} from "../../utils/constants";
import { toast } from "sonner";

const ModalDetallePedidoCliente = ({ pedidoId, onClose }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await obtenerPedidoPorId(pedidoId);
      setPedido(data.pedido);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const numeroPedido = pedido
    ? `#${pedido._id.toString().slice(-6).toUpperCase()}`
    : "…";

  const handleContactarSoporte = () => {
    toast.info("Contactar con soporte", {
      description:
        "Próximamente disponible. Por ahora escríbenos a soporte@mundosdepapel.com",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass-panel flex items-center justify-between px-6 py-4 border-b border-white/5 rounded-t-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-poppins font-bold text-white text-lg">
              Pedido {numeroPedido}
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
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-accent-blue/30 border-t-accent-blue animate-spin" />
              <span className="text-xs text-gray-500">
                Cargando detalle del pedido…
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
              <span className="text-3xl">⚠️</span>
              <span className="text-sm text-gray-300 font-semibold">
                No se pudo cargar el pedido
              </span>
              <button
                onClick={cargar}
                className="mt-2 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-all"
              >
                Reintentar
              </button>
            </div>
          )}

          {pedido && !loading && (
            <div className="flex flex-col gap-5">
              {/* Datos rápidos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    Fecha del pedido
                  </div>
                  <div className="text-sm text-white">
                    {formatearFecha(pedido.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    Método de pago
                  </div>
                  <div className="text-sm text-white">{pedido.metodoPago}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    Entrega estimada
                  </div>
                  <div className="text-sm text-white">
                    {pedido.fechaEstimadaEntrega
                      ? formatearFecha(pedido.fechaEstimadaEntrega)
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    Tracking
                  </div>
                  <div className="text-sm text-white">
                    {pedido.tracking || "—"}
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Dirección de envío
                </div>
                <div className="text-sm text-white">
                  {pedido.direccionEnvio?.direccion}
                  <br />
                  {pedido.direccionEnvio?.ciudad &&
                    `${pedido.direccionEnvio.ciudad}, `}
                  {pedido.direccionEnvio?.departamento || ""}
                  <br />
                  {pedido.direccionEnvio?.codigoPostal &&
                    `CP: ${pedido.direccionEnvio.codigoPostal}`}
                  <br />
                  Tel: {pedido.direccionEnvio?.telefono || "—"}
                  {pedido.direccionEnvio?.notas && (
                    <span className="block text-xs text-gray-400 mt-1">
                      Nota: {pedido.direccionEnvio.notas}
                    </span>
                  )}
                </div>
              </div>

              {/* Productos */}
              <div>
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                  Productos ({pedido.items?.length || 0})
                </div>
                <div className="flex flex-col gap-2">
                  {pedido.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
                    >
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                        {item.producto?.imagen ? (
                          <img
                            src={item.producto.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base">📖</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm truncate">
                          {item.nombre}
                        </div>
                        {item.producto?.autor && (
                          <div className="text-[10px] text-gray-400">
                            {item.producto.autor}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-gray-400">
                          {item.cantidad} × ${item.precio?.toLocaleString()}
                        </div>
                        <div className="font-bold text-white text-sm">
                          ${item.subtotal?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de pago */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${pedido.subtotal?.toLocaleString()}</span>
                  </div>
                  {pedido.descuentoTotal > 0 && (
                    <div className="flex justify-between text-accent-green">
                      <span>Descuento</span>
                      <span>-${pedido.descuentoTotal?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>IVA (19%)</span>
                    <span>${pedido.iva?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {pedido.costoEnvio === 0
                        ? "Gratis"
                        : `$${pedido.costoEnvio?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2 mt-1 text-base">
                    <span>Total</span>
                    <span className="text-accent-green">
                      ${pedido.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Historial */}
              {pedido.historial?.length > 0 && (
                <div>
                  <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                    {[...pedido.historial].reverse().map((h, i) => (
                      <div key={i} className="flex items-start gap-3 py-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 border-[#0d1117] shrink-0 mt-0.5 z-10 ${dotEstado(h.estado)}`}
                        />
                        <div className="flex-1">
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
                </div>
              )}

              {pedido.notas && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-accent-blue font-bold uppercase tracking-wider mb-1">
                    Notas adicionales
                  </div>
                  <p className="text-sm text-gray-300">{pedido.notas}</p>
                </div>
              )}

              {/* Botón contacto soporte */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleContactarSoporte}
                  className="flex items-center gap-2 text-sm font-semibold py-2 px-5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/40 hover:bg-accent-purple/30 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636L16.95 7.05m0 0a7 7 0 11-9.9 9.9 7 7 0 019.9-9.9zM12 12h.01M9 9h.01M15 15h.01"
                    />
                  </svg>
                  Contactar con soporte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetallePedidoCliente;
