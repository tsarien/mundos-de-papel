import Producto from '../models/Producto.js';

// @desc    Agregar una valoración a un producto
// @route   POST /api/productos/:id/valoraciones
// @access  Privado
export const agregarValoracion = async (req, res, next) => {
  try {
    const { puntuacion, comentario, nombre } = req.body;
    const productoId = req.params.id;

    // Buscar el producto
    const producto = await Producto.findById(productoId);

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    // Verificar si el usuario ya valoró este producto
    const yaValorado = producto.valoraciones.find(
      val => val.usuario && val.usuario.toString() === req.usuario.id
    );

    if (yaValorado) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya has valorado este producto'
      });
    }

    // Función para obtener iniciales
    const getInitials = (name) => {
      return name
        .trim()
        .split(' ')
        .map(w => w[0]?.toUpperCase() || '')
        .slice(0, 2)
        .join('');
    };

    // Crear nueva valoración
    const nuevaValoracion = {
      usuario: req.usuario.id,
      nombre: nombre || `${req.usuario.nombre} ${req.usuario.apellido}`,
      initials: getInitials(nombre || `${req.usuario.nombre} ${req.usuario.apellido}`),
      puntuacion,
      comentario,
      helpful: 0,
      usuariosUtiles: [],
      verificada: true, // Verificada porque el usuario está logueado
      fecha: new Date()
    };

    producto.valoraciones.unshift(nuevaValoracion);

    // Recalcular promedio
    producto.calcularPromedioValoracion();

    await producto.save();

    res.status(201).json({
      success: true,
      mensaje: 'Valoración agregada exitosamente',
      valoracion: nuevaValoracion,
      producto: {
        promedioValoracion: producto.promedioValoracion,
        totalValoraciones: producto.totalValoraciones
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marcar valoración como útil
// @route   PUT /api/productos/:id/valoraciones/:valoracionId/util
// @access  Privado
export const marcarValoracionUtil = async (req, res, next) => {
  try {
    const { id, valoracionId } = req.params;
    const usuarioId = req.usuario.id;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    const valoracion = producto.valoraciones.id(valoracionId);

    if (!valoracion) {
      return res.status(404).json({
        success: false,
        mensaje: 'Valoración no encontrada'
      });
    }

    // Verificar si el usuario ya marcó como útil
    const indiceUsuario = valoracion.usuariosUtiles.indexOf(usuarioId);

    if (indiceUsuario > -1) {
      // Ya marcó como útil, entonces quitar
      valoracion.usuariosUtiles.splice(indiceUsuario, 1);
      valoracion.helpful = Math.max(0, valoracion.helpful - 1);
    } else {
      // No ha marcado, agregar
      valoracion.usuariosUtiles.push(usuarioId);
      valoracion.helpful += 1;
    }

    await producto.save();

    res.json({
      success: true,
      helpful: valoracion.helpful,
      userHelpful: indiceUsuario === -1
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener valoraciones de un producto
// @route   GET /api/productos/:id/valoraciones
// @access  Público
export const obtenerValoraciones = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filtro } = req.query; // filtro por puntuación

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    let valoraciones = producto.valoraciones;

    // Filtrar por puntuación si se especifica
    if (filtro && filtro !== '0') {
      const puntuacion = parseInt(filtro);
      valoraciones = valoraciones.filter(v => v.puntuacion === puntuacion);
    }

    // Si hay usuario autenticado, marcar cuáles ha marcado como útiles
    const usuarioId = req.usuario?.id;
    const valoracionesConEstado = valoraciones.map(val => ({
      id: val._id,
      nombre: val.nombre,
      initials: val.initials,
      puntuacion: val.puntuacion,
      fecha: val.fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      comentario: val.comentario,
      helpful: val.helpful,
      userHelpful: usuarioId ? val.usuariosUtiles.includes(usuarioId) : false,
      verificada: val.verificada
    }));

    res.json({
      success: true,
      valoraciones: valoracionesConEstado,
      total: producto.totalValoraciones,
      promedio: producto.promedioValoracion
    });
  } catch (error) {
    next(error);
  }
};
