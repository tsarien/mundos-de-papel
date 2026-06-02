import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";

// Importar rutas
import authRoutes from "./routes/authRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import editorialRoutes from "./routes/editorialRoutes.js";

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Comprimir respuestas
app.use(compression());

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message:
    "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/editoriales", editorialRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    success: true,
    mensaje: "API de Mundos de Papel funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      productos: "/api/productos",
      pedidos: "/api/pedidos",
      admin: "/api/admin",
    },
  });
});

// Ruta para health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: "Ruta no encontrada",
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Manejo de rechazos de promesas no controladas
process.on("unhandledRejection", (err) => {
  console.error("❌ Error no controlado:", err.message);
  // Cerrar servidor y salir
  server.close(() => process.exit(1));
});

export default app;
