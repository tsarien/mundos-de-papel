import Categoria from "../models/Categoria.js";

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ activo: true });
    res.status(200).json({
      success: true,
      categorias,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener categorías",
      error: error.message,
    });
  }
};

// Obtener una categoría por ID
export const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        mensaje: "Categoría no encontrada",
      });
    }
    res.status(200).json({
      success: true,
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener categoría",
      error: error.message,
    });
  }
};

// Crear nueva categoría (solo admin)
export const crearCategoria = async (req, res) => {
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
      return res.status(400).json({
        success: false,
        mensaje: "La categoría ya existe",
      });
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
    res.status(500).json({
      success: false,
      mensaje: "Error al crear categoría",
      error: error.message,
    });
  }
};

// Actualizar categoría (solo admin)
export const actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, icono, activo } = req.body;

    let categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        mensaje: "Categoría no encontrada",
      });
    }

    // Verificar si el nuevo nombre ya existe
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
    res.status(500).json({
      success: false,
      mensaje: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

// Eliminar categoría (solo admin)
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        mensaje: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      mensaje: "Categoría eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al eliminar categoría",
      error: error.message,
    });
  }
};
