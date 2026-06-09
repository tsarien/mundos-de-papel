import Product from "../models/Product.js";
import { subirACloudinary } from "../utils/cloudinaryHelper.js";
import {
  obtenerProductosConFiltros,
  actualizarStockProducto,
} from "../services/productService.js";
import { aplicarReglasAProducto } from "../utils/aplicarReglasPrecios.js";
import { NotFoundError } from "../utils/errors.js";

// Obtener todos los productos - GET /api/productos
export const obtenerProductos = async (req, res, next) => {
  try {
    const result = await obtenerProductosConFiltros(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// Obtener producto por ID - GET /api/productos/:id
export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const productoDoc = await Product.findById(req.params.id)
      .populate("categoria", "nombre slug icono")
      .populate("valoraciones.usuario", "nombre apellido");

    if (!productoDoc) {
      throw new NotFoundError("Producto");
    }

    const producto = await aplicarReglasAProducto(productoDoc);

    res.json({ success: true, producto });
  } catch (error) {
    next(error);
  }
};

// Crear producto - POST /api/productos
export const crearProducto = async (req, res, next) => {
  try {
    const producto = await Product.create(req.body);
    await producto.populate("categoria", "nombre slug icono");
    res.status(201).json({ success: true, producto });
  } catch (error) {
    next(error);
  }
};

// Subir o reemplazar imagen de un producto - PUT /api/productos/:id/imagen
export const subirImagenProducto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, mensaje: "No se proporcionó ninguna imagen" });
    }

    const producto = await Product.findById(req.params.id);
    if (!producto) {
      throw new NotFoundError("Producto");
    }

    const resultado = await subirACloudinary(
      req.file.buffer,
      `producto-${producto._id}`,
    );
    producto.imagen = resultado.secure_url;
    await producto.save();
    await producto.populate("categoria", "nombre slug icono");

    res.json({
      success: true,
      mensaje: "Imagen actualizada correctamente",
      imagen: resultado.secure_url,
      producto,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar producto - PUT /api/productos/:id
export const actualizarProducto = async (req, res, next) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("categoria", "nombre slug icono");

    if (!producto) {
      throw new NotFoundError("Producto");
    }

    res.json({ success: true, producto });
  } catch (error) {
    next(error);
  }
};

// Eliminar producto (soft delete) - DELETE /api/productos/:id
export const eliminarProducto = async (req, res, next) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true },
    );

    if (!producto) {
      throw new NotFoundError("Producto");
    }

    res.json({ success: true, mensaje: "Producto eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Actualizar stock del producto - PUT /api/productos/:id/stock
export const actualizarStock = async (req, res, next) => {
  try {
    const { cantidad } = req.body;
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      throw new NotFoundError("Producto");
    }

    const productoActualizado = await actualizarStockProducto(
      producto,
      cantidad,
    );
    res.json({ success: true, producto: productoActualizado });
  } catch (error) {
    next(error);
  }
};

// Obtener resumen de inventario - GET /api/productos/inventario
export const obtenerInventario = async (req, res, next) => {
  try {
    const productos = await Product.find({ activo: true }).populate(
      "categoria",
      "_id nombre",
    );

    const totalProductos = productos.length;
    const stockTotal = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
    const valorInventario = productos.reduce(
      (acc, p) => acc + (p.precio || 0) * (p.stock || 0),
      0,
    );
    const stockBajo = productos.filter((p) => p.stock <= 5).length;

    const conteoCategorias = {};
    productos.forEach((p) => {
      const nombreCat = p.categoria?.nombre || "Sin Categoría";
      conteoCategorias[nombreCat] = (conteoCategorias[nombreCat] || 0) + 1;
    });

    const categoriasDistribucion = Object.keys(conteoCategorias).map((cat) => ({
      categoria: cat,
      count: conteoCategorias[cat],
      pct:
        totalProductos > 0 ? (conteoCategorias[cat] / totalProductos) * 100 : 0,
    }));

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
    next(error);
  }
};
