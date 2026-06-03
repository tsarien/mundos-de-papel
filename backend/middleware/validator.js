import { validationResult } from 'express-validator';

// Middleware para validar resultados
export const validarResultados = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  
  next();
};
