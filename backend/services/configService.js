import Configuration from "../models/Configuration.js";
import { UMBRALES_POR_DEFECTO } from "../utils/constants.js";

let configCache = null;
let cacheExpiration = null;
const CACHE_TTL = 5 * 60 * 1000;

/**
 * @param {boolean} forceRefresh
 * @returns {Promise<object>}
 */
export const obtenerConfiguracion = async (forceRefresh = false) => {
  if (!forceRefresh && configCache && cacheExpiration > Date.now()) {
    return configCache;
  }

  let config = await Configuration.findOne({ clave: "general" });
  if (!config) {
    config = await Configuration.create({});
  }

  configCache = config;
  cacheExpiration = Date.now() + CACHE_TTL;
  return config;
};

export const limpiarCacheConfig = () => {
  configCache = null;
  cacheExpiration = null;
};

/**
 * @returns {Promise<object>}
 */
export const obtenerUmbralesStock = async () => {
  const config = await obtenerConfiguracion();
  return {
    bajo: config.inventario.umbralStockBajo || UMBRALES_POR_DEFECTO.STOCK_BAJO,
    critico:
      config.inventario.umbralStockCritico ||
      UMBRALES_POR_DEFECTO.STOCK_CRITICO,
  };
};

/**
 * @returns {Promise<object>}
 */
export const obtenerConfigEnvio = async () => {
  const config = await obtenerConfiguracion();
  return {
    envioGratisDesde:
      config.pedidos.envioGratisDesde ||
      UMBRALES_POR_DEFECTO.ENVIO_GRATIS_DESDE,
    costoEnvio:
      config.pedidos.costoEnvio || UMBRALES_POR_DEFECTO.COSTO_ENVIO_DEFAULT,
    iva: config.pedidos.iva || UMBRALES_POR_DEFECTO.IVA,
  };
};
