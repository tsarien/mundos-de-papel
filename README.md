# Mundos de Papel - Backend API

Backend completo con Node.js, Express y MongoDB para el e-commerce Mundos de Papel.

## 🚀 Tecnologías

- **Node.js** + **Express** - Framework web
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **helmet** - Seguridad HTTP
- **cors** - Control de acceso
- **compression** - Compresión de respuestas
- **rate-limit** - Limitación de peticiones

## 📁 Estructura del Proyecto

```
mundos-de-papel-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── models/
│   │   ├── Usuario.js           # Modelo de usuarios
│   │   ├── Producto.js          # Modelo de productos
│   │   └── Pedido.js            # Modelo de pedidos
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── productoController.js # Lógica de productos
│   │   └── pedidoController.js  # Lógica de pedidos
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── productoRoutes.js    # Rutas de productos
│   │   └── pedidoRoutes.js      # Rutas de pedidos
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── validator.js         # Validación
│   ├── utils/
│   │   └── seed.js              # Script para poblar BD
│   └── server.js                # Servidor principal
├── .env.example                 # Variables de entorno ejemplo
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd mundos-de-papel-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mundos-de-papel
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
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
- Actualiza `MONGODB_URI` en `.env`

### 5. Poblar la base de datos (Seed)

```bash
npm run seed -- -i
```

Esto creará:

- 2 usuarios (1 admin, 1 usuario normal)
- 8 productos de ejemplo

**Credenciales de prueba:**

```
Admin:
  Email: admin@mundosdepapel.com
  Password: admin123

Usuario:
  Email: usuario@example.com
  Password: usuario123
```

### 6. Iniciar el servidor

**Desarrollo (con nodemon):**

```bash
npm run dev
```

**Producción:**

```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## 📡 API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint            | Descripción             | Autenticación |
| ------ | ------------------- | ----------------------- | ------------- |
| POST   | `/registro`         | Registrar nuevo usuario | No            |
| POST   | `/login`            | Iniciar sesión          | No            |
| GET    | `/me`               | Obtener usuario actual  | Sí            |
| PUT    | `/perfil`           | Actualizar perfil       | Sí            |
| PUT    | `/cambiar-password` | Cambiar contraseña      | Sí            |

### Productos (`/api/productos`)

| Método | Endpoint            | Descripción         | Autenticación |
| ------ | ------------------- | ------------------- | ------------- |
| GET    | `/`                 | Listar productos    | No            |
| GET    | `/:id`              | Obtener producto    | No            |
| POST   | `/`                 | Crear producto      | Admin         |
| PUT    | `/:id`              | Actualizar producto | Admin         |
| DELETE | `/:id`              | Eliminar producto   | Admin         |
| POST   | `/:id/valoraciones` | Agregar valoración  | Usuario       |
| PUT    | `/:id/stock`        | Actualizar stock    | Admin         |

### Pedidos (`/api/pedidos`)

| Método | Endpoint                | Descripción       | Autenticación |
| ------ | ----------------------- | ----------------- | ------------- |
| POST   | `/`                     | Crear pedido      | Usuario       |
| GET    | `/mis-pedidos`          | Mis pedidos       | Usuario       |
| GET    | `/:id`                  | Detalle de pedido | Usuario       |
| PUT    | `/:id/cancelar`         | Cancelar pedido   | Usuario       |
| GET    | `/`                     | Todos los pedidos | Admin         |
| PUT    | `/:id/estado`           | Actualizar estado | Admin         |
| GET    | `/estadisticas/general` | Estadísticas      | Admin         |

## 📝 Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "300-123-4567",
    "direccion": "Calle 123 #45-67"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "usuario123"
  }'
```

Respuesta:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "nombre": "Usuario",
    "apellido": "Demo",
    "email": "usuario@example.com",
    "rol": "usuario"
  }
}
```

### Obtener Productos (con filtros)

```bash
# Todos los productos
curl http://localhost:5000/api/productos

# Filtrar por categoría
curl http://localhost:5000/api/productos?categoria=Manga

# Buscar por texto
curl http://localhost:5000/api/productos?busqueda=dragon

# Productos en oferta
curl http://localhost:5000/api/productos?enOferta=true

# Con paginación
curl http://localhost:5000/api/productos?pagina=1&limite=12
```

### Crear Pedido (requiere token)

```bash
curl -X POST http://localhost:5000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "items": [
      {
        "producto": "PRODUCTO_ID",
        "cantidad": 2
      }
    ],
    "direccionEnvio": {
      "direccion": "Calle 123 #45-67",
      "ciudad": "Bogotá",
      "departamento": "Cundinamarca",
      "telefono": "300-123-4567"
    },
    "metodoPago": "tarjeta"
  }'
```

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

**Para rutas protegidas, incluye el token en el header:**

```
Authorization: Bearer TU_TOKEN_JWT
```

## 🛡️ Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ JWT para autenticación
- ✅ Helmet para headers de seguridad
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configurado
- ✅ Validación de datos con express-validator
- ✅ Protección contra NoSQL injection

## 🗄️ Modelos de Datos

### Usuario

```javascript
{
  nombre: String,
  apellido: String,
  email: String (único),
  password: String (encriptado),
  telefono: String,
  direccion: String,
  cedula: String,
  fechaNacimiento: Date,
  rol: String (usuario|admin),
  activo: Boolean
}
```

### Producto

```javascript
{
  nombre: String,
  slug: String (único),
  descripcion: String,
  descripcionCompleta: String,
  precio: Number,
  categoria: String (Manga|Cómic|Arte),
  autor: String,
  editorial: String,
  paginas: Number,
  idioma: String,
  presentacion: String,
  imagen: String,
  imagenes: [String],
  stock: Number,
  enOferta: Boolean,
  descuento: Number,
  destacado: Boolean,
  valoraciones: [Object],
  promedioValoracion: Number,
  totalValoraciones: Number,
  activo: Boolean
}
```

### Pedido

```javascript
{
  usuario: ObjectId,
  items: [{
    producto: ObjectId,
    nombre: String,
    cantidad: Number,
    precio: Number,
    descuento: Number,
    subtotal: Number
  }],
  direccionEnvio: Object,
  metodoPago: String,
  estadoPago: String,
  subtotal: Number,
  iva: Number,
  descuentoTotal: Number,
  costoEnvio: Number,
  total: Number,
  estado: String,
  fechaEstimadaEntrega: Date,
  fechaEntrega: Date,
  tracking: String,
  historial: [Object]
}
```

## 🧪 Testing

Para probar la API, puedes usar:

- **Postman** - Importa la colección de endpoints
- **Thunder Client** - Extensión de VS Code
- **curl** - Línea de comandos

## 📊 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run seed -- -i # Importar datos de ejemplo
npm run seed -- -d # Eliminar todos los datos
```

## 🚀 Deployment

### Variables de entorno en producción

```env
NODE_ENV=production
MONGODB_URI=tu_mongodb_atlas_uri
JWT_SECRET=clave_super_segura_y_larga
CLIENT_URL=https://tu-dominio.com
```

### Plataformas recomendadas

- **Railway** - Deploy automático con GitHub
- **Render** - Plan gratuito disponible
- **Heroku** - Fácil configuración
- **DigitalOcean** - VPS con control total
- **AWS EC2** - Escalabilidad enterprise

## 🐛 Solución de Problemas

**Error: Cannot connect to MongoDB**

```bash
# Verifica que MongoDB esté corriendo
mongod --version

# O usa MongoDB Atlas en la nube
```

**Error: JWT_SECRET is not defined**

```bash
# Asegúrate de tener el archivo .env configurado
cp .env.example .env
# Edita .env con tus valores
```

**Error: Puerto 5000 en uso**

```bash
# Cambia el puerto en .env
PORT=5001
```

## 📚 Recursos

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Este proyecto es de código abierto.

---

**¡Tu backend está listo para producción! 🚀**

# Mundos de Papel - E-commerce React

E-commerce moderno de libros (manga, cómics y arte) desarrollado con React, Tailwind CSS, React Router y Context API.

## 🚀 Características

- ✅ **React 18** con Vite
- ✅ **Tailwind CSS** para estilos modernos y responsivos
- ✅ **React Router v6** para navegación
- ✅ **Context API** para gestión de estado (carrito y autenticación)
- ✅ **LocalStorage** para persistencia de datos
- ✅ **React Hook Form** para validación de formularios
- ✅ Carrito de compras funcional
- ✅ Filtros dinámicos de productos
- ✅ Búsqueda en tiempo real
- ✅ Sistema de autenticación simulado
- ✅ Diseño 100% responsive

## 📁 Estructura del Proyecto

```
mundos-de-papel-react/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── pages/            # Páginas principales
│   │   ├── Home.jsx
│   │   ├── Catalogo.jsx
│   │   ├── ProductoDetalle.jsx
│   │   ├── Carrito.jsx
│   │   ├── Ofertas.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   └── Cuenta.jsx
│   ├── context/          # Context API
│   │   ├── CartContext.jsx
│   │   └── AuthContext.jsx
│   ├── hooks/            # Hooks personalizados
│   │   └── useLocalStorage.js
│   ├── data/             # Datos mock
│   │   └── productos.js
│   ├── App.jsx           # Router principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── public/               # Archivos estáticos
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🛠️ Instalación y Ejecución

### Requisitos previos

- Node.js 16+ y npm

### Pasos

1. **Navegar al directorio del proyecto:**

```bash
cd mundos-de-papel-react
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Ejecutar en modo desarrollo:**

```bash
npm run dev
```

4. **Abrir en el navegador:**

```
http://localhost:3000
```

5. **Compilar para producción:**

```bash
npm run build
```

## 🎨 Paleta de Colores

- **Fondo oscuro:** `#181b22`
- **Fondo claro:** `#232632`
- **Acento azul:** `#7ec3e6`
- **Acento rosa:** `#e68cb7`
- **Acento morado:** `#b6a6e6`
- **Acento verde:** `#72d275`

## 📱 Páginas Disponibles

| Ruta            | Descripción                     |
| --------------- | ------------------------------- |
| `/`             | Página de inicio con destacados |
| `/catalogo`     | Catálogo con filtros y búsqueda |
| `/producto/:id` | Detalle de producto individual  |
| `/carrito`      | Carrito de compras              |
| `/ofertas`      | Productos en oferta             |
| `/login`        | Inicio de sesión                |
| `/registro`     | Registro de nuevo usuario       |
| `/cuenta`       | Panel de usuario                |

## 🔑 Funcionalidades Principales

### Carrito de Compras

- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia en localStorage

### Autenticación

- Login simulado
- Registro de usuarios
- Gestión de perfil
- Protección de rutas

### Filtros y Búsqueda

- Filtro por categoría
- Filtro por precio
- Filtro por autor/editorial
- Búsqueda en tiempo real

## 🧩 Componentes Principales

### `CartContext`

Gestiona el estado global del carrito con las siguientes funciones:

- `addToCart(producto, cantidad)`
- `removeFromCart(productoId)`
- `updateQuantity(productoId, cantidad)`
- `clearCart()`
- `getCartTotal()`
- `getCartCount()`

### `AuthContext`

Gestiona la autenticación con:

- `login(email, password)`
- `register(userData)`
- `logout()`
- `updateProfile(data)`

## 🎯 Próximas Mejoras

- [ ] Integración con API backend real
- [ ] Pasarela de pago
- [ ] Wishlist/favoritos
- [ ] Sistema de reseñas
- [ ] Historial de pedidos real
- [ ] Notificaciones
- [ ] Chat de soporte

## 🤝 Contribuir

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Proyecto desarrollado como migración de prototipo HTML/CSS a React moderno.

---

**¡Disfruta explorando nuevos mundos en cada página! 📚✨**
