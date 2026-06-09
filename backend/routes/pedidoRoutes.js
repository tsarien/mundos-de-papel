import express from "express";
import { body } from "express-validator";
import {
  crearPedido,
  obtenerMisPedidos,
  obtenerPedidoPorId,
  obtenerTodosPedidos,
  actualizarEstadoPedido,
  cancelarPedido,
  obtenerEstadisticas,
  actualizarEstadoPago,
} from "../controllers/pedidoController.js";
import { proteger, autorizar } from "../middleware/auth.js";
import { validarResultados } from "../middleware/validator.js";

const router = express.Router();

const validacionPedido = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("El pedido debe tener al menos un producto"),
  body("items.*.producto")
    .notEmpty()
    .withMessage("El ID del producto es requerido"),
  body("items.*.cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser mayor a 0"),
  body("direccionEnvio.direccion")
    .notEmpty()
    .withMessage("La dirección es requerida"),
  body("metodoPago")
    .isIn(["efectivo", "tarjeta", "transferencia", "pse"])
    .withMessage("Método de pago inválido"),
  validarResultados,
];

router.post("/", proteger, validacionPedido, crearPedido);
router.get("/mis-pedidos", proteger, obtenerMisPedidos);
router.get("/:id", proteger, obtenerPedidoPorId);
router.put("/:id/cancelar", proteger, cancelarPedido);

router.get("/", proteger, autorizar("admin"), obtenerTodosPedidos);
router.put("/:id/estado", proteger, autorizar("admin"), actualizarEstadoPedido);
router.get(
  "/estadisticas/general",
  proteger,
  autorizar("admin"),
  obtenerEstadisticas,
);
router.put(
  "/:id/estado-pago",
  proteger,
  autorizar("admin"),
  actualizarEstadoPago,
);

export default router;
