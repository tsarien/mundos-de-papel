import Producto from "../models/Producto.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

const getInitials = (name) => {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
};

// @desc    Agregar una valoración a un producto
// @route   POST /api/productos/:id/valoraciones
export const agregarValoracion = async (req, res, next) => {
  try {
    const { puntuacion, comentario, nombre } = req.body;
    const producto = await Producto.findById(req.params.id);

    if (!producto) throw new NotFoundError("Producto");

    const yaValorado = producto.valoraciones.find(
      (val) => val.usuario && val.usuario.toString() === req.usuario.id,
    );

    if (yaValorado) {
      throw new BadRequestError("Ya has valorado este producto");
    }

    const nuevaValoracion = {
      usuario: req.usuario.id,
      nombre: nombre || `${req.usuario.nombre} ${req.usuario.apellido}`,
      initials: getInitials(
        nombre || `${req.usuario.nombre} ${req.usuario.apellido}`,
      ),
      puntuacion,
      comentario,
      helpful: 0,
      usuariosUtiles: [],
      verificada: true,
      fecha: new Date(),
    };

    producto.valoraciones.unshift(nuevaValoracion);
    producto.calcularPromedioValoracion();
    await producto.save();

    res.status(201).json({
      success: true,
      mensaje: "Valoración agregada exitosamente",
      valoracion: nuevaValoracion,
      producto: {
        promedioValoracion: producto.promedioValoracion,
        totalValoraciones: producto.totalValoraciones,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marcar valoración como útil
// @route   PUT /api/productos/:id/valoraciones/:valoracionId/util
export const marcarValoracionUtil = async (req, res, next) => {
  try {
    const { id, valoracionId } = req.params;
    const usuarioId = req.usuario.id;
    const producto = await Producto.findById(id);

    if (!producto) throw new NotFoundError("Producto");

    const valoracion = producto.valoraciones.id(valoracionId);
    if (!valoracion) throw new NotFoundError("Valoración");

    const indiceUsuario = valoracion.usuariosUtiles.indexOf(usuarioId);

    if (indiceUsuario > -1) {
      valoracion.usuariosUtiles.splice(indiceUsuario, 1);
      valoracion.helpful = Math.max(0, valoracion.helpful - 1);
    } else {
      valoracion.usuariosUtiles.push(usuarioId);
      valoracion.helpful += 1;
    }

    await producto.save();

    res.json({
      success: true,
      helpful: valoracion.helpful,
      userHelpful: indiceUsuario === -1,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener valoraciones de un producto
// @route   GET /api/productos/:id/valoraciones
export const obtenerValoraciones = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filtro } = req.query;
    const producto = await Producto.findById(id);

    if (!producto) throw new NotFoundError("Producto");

    let valoraciones = producto.valoraciones;

    if (filtro && filtro !== "0") {
      const puntuacion = parseInt(filtro);
      valoraciones = valoraciones.filter((v) => v.puntuacion === puntuacion);
    }

    const usuarioId = req.usuario?.id;
    const valoracionesConEstado = valoraciones.map((val) => ({
      id: val._id,
      nombre: val.nombre,
      initials: val.initials,
      puntuacion: val.puntuacion,
      fecha: val.fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      comentario: val.comentario,
      helpful: val.helpful,
      userHelpful: usuarioId ? val.usuariosUtiles.includes(usuarioId) : false,
      verificada: val.verificada,
    }));

    res.json({
      success: true,
      valoraciones: valoracionesConEstado,
      total: producto.totalValoraciones,
      promedio: producto.promedioValoracion,
    });
  } catch (error) {
    next(error);
  }
};
