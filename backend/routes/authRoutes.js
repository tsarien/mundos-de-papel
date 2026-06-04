import express from "express";
import { body } from "express-validator";
import {
  registro,
  login,
  obtenerUsuarioActual,
  actualizarPerfil,
  cambiarPassword,
} from "../controllers/authController.js";
import { proteger } from "../middleware/auth.js";
import { validarResultados } from "../middleware/validator.js";

const router = express.Router();

const validacionRegistro = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  validarResultados,
];

const validacionLogin = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  validarResultados,
];

router.post("/registro", validacionRegistro, registro);
router.post("/login", validacionLogin, login);

router.get("/me", proteger, obtenerUsuarioActual);
router.put("/perfil", proteger, actualizarPerfil);
router.put("/cambiar-password", proteger, cambiarPassword);

export default router;
