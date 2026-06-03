import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
      maxlength: [200, "El nombre no puede exceder 200 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
    },
    descripcionCompleta: {
      type: String,
      maxlength: [
        3000,
        "La descripción completa no puede exceder 3000 caracteres",
      ],
    },
    precio: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "La categoría es requerida"],
    },
    autor: {
      type: String,
      required: [true, "El autor es requerido"],
      trim: true,
    },
    editorial: {
      type: String,
      required: [true, "La editorial es requerida"],
      trim: true,
    },
    paginas: {
      type: Number,
      required: [true, "El número de páginas es requerido"],
      min: [1, "Debe tener al menos 1 página"],
    },
    idioma: {
      type: String,
      default: "Español España",
    },
    presentacion: {
      type: String,
      default: "Tapa Blanda",
    },
    imagen: {
      type: String,
      default: "/productos/default.jpg",
    },
    imagenes: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    enOferta: {
      type: Boolean,
      default: false,
    },
    descuento: {
      type: Number,
      min: [0, "El descuento no puede ser negativo"],
      max: [100, "El descuento no puede exceder 100%"],
      default: 0,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    valoraciones: [
      {
        usuario: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usuario",
        },
        nombre: {
          type: String,
          required: true,
        },
        initials: {
          type: String,
          required: true,
        },
        puntuacion: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comentario: {
          type: String,
          required: true,
        },
        helpful: {
          type: Number,
          default: 0,
        },
        usuariosUtiles: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
          },
        ],
        verificada: {
          type: Boolean,
          default: false,
        },
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    promedioValoracion: {
      type: Number,
      default: 0,
    },
    totalValoraciones: {
      type: Number,
      default: 0,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Crear slug antes de guardar
productoSchema.pre("save", function (next) {
  if (this.isModified("nombre")) {
    this.slug = this.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Calcular promedio de valoraciones
productoSchema.methods.calcularPromedioValoracion = function () {
  if (this.valoraciones.length === 0) {
    this.promedioValoracion = 0;
    this.totalValoraciones = 0;
  } else {
    const suma = this.valoraciones.reduce(
      (acc, val) => acc + val.puntuacion,
      0,
    );
    this.promedioValoracion = suma / this.valoraciones.length;
    this.totalValoraciones = this.valoraciones.length;
  }
};

// Índices para búsquedas
productoSchema.index({ nombre: "text", autor: "text", editorial: "text" });
productoSchema.index({ categoria: 1, precio: 1 });
productoSchema.index({ enOferta: 1 });

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
