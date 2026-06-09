import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import "./models/PedidoProveedor.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import editorialRoutes from "./routes/editorialRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

connectDB();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message:
    "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categorias", categoryRoutes);
app.use("/api/editoriales", editorialRoutes);
app.use("/api/chat", chatRoutes);

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

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: "Ruta no encontrada",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(
    `🤴 Credenciales de administrador: admin@mundosdepapel.com - admin123`,
  );
  console.log(
    `🧑 Credenciales de usuario de prueba: usuario@example.com - usuario123`,
  );
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Error no controlado:", err.message);
  server.close(() => process.exit(1));
});

export default app;
