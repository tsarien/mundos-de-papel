import Categoria from "../models/Categoria.js";
import { NotFoundError } from "../utils/errors.js";

export const obtenerCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.find({ activo: true });
    res.status(200).json({ success: true, categorias });
  } catch (error) {
    next(error);
  }
};

export const obtenerCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) throw new NotFoundError("Categoría");
    res.status(200).json({ success: true, categoria });
  } catch (error) {
    next(error);
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const { nombre, descripcion, icono } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: "El nombre de la categoría es requerido",
      });
    }

    const categoriaExistente = await Categoria.findOne({ nombre });
    if (categoriaExistente) {
      return res
        .status(400)
        .json({ success: false, mensaje: "La categoría ya existe" });
    }

    const categoria = await Categoria.create({
      nombre,
      descripcion,
      icono: icono || "ti-book",
    });
    res.status(201).json({
      success: true,
      mensaje: "Categoría creada exitosamente",
      categoria,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    const { nombre, descripcion, icono, activo } = req.body;
    let categoria = await Categoria.findById(req.params.id);

    if (!categoria) throw new NotFoundError("Categoría");

    if (nombre && nombre !== categoria.nombre) {
      const categoriaExistente = await Categoria.findOne({ nombre });
      if (categoriaExistente) {
        return res.status(400).json({
          success: false,
          mensaje: "El nombre de la categoría ya existe",
        });
      }
    }

    categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, icono, activo },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      mensaje: "Categoría actualizada exitosamente",
      categoria,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) throw new NotFoundError("Categoría");
    res
      .status(200)
      .json({ success: true, mensaje: "Categoría eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
};
