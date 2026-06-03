export const ROLES = { ADMIN: "admin", USER: "usuario" };
export const ESTADOS_PEDIDO = {
  ENTREGADO: "entregado",
  PROCESANDO: "procesando",
  CONFIRMADO: "confirmado",
  ENVIADO: "enviado",
  CANCELADO: "cancelado",
};
export const METODOS_PAGO = ["efectivo", "tarjeta", "transferencia", "pse"];
export const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-yellow-100", text: "text-yellow-700" },
  { bg: "bg-red-100", text: "text-red-700" },
];
export const PRECIO_ENVIO_GRATIS = 100000;
export const IVA = 0.19;
export const STOCK_BAJO_UMBRAL = 5;
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
