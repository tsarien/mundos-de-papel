import express from "express";
import {
  obtenerResumen,
  obtenerMetricasVentas,
  obtenerInventario,
  obtenerClientes,
  obtenerPrecios,
  obtenerProveedores,
  obtenerAlertas,
  obtenerConfiguracion,
  descargarBackup,
  restaurarBackup,
  crearReglaPrecio,
  actualizarReglaPrecio,
  actualizarEstadoRegla,
  obtenerDetalleCliente,
  actualizarCliente,
  actualizarEstadoCliente,
  eliminarCliente,
  eliminarReglaPrecio,
} from "../controllers/adminController.js";
import { proteger, autorizar } from "../middleware/auth.js";

const router = express.Router();

router.use(proteger, autorizar("admin"));

router.get("/resumen", obtenerResumen);
router.get("/ventas", obtenerMetricasVentas);
router.get("/inventario", obtenerInventario);
router.get("/clientes", obtenerClientes);
router.get("/precios", obtenerPrecios);
router.get("/proveedores", obtenerProveedores);
router.get("/alertas", obtenerAlertas);
router.get("/configuracion", obtenerConfiguracion);
router.get("/backup", descargarBackup);
router.post("/backup/restaurar", restaurarBackup);
router.post("/precios", proteger, autorizar("admin"), crearReglaPrecio);
router.put("/precios/:id", proteger, autorizar("admin"), actualizarReglaPrecio);
router.patch(
  "/precios/:id/estado",
  proteger,
  autorizar("admin"),
  actualizarEstadoRegla,
);
router.get(
  "/clientes/:id",
  proteger,
  autorizar("admin"),
  obtenerDetalleCliente,
);
router.put("/clientes/:id", proteger, autorizar("admin"), actualizarCliente);
router.patch(
  "/clientes/:id/estado",
  proteger,
  autorizar("admin"),
  actualizarEstadoCliente,
);
router.delete("/clientes/:id", proteger, autorizar("admin"), eliminarCliente);
router.delete("/precios/:id", eliminarReglaPrecio);

export default router;
