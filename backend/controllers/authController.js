import jwt from "jsonwebtoken";
import Usuario from "../models/User.js";
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from "../utils/errors.js";

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const registro = async (req, res, next) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion,
      cedula,
      fechaNacimiento,
    } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      throw new ConflictError("El email ya está registrado");
    }

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion,
      cedula,
      fechaNacimiento,
    });

    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      usuario: usuario.obtenerDatosPublicos(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new UnauthorizedError("Por favor proporciona email y contraseña");
    }

    const usuario = await Usuario.findOne({ email }).select("+password");

    if (!usuario) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const passwordCorrecta = await usuario.compararPassword(password);

    if (!passwordCorrecta) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    if (!usuario.activo) {
      throw new UnauthorizedError("Usuario inactivo");
    }

    const token = generarToken(usuario._id);

    res.json({
      success: true,
      token,
      usuario: usuario.obtenerDatosPublicos(),
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario actual - GET /api/auth/me
export const obtenerUsuarioActual = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      throw new NotFoundError("Usuario");
    }
    res.json({ success: true, usuario: usuario.obtenerDatosPublicos() });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil de usuario - PUT /api/auth/perfil
export const actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      throw new NotFoundError("Usuario");
    }

    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (telefono) usuario.telefono = telefono;
    if (direccion) usuario.direccion = direccion;

    await usuario.save();

    res.json({ success: true, usuario: usuario.obtenerDatosPublicos() });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña - PUT /api/auth/cambiar-password
export const cambiarPassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      throw new UnauthorizedError(
        "Por favor proporciona la contraseña actual y la nueva",
      );
    }

    const usuario = await Usuario.findById(req.usuario.id).select("+password");

    const passwordCorrecta = await usuario.compararPassword(passwordActual);

    if (!passwordCorrecta) {
      return res.status(400).json({
        success: false,
        mensaje: "Contraseña actual incorrecta",
      });
    }

    usuario.password = passwordNueva;
    await usuario.save();

    res.json({ success: true, mensaje: "Contraseña actualizada exitosamente" });
  } catch (error) {
    next(error);
  }
};
