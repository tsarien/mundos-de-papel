import Producto from "../models/Producto.js";
import cloudinary from "../config/cloudinary.js";

// Helper: sube un buffer a Cloudinary y retorna la URL segura
const subirACloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "mundos-de-papel/productos",
          public_id: publicId,
          overwrite: true,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });
};

// @desc    Obtener todos los productos
// @route   GET /api/productos
// @access  Public
export const obtenerProductos = async (req, res) => {
  try {
    const {
      categoria,
      busqueda,
      precioMin,
      precioMax,
      autor,
      editorial,
      enOferta,
      destacado,
      pagina = 1,
      limite = 12,
      ordenar = "-createdAt",
    } = req.query;

    const filtros = { activo: true };

    if (categoria) filtros.categoria = categoria;
    if (busqueda) filtros.$text = { $search: busqueda };
    if (autor) filtros.autor = { $regex: autor, $options: "i" };
    if (editorial) filtros.editorial = { $regex: editorial, $options: "i" };
    if (enOferta === "true") filtros.enOferta = true;
    if (destacado === "true") filtros.destacado = true;

    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio.$gte = Number(precioMin);
      if (precioMax) filtros.precio.$lte = Number(precioMax);
    }

    const skip = (Number(pagina) - 1) * Number(limite);

    const productos = await Producto.find(filtros)
      .populate("categoria", "nombre slug icono")
      .sort(ordenar)
      .limit(Number(limite))
      .skip(skip);

    const total = await Producto.countDocuments(filtros);

    res.json({
      success: true,
      count: productos.length,
      total,
      paginas: Math.ceil(total / Number(limite)),
      paginaActual: Number(pagina),
      productos,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener productos",
      error: error.message,
    });
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/productos/:id
// @access  Public
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate("categoria", "nombre slug icono")
      .populate("valoraciones.usuario", "nombre apellido");

    if (!producto) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Producto no encontrado" });
    }

    res.json({ success: true, producto });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener producto",
      error: error.message,
    });
  }
};

// @desc    Crear producto (con imagen opcional)
// @route   POST /api/productos
// @access  Private/Admin
export const crearProducto = async (req, res) => {
  try {
    const datos = { ...req.body };

    // Si se adjuntó una imagen, subirla a Cloudinary
    if (req.file) {
      const resultado = await subirACloudinary(
        req.file.buffer,
        `producto-nuevo-${Date.now()}`,
      );
      datos.imagen = resultado.secure_url;
    }

    const producto = await Producto.create(datos);

    // Si se creó con una imagen temporal, actualizar el public_id con el ID real
    if (req.file) {
      await cloudinary.uploader
        .rename(
          `mundos-de-papel/productos/producto-nuevo-${datos.imagen.split("producto-nuevo-")[1]?.split(".")[0]}`,
          `mundos-de-papel/productos/producto-${producto._id}`,
          { overwrite: true },
        )
        .catch(() => {}); // Si falla el rename no es crítico
    }

    // Poblar la categoría antes de devolver
    await producto.populate("categoria", "nombre slug icono");

    res.status(201).json({ success: true, producto });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
};

// @desc    Subir o reemplazar imagen de un producto
// @route   PUT /api/productos/:id/imagen
// @access  Private/Admin
export const subirImagenProducto = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, mensaje: "No se proporcionó ninguna imagen" });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Producto no encontrado" });
    }

    // Subir a Cloudinary usando el ID del producto como nombre (sobreescribe si ya existe)
    const resultado = await subirACloudinary(
      req.file.buffer,
      `producto-${producto._id}`,
    );

    producto.imagen = resultado.secure_url;
    await producto.save();

    // Poblar la categoría antes de devolver
    await producto.populate("categoria", "nombre slug icono");

    res.json({
      success: true,
      mensaje: "Imagen actualizada correctamente",
      imagen: resultado.secure_url,
      producto,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al subir imagen",
      error: error.message,
    });
  }
};

// @desc    Actualizar producto
// @route   PUT /api/productos/:id
// @access  Private/Admin
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("categoria", "nombre slug icono");

    if (!producto) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Producto no encontrado" });
    }

    res.json({ success: true, producto });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};

// @desc    Eliminar producto (soft delete)
// @route   DELETE /api/productos/:id
// @access  Private/Admin
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true },
    );

    if (!producto) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Producto no encontrado" });
    }

    res.json({ success: true, mensaje: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al eliminar producto",
      error: error.message,
    });
  }
};

// @desc    Actualizar stock del producto
// @route   PUT /api/productos/:id/stock
// @access  Private/Admin
export const actualizarStock = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Producto no encontrado" });
    }

    producto.stock = cantidad;
    await producto.save();

    res.json({ success: true, producto });
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al actualizar stock",
      error: error.message,
    });
  }
};

// @desc    Obtener resumen de inventario para el panel de administración
// @route   GET /api/productos/inventario
// @access  Private/Admin
export const obtenerInventario = async (req, res) => {
  try {
    // CORRECCIÓN: Quitamos el .select restrictivo para que Mongoose herede y pueble correctamente los IDs y la categoría completa
    const productos = await Producto.find({ activo: true }).populate(
      "categoria",
      "_id nombre",
    );

    const totalProductos = productos.length;

    // 2. Calculamos el stock total y valor del inventario
    const stockTotal = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
    const valorInventario = productos.reduce(
      (acc, p) => acc + (p.precio || 0) * (p.stock || 0),
      0,
    );

    // 3. Contamos los productos con stock bajo (ejemplo menor o igual a 5)
    const stockBajo = productos.filter((p) => p.stock <= 5).length;

    // 4. Agrupamos dinámicamente para la distribución por categorías
    const conteoCategorias = {};
    productos.forEach((p) => {
      const nombreCat = p.categoria?.nombre || "Sin Categoría";
      conteoCategorias[nombreCat] = (conteoCategorias[nombreCat] || 0) + 1;
    });

    // Transformamos el mapa de categorías en el formato de array que espera el Frontend
    const categoriasDistribucion = Object.keys(conteoCategorias).map((cat) => {
      const count = conteoCategorias[cat];
      const pct = totalProductos > 0 ? (count / totalProductos) * 100 : 0;
      return { categoria: cat, count, pct };
    });

    res.status(200).json({
      success: true,
      inventario: {
        totalProductos,
        stockTotal,
        stockBajo,
        valorInventario,
        productos,
        categorias: categoriasDistribucion,
      },
    });
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener el resumen del inventario",
      error: error.message,
    });
  }
};
