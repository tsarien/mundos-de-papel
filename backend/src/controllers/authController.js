import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/registro
// @access  Public
export const registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, direccion, cedula, fechaNacimiento } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion,
      cedula,
      fechaNacimiento
    });

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      usuario: usuario.obtenerDatosPublicos()
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Por favor proporciona email y contraseña'
      });
    }

    // Buscar usuario con contraseña
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordCorrecta = await usuario.compararPassword(password);
    
    if (!passwordCorrecta) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        mensaje: 'Usuario inactivo'
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.json({
      success: true,
      token,
      usuario: usuario.obtenerDatosPublicos()
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    res.json({
      success: true,
      usuario: usuario.obtenerDatosPublicos()
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener información del usuario',
      error: error.message
    });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/perfil
// @access  Private
export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;

    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (telefono) usuario.telefono = telefono;
    if (direccion) usuario.direccion = direccion;

    await usuario.save();

    res.json({
      success: true,
      usuario: usuario.obtenerDatosPublicos()
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/cambiar-password
// @access  Private
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        success: false,
        mensaje: 'Por favor proporciona la contraseña actual y la nueva'
      });
    }

    const usuario = await Usuario.findById(req.usuario.id).select('+password');

    // Verificar contraseña actual
    const passwordCorrecta = await usuario.compararPassword(passwordActual);
    
    if (!passwordCorrecta) {
      return res.status(401).json({
        success: false,
        mensaje: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    usuario.password = passwordNueva;
    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};
