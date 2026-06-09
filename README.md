# Mundos de Papel 📚

Plataforma e-commerce full-stack para la venta de libros especializados en manga, cómics y arte. Proyecto desarrollado como un monorepo con backend REST API y frontend moderno en React.

## 🎯 Descripción General

**Mundos de Papel** es un e-commerce completo que permite:

- ✅ Navegación intuitiva de catálogo de productos
- ✅ Carrito de compras con persistencia
- ✅ Sistema de autenticación y cuentas de usuario
- ✅ Panel administrativo para gestión de productos, pedidos y precios
- ✅ Integración con Cloudinary para gestión de imágenes
- ✅ Chat de soporte con Gemini AI
- ✅ Gestión de proveedores y alertas de stock

## 🏗️ Estructura del Proyecto

```
mundos-de-papel/
├── backend/                    # API REST con Node.js + Express
│   ├── config/                # Configuración (BD, Cloudinary)
│   ├── controllers/           # Lógica de controladores
│   ├── middleware/            # Autenticación, validación, errores
│   ├── models/                # Esquemas de Mongoose
│   ├── routes/                # Definición de rutas
│   ├── services/              # Lógica de negocio
│   ├── scripts/               # Scripts de seeding
│   ├── utils/                 # Utilidades y helpers
│   ├── validators/            # Validadores de datos
│   ├── server.js              # Punto de entrada
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                   # Aplicación React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── context/          # Context API (Auth, Cart)
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── services/         # Servicios de API
│   │   ├── utils/            # Utilidades
│   │   ├── App.jsx           # Router principal
│   │   ├── main.jsx          # Punto de entrada
│   │   └── index.css         # Estilos globales
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── pnpm-workspace.yaml        # Configuración del monorepo
├── package.json               # Dependencias compartidas
└── README.md                  # Este archivo
```

## 🚀 Tecnologías

### Backend

- **Node.js** >=18.0.0 - Runtime de JavaScript
- **Express** ^4.18.2 - Framework web
- **MongoDB** + **Mongoose** ^8.0.3 - Base de datos NoSQL
- **JWT** ^9.0.2 - Autenticación basada en tokens
- **bcryptjs** ^2.4.3 - Encriptación de contraseñas
- **Cloudinary** - Gestión de imágenes en la nube
- **express-validator** ^7.0.1 - Validación de datos
- **helmet** ^7.1.0 - Seguridad HTTP
- **express-rate-limit** ^7.1.5 - Limitación de peticiones
- **multer** - Carga de archivos
- **cors** - Control de acceso entre dominios

### Frontend

- **React** ^18.3.1 - Librería UI
- **Vite** ^5.1.0 - Build tool rápido
- **Tailwind CSS** ^3.4.1 - Utilidades de estilos
- **React Router** ^6.22.0 - Enrutamiento
- **React Hook Form** ^7.50.0 - Gestión de formularios
- **Axios** ^1.6.7 - Cliente HTTP
- **@google/generative-ai** - Integración con Gemini AI para chatbot

## 🛠️ Requisitos Previos

- **Node.js** >=18.0.0
- **pnpm** >=8.0.0
- **MongoDB** (local o MongoDB Atlas)
- **Cuenta de Cloudinary** (opcional, para carga de imágenes)
- **API Key de Google Generative AI** (para chatbot)

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd mundos-de-papel
```

### 2. Instalar dependencias del monorepo

```bash
pnpm install
```

Esto instalará automáticamente las dependencias de backend y frontend.

### 3. Configurar variables de entorno

#### Backend (`backend/.env`)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/mundos-de-papel

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_y_larga
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173

# Cloudinary (opcional)
CLOUDINARY_NAME=tu_nombre_cloudinary
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Google Generative AI
GOOGLE_API_KEY=tu_google_api_key
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### 4. Iniciar MongoDB

**Opción A - MongoDB Local:**

```bash
mongod
```

**Opción B - MongoDB Atlas (Nube):**

- Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crea un cluster gratuito
- Obtén la URI de conexión
- Actualiza `MONGODB_URI` en `backend/.env`

## 🚀 Ejecución

### Opción 1: Ejecutar Backend y Frontend por separado

**Terminal 1 - Backend:**

```bash
cd backend
pnpm dev
```

El servidor estará disponible en: `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
pnpm dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Opción 2: Ejecutar desde la raíz (si configuraste scripts)

```bash
# Ejecutar ambos en modo desarrollo
pnpm dev
```

## 📊 Seeding de Base de Datos

Para poblar la base de datos con datos de ejemplo:

```bash
cd backend
pnpm run seed
```

Esto creará:

- 1 usuario administrador
- 1 usuario normal
- Varios productos de ejemplo
- Categorías y otros datos iniciales

**Credenciales de prueba:**

```
Admin:
  Email: admin@mundosdepapel.com
  Password: admin123

Usuario:
  Email: usuario@example.com
  Password: usuario123
```

## 📡 API Endpoints Principales

### Autenticación (`/api/auth`)

| Método | Endpoint            | Descripción             | Autenticación |
| ------ | ------------------- | ----------------------- | ------------- |
| POST   | `/registro`         | Registrar nuevo usuario | No            |
| POST   | `/login`            | Iniciar sesión          | No            |
| GET    | `/me`               | Obtener usuario actual  | Sí            |
| PUT    | `/perfil`           | Actualizar perfil       | Sí            |
| PUT    | `/cambiar-password` | Cambiar contraseña      | Sí            |

### Productos (`/api/productos`)

| Método | Endpoint       | Descripción         | Autenticación |
| ------ | -------------- | ------------------- | ------------- |
| GET    | `/`            | Listar productos    | No            |
| GET    | `/:id`         | Obtener producto    | No            |
| POST   | `/`            | Crear producto      | Admin         |
| PUT    | `/:id`         | Actualizar producto | Admin         |
| DELETE | `/:id`         | Eliminar producto   | Admin         |
| POST   | `/:id/resenas` | Agregar reseña      | Usuario       |

### Pedidos (`/api/pedidos`)

| Método | Endpoint        | Descripción       | Autenticación |
| ------ | --------------- | ----------------- | ------------- |
| POST   | `/`             | Crear pedido      | Usuario       |
| GET    | `/mis-pedidos`  | Mis pedidos       | Usuario       |
| GET    | `/:id`          | Detalle de pedido | Usuario       |
| PUT    | `/:id/cancelar` | Cancelar pedido   | Usuario       |
| GET    | `/`             | Todos los pedidos | Admin         |
| PUT    | `/:id/estado`   | Actualizar estado | Admin         |

### Chat (`/api/chat`)

| Método | Endpoint | Descripción         | Autenticación |
| ------ | -------- | ------------------- | ------------- |
| POST   | `/`      | Enviar mensaje chat | Usuario       |

### Admin (`/api/admin`)

| Método | Endpoint         | Descripción         | Autenticación |
| ------ | ---------------- | ------------------- | ------------- |
| GET    | `/estadisticas`  | Datos del dashboard | Admin         |
| PUT    | `/configuracion` | Actualizar config   | Admin         |
| GET    | `/alertas`       | Alertas de stock    | Admin         |
| POST   | `/proveedores`   | Crear proveedor     | Admin         |

## 🎨 Interfaz Frontend

### Páginas Principales

| Ruta            | Descripción                     | Autenticación |
| --------------- | ------------------------------- | ------------- |
| `/`             | Página de inicio con destacados | No            |
| `/catalogo`     | Catálogo con filtros y búsqueda | No            |
| `/producto/:id` | Detalle de producto individual  | No            |
| `/carrito`      | Carrito de compras              | No            |
| `/ofertas`      | Productos en oferta             | No            |
| `/login`        | Inicio de sesión                | No            |
| `/registro`     | Registro de nuevo usuario       | No            |
| `/cuenta`       | Perfil y pedidos del usuario    | Sí            |
| `/dashboard`    | Panel administrativo            | Admin         |

### Temas de Dashboard Admin

- **Resumen** - KPIs y métricas generales
- **Ventas** - Historial y análisis de pedidos
- **Inventario** - Gestión de productos y stock
- **Precios** - Gestión de precios y descuentos
- **Clientes** - Listado de usuarios
- **Proveedores** - Gestión de proveedores
- **Alertas** - Notificaciones de stock bajo
- **Configuración** - Datos generales de la tienda

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcryptjs
- ✅ JWT para autenticación stateless
- ✅ Headers de seguridad HTTP (Helmet)
- ✅ Rate limiting para prevenir ataques
- ✅ Validación de datos con express-validator
- ✅ CORS configurado
- ✅ Protección contra NoSQL injection

## 📱 Características Principales

### Carrito de Compras

- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales con IVA
- Persistencia en localStorage
- Sincronización con backend

### Sistema de Autenticación

- Registro y login de usuarios
- Perfil de usuario editable
- Historial de pedidos
- Rol de administrador para gestión

### Catálogo de Productos

- Búsqueda en tiempo real
- Filtros por categoría, precio, autor, editorial
- Paginación
- Productos destacados y en oferta
- Sistema de reseñas

### Panel Administrativo

- Dashboard con estadísticas
- Gestión completa de productos
- Gestión de pedidos y estados
- Gestión de precios y descuentos
- Alertas de inventario
- Gestión de proveedores

### Chat de Soporte

- Chat integrado con Gemini AI
- Respuestas inteligentes
- Historial de conversaciones

## 🐳 Docker (Opcional)

Para ejecutar el backend en contenedor:

```bash
# Desde la carpeta backend
docker-compose up
```

## 📚 Recursos Útiles

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Este proyecto es de código abierto.

---

**¡Bienvenido a Mundos de Papel! Explora nuevos mundos en cada página. 📚✨**
