import express from "express";
import { body } from "express-validator";
import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriaController.js";
import { proteger, autorizar } from "../middleware/auth.js";
import { validarResultados } from "../middleware/validator.js";

const router = express.Router();

// Validaciones
const validacionCategoria = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),
  validarResultados,
];

// Rutas públicas
router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoria);

// Rutas protegidas (solo admin)
router.post(
  "/",
  proteger,
  autorizar("admin"),
  validacionCategoria,
  crearCategoria,
);
router.put(
  "/:id",
  proteger,
  autorizar("admin"),
  validacionCategoria,
  actualizarCategoria,
);
router.delete("/:id", proteger, autorizar("admin"), eliminarCategoria);

export default router;
