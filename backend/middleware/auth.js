import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

export const proteger = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new UnauthorizedError("No autorizado para acceder a esta ruta");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await User.findById(decoded.id);

      if (!req.usuario) {
        throw new UnauthorizedError("Usuario no encontrado");
      }

      if (!req.usuario.activo) {
        throw new ForbiddenError("Usuario inactivo");
      }

      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new UnauthorizedError("Token inválido");
      }
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedError("Token expirado");
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const autorizar = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return next(
        new ForbiddenError(
          `El rol '${req.usuario.rol}' no tiene permiso para acceder a esta ruta`,
        ),
      );
    }
    next();
  };
};
