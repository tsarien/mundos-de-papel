import mongoose from "mongoose";

const editorialSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la editorial es requerido"],
      unique: true,
      trim: true,
      maxlength: [150, "El nombre no puede exceder 150 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    sitioWeb: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    telefono: {
      type: String,
      default: null,
    },
    descripcion: {
      type: String,
      maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
    },
    logo: {
      type: String,
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

editorialSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.nombre.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Editorial = mongoose.model("Editorial", editorialSchema);
export default Editorial;
