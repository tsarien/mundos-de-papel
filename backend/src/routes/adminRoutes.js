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

export default router;
