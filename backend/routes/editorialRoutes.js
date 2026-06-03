import express from "express";
import { body } from "express-validator";
import {
  obtenerEditoriales,
  obtenerEditorial,
  crearEditorial,
  actualizarEditorial,
  eliminarEditorial,
} from "../controllers/editorialController.js";
import { proteger, autorizar } from "../middleware/auth.js";
import { validarResultados } from "../middleware/validator.js";

const router = express.Router();

// Validaciones
const validacionEditorial = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("sitioWeb").optional().isURL().withMessage("URL inválida"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("descripcion")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder 1000 caracteres"),
  validarResultados,
];

// Rutas públicas
router.get("/", obtenerEditoriales);
router.get("/:id", obtenerEditorial);

// Rutas protegidas (solo admin)
router.post(
  "/",
  proteger,
  autorizar("admin"),
  validacionEditorial,
  crearEditorial,
);
router.put(
  "/:id",
  proteger,
  autorizar("admin"),
  validacionEditorial,
  actualizarEditorial,
);
router.delete("/:id", proteger, autorizar("admin"), eliminarEditorial);

export default router;
