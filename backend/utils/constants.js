export const ROLES = {
  ADMIN: "admin",
  USER: "usuario",
};

export const ESTADOS_PEDIDO = {
  PROCESANDO: "procesando",
  CONFIRMADO: "confirmado",
  ENVIADO: "enviado",
  ENTREGADO: "entregado",
  CANCELADO: "cancelado",
};

export const ESTADOS_PAGO = {
  PENDIENTE: "pendiente",
  PAGADO: "pagado",
  FALLIDO: "fallido",
  REEMBOLSADO: "reembolsado",
};

export const METODOS_PAGO = ["efectivo", "tarjeta", "transferencia", "pse"];

export const TIPOS_ALERTA = {
  CRITICO: "critico",
  ADVERTENCIA: "advertencia",
  INFO: "info",
};

export const UMBRALES_POR_DEFECTO = {
  STOCK_BAJO: 5,
  STOCK_CRITICO: 2,
  ENVIO_GRATIS_DESDE: 100000,
  COSTO_ENVIO_DEFAULT: 10000,
  IVA: 19,
};

export const PAGINACION = {
  PRODUCTOS_POR_PAGINA: 12,
  PEDIDOS_POR_PAGINA: 20,
};
