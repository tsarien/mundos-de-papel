import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Proteger rutas
export const proteger = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en el header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar que el token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'No autorizado para acceder a esta ruta'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.usuario = await Usuario.findById(decoded.id);

      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          mensaje: 'Usuario no encontrado'
        });
      }

      if (!req.usuario.activo) {
        return res.status(403).json({
          success: false,
          mensaje: 'Usuario inactivo'
        });
      }

      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido o expirado'
      });
    }

  } catch (error) {
    console.error('Error en middleware proteger:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error en la autenticación'
    });
  }
};

// Autorización por roles
export const autorizar = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        mensaje: `El rol '${req.usuario.rol}' no tiene permiso para acceder a esta ruta`
      });
    }
    next();
  };
};
