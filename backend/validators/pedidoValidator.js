import { body } from "express-validator";
import { validarResultados } from "../middleware/validator.js";
import { METODOS_PAGO } from "../utils/constants.js";

export const validarCrearPedido = [
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
  body("metodoPago").isIn(METODOS_PAGO).withMessage("Método de pago inválido"),
  validarResultados,
];
