import express from "express";
import { proteger, autorizar } from "../middleware/auth.js";
import {
  obtenerResumen,
  obtenerMetricasVentas,
  obtenerInventario,
  obtenerClientes,
  obtenerPrecios,
  obtenerProveedores,
  obtenerAlertas,
  obtenerConfiguracion,
  actualizarConfiguracion,
  descargarBackup,
  restaurarBackup,
  crearReglaPrecio,
  actualizarReglaPrecio,
  actualizarEstadoRegla,
  eliminarReglaPrecio,
  obtenerDetalleCliente,
  actualizarCliente,
  actualizarEstadoCliente,
  eliminarCliente,
  obtenerDetalleProveedor,
  crearProveedor,
  actualizarProveedor,
  actualizarEstadoProveedor,
  eliminarProveedor,
  obtenerPedidosProveedor,
  crearPedidoProveedor,
  actualizarPedidoProveedor,
  actualizarEstadoPedidoProveedor,
  eliminarPedidoProveedor,
  marcarAlertaLeida,
  marcarTodasAlertasLeidas,
  eliminarAlerta,
} from "../controllers/adminController.js";

const router = express.Router();
const admin = [proteger, autorizar("admin")];

router.get("/resumen", ...admin, obtenerResumen);
router.get("/ventas", ...admin, obtenerMetricasVentas);
router.get("/inventario", ...admin, obtenerInventario);
router.get("/clientes", ...admin, obtenerClientes);
router.get("/precios", ...admin, obtenerPrecios);
router.get("/proveedores", ...admin, obtenerProveedores);
router.get("/alertas", ...admin, obtenerAlertas);
router.get("/configuracion", ...admin, obtenerConfiguracion);
router.put("/configuracion", ...admin, actualizarConfiguracion);
router.get("/backup", ...admin, descargarBackup);
router.post("/backup/restaurar", ...admin, restaurarBackup);
router.post("/precios", ...admin, crearReglaPrecio);
router.put("/precios/:id", ...admin, actualizarReglaPrecio);
router.patch("/precios/:id/estado", ...admin, actualizarEstadoRegla);
router.delete("/precios/:id", ...admin, eliminarReglaPrecio);
router.get("/clientes/:id", ...admin, obtenerDetalleCliente);
router.put("/clientes/:id", ...admin, actualizarCliente);
router.patch("/clientes/:id/estado", ...admin, actualizarEstadoCliente);
router.delete("/clientes/:id", ...admin, eliminarCliente);
router.post("/proveedores", ...admin, crearProveedor);
router.get("/proveedores/:id", ...admin, obtenerDetalleProveedor);
router.put("/proveedores/:id", ...admin, actualizarProveedor);
router.patch("/proveedores/:id/estado", ...admin, actualizarEstadoProveedor);
router.delete("/proveedores/:id", ...admin, eliminarProveedor);
router.get("/proveedores/:id/pedidos", ...admin, obtenerPedidosProveedor);
router.post("/proveedores/:id/pedidos", ...admin, crearPedidoProveedor);
router.put("/pedidos-proveedor/:id", ...admin, actualizarPedidoProveedor);
router.patch(
  "/pedidos-proveedor/:id/estado",
  ...admin,
  actualizarEstadoPedidoProveedor,
);
router.delete("/pedidos-proveedor/:id", ...admin, eliminarPedidoProveedor);

router.patch("/alertas/leer-todas", ...admin, marcarTodasAlertasLeidas);
router.patch("/alertas/:id/leer", ...admin, marcarAlertaLeida);
router.delete("/alertas/:id", ...admin, eliminarAlerta);

export default router;
