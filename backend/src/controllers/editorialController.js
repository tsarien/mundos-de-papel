import Editorial from "../models/Editorial.js";

// Obtener todas las editoriales
export const obtenerEditoriales = async (req, res) => {
  try {
    const editoriales = await Editorial.find({ activo: true });
    res.status(200).json({
      success: true,
      editoriales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener editoriales",
      error: error.message,
    });
  }
};

// Obtener una editorial por ID
export const obtenerEditorial = async (req, res) => {
  try {
    const editorial = await Editorial.findById(req.params.id);
    if (!editorial) {
      return res.status(404).json({
        success: false,
        mensaje: "Editorial no encontrada",
      });
    }
    res.status(200).json({
      success: true,
      editorial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener editorial",
      error: error.message,
    });
  }
};

// Crear nueva editorial (solo admin)
export const crearEditorial = async (req, res) => {
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
      return res.status(400).json({
        success: false,
        mensaje: "La editorial ya existe",
      });
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
    res.status(500).json({
      success: false,
      mensaje: "Error al crear editorial",
      error: error.message,
    });
  }
};

// Actualizar editorial (solo admin)
export const actualizarEditorial = async (req, res) => {
  try {
    const { nombre, sitioWeb, email, telefono, descripcion, activo } = req.body;

    let editorial = await Editorial.findById(req.params.id);
    if (!editorial) {
      return res.status(404).json({
        success: false,
        mensaje: "Editorial no encontrada",
      });
    }

    // Verificar si el nuevo nombre ya existe
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
    res.status(500).json({
      success: false,
      mensaje: "Error al actualizar editorial",
      error: error.message,
    });
  }
};

// Eliminar editorial (solo admin)
export const eliminarEditorial = async (req, res) => {
  try {
    const editorial = await Editorial.findByIdAndDelete(req.params.id);
    if (!editorial) {
      return res.status(404).json({
        success: false,
        mensaje: "Editorial no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      mensaje: "Editorial eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al eliminar editorial",
      error: error.message,
    });
  }
};
