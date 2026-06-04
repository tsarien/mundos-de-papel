import { AppError } from "../utils/errors.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      mensaje: err.message,
    });
  }

  if (err.name === "CastError") {
    error = { message: "Recurso no encontrado", statusCode: 404 };
  }

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    error = { message: `El ${campo} ya existe`, statusCode: 400 };
  }

  if (err.name === "ValidationError") {
    const mensaje = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message: mensaje, statusCode: 400 };
  }

  if (err.name === "JsonWebTokenError") {
    error = { message: "Token inválido", statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    error = { message: "Token expirado", statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    mensaje: error.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
