import Editorial from "../models/Editorial.js";
import { NotFoundError } from "../utils/errors.js";

export const obtenerEditoriales = async (req, res, next) => {
  try {
    const editoriales = await Editorial.find({ activo: true });
    res.status(200).json({ success: true, editoriales });
  } catch (error) {
    next(error);
  }
};

export const obtenerEditorial = async (req, res, next) => {
  try {
    const editorial = await Editorial.findById(req.params.id);
    if (!editorial) throw new NotFoundError("Editorial");
    res.status(200).json({ success: true, editorial });
  } catch (error) {
    next(error);
  }
};

export const crearEditorial = async (req, res, next) => {
  try {
    const { nombre, sitioWeb, email, telefono, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: "El nombre de la editorial es requerido",
      });
    }

    const editorialExistente = await Editorial.findOne({ nombre });
    if (editorialExistente) {
      return res
        .status(400)
        .json({ success: false, mensaje: "La editorial ya existe" });
    }

    const editorial = await Editorial.create({
      nombre,
      sitioWeb,
      email,
      telefono,
      descripcion,
    });
    res.status(201).json({
      success: true,
      mensaje: "Editorial creada exitosamente",
      editorial,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarEditorial = async (req, res, next) => {
  try {
    const { nombre, sitioWeb, email, telefono, descripcion, activo } = req.body;
    let editorial = await Editorial.findById(req.params.id);

    if (!editorial) throw new NotFoundError("Editorial");

    if (nombre && nombre !== editorial.nombre) {
      const editorialExistente = await Editorial.findOne({ nombre });
      if (editorialExistente) {
        return res.status(400).json({
          success: false,
          mensaje: "El nombre de la editorial ya existe",
        });
      }
    }

    editorial = await Editorial.findByIdAndUpdate(
      req.params.id,
      { nombre, sitioWeb, email, telefono, descripcion, activo },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      mensaje: "Editorial actualizada exitosamente",
      editorial,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarEditorial = async (req, res, next) => {
  try {
    const editorial = await Editorial.findByIdAndDelete(req.params.id);
    if (!editorial) throw new NotFoundError("Editorial");
    res
      .status(200)
      .json({ success: true, mensaje: "Editorial eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
};
