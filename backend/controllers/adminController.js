import { obtenerConfiguracion as obtenerConfiguracionService } from "../services/configService.js";
import {
  obtenerMetricasDashboard,
  obtenerMetricasVentas as obtenerMetricasVentasService,
  obtenerDatosInventario,
  obtenerDatosClientes,
  obtenerDatosPrecios,
  obtenerAlertasConResumen,
  generarDatosBackup,
  restaurarDatosBackup,
} from "../services/adminService.js";
import Proveedor from "../models/Proveedor.js";

export const obtenerResumen = async (req, res, next) => {
  try {
    const config = await obtenerConfiguracionService();
    const umbralBajo = config.inventario.umbralStockBajo;
    const resumen = await obtenerMetricasDashboard(umbralBajo);
    res.json({ success: true, resumen });
  } catch (error) {
    next(error);
  }
};

export const obtenerMetricasVentas = async (req, res, next) => {
  try {
    const ventas = await obtenerMetricasVentasService();
    res.json({ success: true, ventas });
  } catch (error) {
    next(error);
  }
};

export const obtenerInventario = async (req, res, next) => {
  try {
    const config = await obtenerConfiguracionService();
    const umbralBajo = config.inventario.umbralStockBajo;
    const inventario = await obtenerDatosInventario(umbralBajo);
    res.json({ success: true, inventario });
  } catch (error) {
    next(error);
  }
};

export const obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await obtenerDatosClientes();
    res.json({ success: true, clientes });
  } catch (error) {
    next(error);
  }
};

export const obtenerPrecios = async (req, res, next) => {
  try {
    const precios = await obtenerDatosPrecios();
    res.json({ success: true, precios });
  } catch (error) {
    next(error);
  }
};

export const obtenerProveedores = async (req, res, next) => {
  try {
    const proveedores = await Proveedor.find().sort("nombre");
    res.json({ success: true, proveedores });
  } catch (error) {
    next(error);
  }
};

export const obtenerAlertas = async (req, res, next) => {
  try {
    const { alertas, resumen } = await obtenerAlertasConResumen();
    res.json({ success: true, alertas, resumen });
  } catch (error) {
    next(error);
  }
};

export const obtenerConfiguracion = async (req, res, next) => {
  try {
    const configuracion = await obtenerConfiguracionService();
    res.json({ success: true, configuracion });
  } catch (error) {
    next(error);
  }
};

export const descargarBackup = async (req, res, next) => {
  try {
    const backup = await generarDatosBackup();

    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const filename = `backup-mundos-de-papel-${timestamp}.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.send(JSON.stringify(backup, null, 2));
  } catch (error) {
    next(error);
  }
};

export const restaurarBackup = async (req, res, next) => {
  try {
    const backup = req.body;

    if (!backup || Object.keys(backup).length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: "No se recibió ningún archivo de backup",
      });
    }

    const resumen = await restaurarDatosBackup(backup);

    res.json({
      success: true,
      mensaje: "Base de datos restaurada exitosamente",
      resumen,
    });
  } catch (error) {
    if (
      error.message.includes("backup") ||
      error.message.includes("colección")
    ) {
      return res.status(400).json({ success: false, mensaje: error.message });
    }
    next(error);
  }
};
