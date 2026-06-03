import Configuracion from "../models/Configuracion.js";
import { UMBRALES_POR_DEFECTO } from "../utils/constants.js";

let configCache = null;
let cacheExpiration = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene la configuración general del sistema con caché
 * @param {boolean} forceRefresh - Forzar refresco del caché
 * @returns {Promise<object>} Configuración
 */
export const obtenerConfiguracion = async (forceRefresh = false) => {
  if (!forceRefresh && configCache && cacheExpiration > Date.now()) {
    return configCache;
  }

  let config = await Configuracion.findOne({ clave: "general" });
  if (!config) {
    config = await Configuracion.create({});
  }

  configCache = config;
  cacheExpiration = Date.now() + CACHE_TTL;
  return config;
};

/**
 * Limpia el caché de configuración
 */
export const limpiarCacheConfig = () => {
  configCache = null;
  cacheExpiration = null;
};

/**
 * Obtiene umbrales de stock de la configuración
 * @returns {Promise<object>} Umbrales
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
 * Obtiene configuración de envíos
 * @returns {Promise<object>} Configuración de envíos
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
