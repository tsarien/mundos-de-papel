import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      maxlength: [50, "El apellido no puede exceder 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor proporciona un email válido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    telefono: {
      type: String,
      trim: true,
      default: "",
    },
    direccion: {
      type: String,
      trim: true,
      default: "",
    },
    cedula: {
      type: String,
      trim: true,
      default: "",
    },
    fechaNacimiento: {
      type: Date,
    },
    rol: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
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

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

usuarioSchema.methods.obtenerDatosPublicos = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    telefono: this.telefono,
    direccion: this.direccion,
    rol: this.rol,
  };
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
