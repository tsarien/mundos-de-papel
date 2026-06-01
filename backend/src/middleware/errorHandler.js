// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Error de Mongoose - ID inválido
  if (err.name === 'CastError') {
    const mensaje = 'Recurso no encontrado';
    error = { message: mensaje, statusCode: 404 };
  }

  // Error de Mongoose - Duplicate key
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    const mensaje = `El ${campo} ya existe`;
    error = { message: mensaje, statusCode: 400 };
  }

  // Error de Mongoose - Validation
  if (err.name === 'ValidationError') {
    const mensaje = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message: mensaje, statusCode: 400 };
  }

  // Error de JWT - Token inválido
  if (err.name === 'JsonWebTokenError') {
    const mensaje = 'Token inválido';
    error = { message: mensaje, statusCode: 401 };
  }

  // Error de JWT - Token expirado
  if (err.name === 'TokenExpiredError') {
    const mensaje = 'Token expirado';
    error = { message: mensaje, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    mensaje: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
