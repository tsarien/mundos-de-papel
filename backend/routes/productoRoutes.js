import express from "express";
import upload from "../middleware/upload.js";
import { body } from "express-validator";
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
  subirImagenProducto,
} from "../controllers/productoController.js";
import {
  agregarValoracion,
  marcarValoracionUtil,
  obtenerValoraciones,
} from "../controllers/resenaController.js";
import { proteger, autorizar } from "../middleware/auth.js";
import { validarResultados } from "../middleware/validator.js";

const router = express.Router();

// Validaciones
const validacionProducto = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("descripcion").notEmpty().withMessage("La descripción es requerida"),
  body("precio").isNumeric().withMessage("El precio debe ser un número"),
  body("categoria")
    .notEmpty()
    .withMessage("La categoría es requerida")
    .isMongoId()
    .withMessage("Categoría inválida"),
  body("autor").notEmpty().withMessage("El autor es requerido"),
  body("editorial").notEmpty().withMessage("La editorial es requerida"),
  body("paginas")
    .isInt({ min: 1 })
    .withMessage("Las páginas deben ser un número mayor a 0"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número mayor o igual a 0"),
  validarResultados,
];

const validacionValoracion = [
  body("puntuacion")
    .isInt({ min: 1, max: 5 })
    .withMessage("La puntuación debe estar entre 1 y 5"),
  body("comentario").notEmpty().withMessage("El comentario es requerido"),
  validarResultados,
];

// Rutas públicas
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.get("/:id/valoraciones", obtenerValoraciones);

// Rutas protegidas - Usuario
router.post(
  "/:id/valoraciones",
  proteger,
  validacionValoracion,
  agregarValoracion,
);
router.put(
  "/:id/valoraciones/:valoracionId/util",
  proteger,
  marcarValoracionUtil,
);

// Rutas protegidas - Admin
router.post(
  "/",
  proteger,
  autorizar("admin"),
  validacionProducto,
  crearProducto,
);
router.put(
  "/:id/imagen",
  proteger,
  autorizar("admin"),
  upload.single("imagen"),
  subirImagenProducto,
);
router.put("/:id/stock", proteger, autorizar("admin"), actualizarStock);
router.put("/:id", proteger, autorizar("admin"), actualizarProducto);
router.delete("/:id", proteger, autorizar("admin"), eliminarProducto);

export default router;
