import "dotenv/config";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import Pedido from "../models/Pedido.js";
import Proveedor from "../models/Proveedor.js";
import Alerta from "../models/Alerta.js";
import ReglaPrecio from "../models/ReglaPrecio.js";
import Configuracion from "../models/Configuracion.js";
import Categoria from "../models/Categoria.js";
import Editorial from "../models/Editorial.js";

const BASE_URL = `https://res.cloudinary.com/dndknc8cp/image/upload`;

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error al conectar:", error);
    process.exit(1);
  }
};

// Datos de ejemplo para usuarios
const usuarios = [
  {
    nombre: "Admin",
    apellido: "Sistema",
    email: "admin@mundosdepapel.com",
    password: "admin123",
    telefono: "300-111-1111",
    direccion: "Calle Principal #123",
    rol: "admin",
  },
  {
    nombre: "Usuario",
    apellido: "Demo",
    email: "usuario@example.com",
    password: "usuario123",
    telefono: "300-222-2222",
    direccion: "Carrera 45 #67-89",
    cedula: "1234567890",
    rol: "usuario",
  },
  {
    nombre: "Ana",
    apellido: "Torres",
    email: "ana@example.com",
    password: "cliente123",
    telefono: "300-333-3333",
    direccion: "Calle 10 #20-30",
    rol: "usuario",
  },
  {
    nombre: "Carlos",
    apellido: "Méndez",
    email: "carlos@example.com",
    password: "cliente123",
    telefono: "300-444-4444",
    direccion: "Av. Libertador #45",
    rol: "usuario",
  },
  {
    nombre: "Laura",
    apellido: "Jiménez",
    email: "laura@example.com",
    password: "cliente123",
    telefono: "300-555-5555",
    direccion: "Carrera 7 #80-15",
    rol: "usuario",
  },
  {
    nombre: "Roberto",
    apellido: "Silva",
    email: "roberto@example.com",
    password: "cliente123",
    telefono: "300-666-6666",
    direccion: "Transversal 50 #12",
    rol: "usuario",
  },
  {
    nombre: "María",
    apellido: "López",
    email: "maria@example.com",
    password: "cliente123",
    telefono: "300-777-7777",
    direccion: "Calle 80 #10-05",
    rol: "usuario",
  },
  {
    nombre: "Diego",
    apellido: "Torres",
    email: "diego@example.com",
    password: "cliente123",
    telefono: "300-888-8888",
    direccion: "Carrera 15 #25-40",
    rol: "usuario",
  },
];

// Datos de ejemplo para categorías
const categorias = [
  {
    nombre: "Manga",
    slug: "manga",
    descripcion: "Historietas ilustradas de origen japonés",
    icono: "ti-book",
    activo: true,
  },
  {
    nombre: "Cómic",
    slug: "comic",
    descripcion: "Historietas de aventura y fantasía",
    icono: "ti-bookmark",
    activo: true,
  },
  {
    nombre: "Arte",
    slug: "arte",
    descripcion: "Libros de arte e ilustración",
    icono: "ti-palette",
    activo: true,
  },
];

// Datos de ejemplo para editoriales
const editoriales = [
  {
    nombre: "Planeta Comic",
    slug: "planeta-comic",
    descripcion: "Líder en publicación de manga y cómics en español",
    activo: true,
  },
  {
    nombre: "DC Comics / ECC Ediciones",
    slug: "dc-comics-ecc",
    descripcion: "Distribuidor oficial de DC Comics en España",
    activo: true,
  },
  {
    nombre: "Norma Editorial",
    slug: "norma-editorial",
    descripcion: "Editorial especializada en manga y cómics",
    activo: true,
  },
  {
    nombre: "ArteStudio Ediciones",
    slug: "artestudio-ediciones",
    descripcion: "Editorial dedicada a libros de arte e ilustración",
    activo: true,
  },
  {
    nombre: "Editorial Taschen",
    slug: "editorial-taschen",
    descripcion: "Editora de libros de arte de alta calidad",
    activo: true,
  },
];

// Datos de ejemplo para productos
const productos = [
  {
    nombre: "Dragon Ball",
    descripcion:
      "Acompaña a Son Goku, un joven guerrero con una fuerza increíble y un corazón puro, en su viaje para reunir las legendarias Esferas del Dragón.",
    descripcionCompleta:
      "Con el inconfundible estilo de Akira Toriyama, Dragon Ball combina humor, aventura y acción en una historia que ha inspirado a millones alrededor del mundo. Esta edición recopila los capítulos originales restaurados, junto con ilustraciones exclusivas y detalles del proceso creativo del autor.",
    precio: 60000,
    categoria: "Manga",
    autor: "Akira Toriyama",
    editorial: "Planeta Comic",
    paginas: 240,
    idioma: "Español España",
    presentacion: "Tapa Blanda con sobrecubierta",
    imagen: `${BASE_URL}/dragon-ball.webp`,
    stock: 15,
    enOferta: true,
    descuento: 10,
    destacado: true,
    valoraciones: [
      {
        nombre: "Carlos Ramírez",
        initials: "CR",
        puntuacion: 5,
        comentario:
          "¡Una obra maestra del manga! La edición está impecable y las ilustraciones se ven increíbles. Totalmente recomendado para fans y nuevos lectores.",
        helpful: 12,
        verificada: true,
        fecha: new Date("2026-05-15"),
      },
      {
        nombre: "Ana Martínez",
        initials: "AM",
        puntuacion: 5,
        comentario:
          "La nostalgia en papel. Calidad excelente, llegó en perfectas condiciones. Vale cada peso.",
        helpful: 8,
        verificada: true,
        fecha: new Date("2026-05-10"),
      },
      {
        nombre: "Diego Torres",
        initials: "DT",
        puntuacion: 4,
        comentario:
          "Muy buen producto. Solo le pondría 5 estrellas si el precio fuera un poco más accesible, pero la calidad lo compensa.",
        helpful: 3,
        verificada: false,
        fecha: new Date("2026-05-05"),
      },
    ],
  },
  {
    nombre: "Batman: Hush",
    descripcion:
      "Sumérgete en las sombras de Gotham con Batman: Hush, una de las historias más aclamadas del Cruzado Enmascarado.",
    descripcionCompleta:
      "Este volumen recopila ilustraciones espectaculares de Jim Lee, acompañadas por comentarios exclusivos del equipo creativo y bocetos inéditos que muestran el proceso artístico detrás de cada escena. Descubre los secretos del misterioso enemigo que manipula a los villanos más peligrosos de Gotham.",
    precio: 80000,
    categoria: "Cómic",
    autor: "Jim Lee, Jeph Loeb",
    editorial: "DC Comics / ECC Ediciones",
    paginas: 256,
    idioma: "Español España",
    presentacion: "Tapa Dura con sobrecubierta",
    imagen: `${BASE_URL}/batman.jpg`,
    stock: 4,
    enOferta: false,
    destacado: true,
    valoraciones: [
      {
        nombre: "Roberto Silva",
        initials: "RS",
        puntuacion: 5,
        comentario:
          "El arte de Jim Lee es espectacular. Esta edición de tapa dura es una joya para cualquier coleccionista. 100% recomendado.",
        helpful: 15,
        verificada: true,
        fecha: new Date("2026-05-12"),
      },
      {
        nombre: "Laura Gómez",
        initials: "LG",
        puntuacion: 4,
        comentario:
          "Excelente historia y arte. La encuadernación es de buena calidad. Le resto una estrella por el precio, pero vale la pena.",
        helpful: 6,
        verificada: true,
        fecha: new Date("2026-05-08"),
      },
    ],
  },
  {
    nombre: "Pokemon Adventures",
    descripcion:
      "Embárcate en un viaje lleno de emoción, amistad y batallas épicas con Pokémon Adventures.",
    descripcionCompleta:
      "Acompaña a Red, un joven entrenador decidido a convertirse en el mejor, mientras recorre la región de Kanto enfrentando a poderosos rivales, descubriendo los secretos del Team Rocket y fortaleciendo el lazo con sus Pokémon.",
    precio: 80000,
    categoria: "Manga",
    autor: "Hidenori Kusaka, Mato",
    editorial: "Norma Editorial",
    paginas: 192,
    idioma: "Español España",
    presentacion: "Tapa Blanda con sobrecubierta",
    imagen: `${BASE_URL}/pokemon.jpg`,
    stock: 12,
    enOferta: false,
    destacado: true,
    valoraciones: [
      {
        nombre: "María López",
        initials: "ML",
        puntuacion: 5,
        comentario:
          "Perfecto para fans de Pokémon. La historia es mucho más profunda que la del anime. ¡Me encantó!",
        helpful: 9,
        verificada: true,
        fecha: new Date("2026-05-14"),
      },
    ],
  },
  {
    nombre: "One Piece",
    descripcion:
      "Únete a Monkey D. Luffy y su tripulación en la búsqueda del tesoro más grande del mundo: el One Piece.",
    descripcionCompleta:
      "Con un arte único y una narrativa envolvente, One Piece es uno de los mangas más exitosos de todos los tiempos. Descubre por qué millones de fans en todo el mundo han seguido esta historia durante décadas.",
    precio: 60000,
    categoria: "Manga",
    autor: "Eiichiro Oda",
    editorial: "Planeta Comic",
    paginas: 200,
    idioma: "Español España",
    presentacion: "Tapa Blanda",
    imagen: `${BASE_URL}/one-piece.jpg`,
    stock: 20,
    enOferta: true,
    descuento: 20,
    valoraciones: [
      {
        nombre: "Pedro Sánchez",
        initials: "PS",
        puntuacion: 5,
        comentario:
          "La mejor aventura pirata jamás contada. El descuento hace que sea una compra obligada.",
        helpful: 20,
        verificada: true,
        fecha: new Date("2026-05-16"),
      },
      {
        nombre: "Sofía Pérez",
        initials: "SP",
        puntuacion: 5,
        comentario:
          "Calidad impresionante. La traducción es excelente y el papel de muy buena calidad.",
        helpful: 11,
        verificada: true,
        fecha: new Date("2026-05-11"),
      },
    ],
  },
  {
    nombre: "All-Star Superman",
    descripcion:
      "Vive la leyenda de Superman como nunca antes en All-Star Superman.",
    descripcionCompleta:
      "Tras descubrir que su tiempo en la Tierra llega a su fin, el Último Hijo de Krypton decide dedicar sus últimos días a dejar un legado de esperanza para la humanidad. Con un guion brillante de Grant Morrison y el arte impresionante de Frank Quitely.",
    precio: 80000,
    categoria: "Cómic",
    autor: "Grant Morrison, Frank Quitely",
    editorial: "DC Comics / ECC Ediciones",
    paginas: 320,
    idioma: "Español España",
    presentacion: "Tapa Dura con sobrecubierta",
    imagen: `${BASE_URL}/superman.jpg`,
    stock: 2,
    enOferta: true,
    descuento: 25,
    valoraciones: [
      {
        nombre: "Javier Morales",
        initials: "JM",
        puntuacion: 5,
        comentario:
          "La mejor historia de Superman jamás escrita. Grant Morrison captura la esencia del personaje de forma perfecta.",
        helpful: 18,
        verificada: true,
        fecha: new Date("2026-05-13"),
      },
    ],
  },
  {
    nombre: "Armonia de Color para Artistas",
    descripcion:
      "Explora el fascinante mundo del color con esta guía esencial para artistas.",
    descripcionCompleta:
      "Descubre cómo los grandes maestros utilizan la luz, la temperatura y el contraste cromático para crear equilibrio y emoción en sus obras. A través de ejemplos ilustrados, paletas sugeridas y ejercicios guiados.",
    precio: 120000,
    categoria: "Arte",
    autor: "Laura Méndez",
    editorial: "ArteStudio Ediciones",
    paginas: 256,
    idioma: "Español España",
    presentacion: "Tapa Dura con sobrecubierta",
    imagen: `${BASE_URL}/armonia.jpg`,
    stock: 10,
    enOferta: true,
    descuento: 15,
    valoraciones: [
      {
        nombre: "Andrea Ruiz",
        initials: "AR",
        puntuacion: 5,
        comentario:
          "Libro imprescindible para cualquier artista. Las explicaciones son claras y los ejemplos visuales son hermosos.",
        helpful: 7,
        verificada: true,
        fecha: new Date("2026-05-09"),
      },
      {
        nombre: "Miguel Ángel Vargas",
        initials: "MV",
        puntuacion: 4,
        comentario:
          "Muy completo y bien explicado. Solo le falta un poco más de ejercicios prácticos.",
        helpful: 4,
        verificada: false,
        fecha: new Date("2026-05-04"),
      },
    ],
  },
  {
    nombre: "1001 Obras de Arte",
    descripcion:
      "Un recorrido visual impresionante por las obras de arte más importantes de la historia.",
    descripcionCompleta:
      "Desde el Renacimiento hasta el arte contemporáneo, este libro monumental presenta pinturas que han definido y transformado nuestra cultura visual. Cada obra viene acompañada de análisis detallados y contexto histórico.",
    precio: 120000,
    categoria: "Arte",
    autor: "Varios Autores",
    editorial: "Editorial Taschen",
    paginas: 960,
    idioma: "Español España",
    presentacion: "Tapa Dura",
    imagen: `${BASE_URL}/1001-obras.jpg`,
    stock: 3,
    enOferta: false,
    valoraciones: [
      {
        nombre: "Isabel Fernández",
        initials: "IF",
        puntuacion: 5,
        comentario:
          "Una enciclopedia visual impresionante. Las reproducciones son de alta calidad y las explicaciones muy completas.",
        helpful: 10,
        verificada: true,
        fecha: new Date("2026-05-07"),
      },
    ],
  },
  {
    nombre: "Inuyasha",
    descripcion:
      "Una historia de aventuras, romance y batallas en el Japón feudal.",
    descripcionCompleta:
      "Con un equilibrio perfecto entre acción, humor y drama, Inuyasha es una de las obras más queridas de Rumiko Takahashi. Una saga que ha cautivado a generaciones de lectores con su mezcla única de elementos tradicionales japoneses.",
    precio: 60000,
    categoria: "Manga",
    autor: "Rumiko Takahashi",
    editorial: "Planeta Comic",
    paginas: 200,
    idioma: "Español España",
    presentacion: "Tapa Blanda",
    imagen: `${BASE_URL}/inuyasha.jpg`,
    stock: 18,
    enOferta: true,
    descuento: 30,
    valoraciones: [
      {
        nombre: "Valentina Castro",
        initials: "VC",
        puntuacion: 5,
        comentario:
          "Un clásico que nunca pasa de moda. La historia es adictiva y los personajes están muy bien desarrollados.",
        helpful: 14,
        verificada: true,
        fecha: new Date("2026-05-10"),
      },
      {
        nombre: "Andrés Medina",
        initials: "AM",
        puntuacion: 4,
        comentario:
          "Muy buena compra con el descuento. La edición es correcta aunque no es de lujo.",
        helpful: 5,
        verificada: true,
        fecha: new Date("2026-05-06"),
      },
    ],
  },
];

const proveedores = [
  {
    nombre: "Distribuidora Manga Plus",
    contacto: "contacto@mangaplus.com",
    telefono: "555-0101",
    productos: 45,
    ultimoPedido: new Date("2026-05-15"),
    estado: "activo",
  },
  {
    nombre: "Editorial Comics SA",
    contacto: "ventas@comics.com",
    telefono: "555-0202",
    productos: 32,
    ultimoPedido: new Date("2026-05-10"),
    estado: "activo",
  },
  {
    nombre: "Libros de Arte Internacional",
    contacto: "info@artbooks.com",
    telefono: "555-0303",
    productos: 18,
    ultimoPedido: new Date("2026-05-05"),
    estado: "activo",
  },
  {
    nombre: "Importadora Nippon",
    contacto: "pedidos@nippon.com",
    telefono: "555-0404",
    productos: 28,
    ultimoPedido: new Date("2026-04-25"),
    estado: "pendiente",
  },
];

const reglasPrecio = [
  {
    nombre: "Descuento por volumen",
    tipo: "Porcentaje",
    valor: "10%",
    condicion: "Compras > $500.000",
    activo: true,
  },
  {
    nombre: "Promoción manga",
    tipo: "Fijo",
    valor: "$5.000",
    condicion: "Categoría: Manga",
    activo: true,
  },
  {
    nombre: "Cliente frecuente",
    tipo: "Porcentaje",
    valor: "15%",
    condicion: "> 10 pedidos",
    activo: true,
  },
  {
    nombre: "Black Friday",
    tipo: "Porcentaje",
    valor: "30%",
    condicion: "Fecha específica",
    activo: false,
  },
];

const configuracionInicial = {
  clave: "general",
  tienda: {
    nombre: "Mundos de Papel",
    email: "contacto@mundosdepapel.com",
    telefono: "+57 300 123 4567",
    direccion: "Calle 45 #67-89, Bogotá",
  },
  pedidos: {
    pedidoMinimo: 30000,
    envioGratisDesde: 100000,
    costoEnvio: 10000,
    iva: 19,
  },
  inventario: {
    umbralStockBajo: 5,
    umbralStockCritico: 2,
  },
  metodosPago: [
    { nombre: "Tarjeta de crédito/débito", activo: true },
    { nombre: "Transferencia bancaria", activo: true },
    { nombre: "PSE", activo: true },
    { nombre: "Efectivo contra entrega", activo: true },
    { nombre: "Anticipo + saldo", activo: true },
  ],
  notificaciones: [
    {
      nombre: "Stock bajo",
      desc: "Notificar cuando el stock esté por debajo del umbral",
      activo: true,
    },
    {
      nombre: "Nuevos pedidos",
      desc: "Recibir alerta de cada nuevo pedido",
      activo: true,
    },
    {
      nombre: "Pagos pendientes",
      desc: "Alertar sobre pagos pendientes después de 24h",
      activo: true,
    },
    {
      nombre: "Nuevos clientes",
      desc: "Notificar cuando un nuevo cliente se registre",
      activo: false,
    },
    {
      nombre: "Reseñas nuevas",
      desc: "Alertar sobre nuevas reseñas de productos",
      activo: false,
    },
  ],
};

const calcularTotales = (subtotal, costoEnvio, descuentoTotal = 0) => {
  const iva = subtotal * 0.19;
  const total = subtotal + iva + costoEnvio - descuentoTotal;
  return { subtotal, iva, total, descuentoTotal, costoEnvio };
};

const crearItemPedido = (producto, cantidad = 1) => {
  let descuentoProducto = 0;
  let precioFinal = producto.precio;

  if (producto.enOferta && producto.descuento > 0) {
    descuentoProducto = (producto.precio * producto.descuento) / 100;
    precioFinal = producto.precio - descuentoProducto;
  }

  return {
    item: {
      producto: producto._id,
      nombre: producto.nombre,
      cantidad,
      precio: producto.precio,
      descuento: producto.descuento || 0,
      subtotal: precioFinal * cantidad,
    },
    descuentoTotal: descuentoProducto * cantidad,
  };
};

const crearPedidoSeed = (usuario, producto, opciones = {}) => {
  const {
    cantidad = 1,
    estado = "procesando",
    estadoPago = "pagado",
    metodoPago = "tarjeta",
    fecha = new Date(),
    historial = [{ estado: "procesando", fecha, comentario: "Pedido creado" }],
  } = opciones;

  const { item, descuentoTotal } = crearItemPedido(producto, cantidad);
  const costoEnvio = item.subtotal >= 100000 ? 0 : 10000;
  const totales = calcularTotales(item.subtotal, costoEnvio, descuentoTotal);

  return {
    usuario: usuario._id,
    items: [item],
    direccionEnvio: {
      direccion: usuario.direccion,
      telefono: usuario.telefono,
    },
    metodoPago,
    estadoPago,
    estado,
    historial,
    createdAt: fecha,
    updatedAt: fecha,
    ...totales,
  };
};

// Función para importar datos
const importarDatos = async () => {
  try {
    await connectDB();

    console.log("🗑️  Eliminando datos existentes...");
    await Usuario.deleteMany();
    await Producto.deleteMany();
    await Pedido.deleteMany();
    await Proveedor.deleteMany();
    await Alerta.deleteMany();
    await ReglaPrecio.deleteMany();
    await Configuracion.deleteMany();
    await Categoria.deleteMany();
    await Editorial.deleteMany();

    console.log("👥 Creando usuarios...");
    const usuariosCreados = await Usuario.create(usuarios);
    console.log(`✅ ${usuariosCreados.length} usuarios creados`);

    console.log("� Creando categorías...");
    const categoriasCreadas = await Categoria.create(categorias);
    console.log(`✅ ${categoriasCreadas.length} categorías creadas`);

    console.log("🏢 Creando editoriales...");
    const editorialesCreadas = await Editorial.create(editoriales);
    console.log(`✅ ${editorialesCreadas.length} editoriales creadas`);

    // Crear mapa de categorías para buscar por nombre
    const mapaCategorias = {};
    categoriasCreadas.forEach((cat) => {
      mapaCategorias[cat.nombre] = cat._id;
    });

    // Actualizar productos con los IDs de categorías
    const productosActualizados = productos.map((prod) => ({
      ...prod,
      categoria: mapaCategorias[prod.categoria],
    }));

    console.log("📚 Creando productos...");
    const productosCreados = await Producto.create(productosActualizados);

    // Calcular promedio de valoraciones para cada producto
    for (const prod of productosCreados) {
      prod.calcularPromedioValoracion();
      await prod.save();
    }

    console.log(
      `✅ ${productosCreados.length} productos creados con sus reseñas`,
    );

    console.log("📦 Creando pedidos de ejemplo...");
    const buscarUsuario = (email) =>
      usuariosCreados.find((u) => u.email === email);
    const buscarProducto = (nombre) =>
      productosCreados.find((p) => p.nombre === nombre);

    const pedidosData = [
      crearPedidoSeed(
        buscarUsuario("usuario@example.com"),
        buscarProducto("Batman: Hush"),
        {
          estado: "entregado",
          fecha: new Date("2024-04-12"),
          historial: [
            {
              estado: "procesando",
              fecha: new Date("2024-04-12"),
              comentario: "Pedido creado",
            },
            {
              estado: "entregado",
              fecha: new Date("2024-04-15"),
              comentario: "Entregado al cliente",
            },
          ],
        },
      ),
      crearPedidoSeed(
        buscarUsuario("usuario@example.com"),
        buscarProducto("Dragon Ball"),
        {
          estado: "procesando",
          fecha: new Date("2024-03-28"),
        },
      ),
      crearPedidoSeed(
        buscarUsuario("ana@example.com"),
        buscarProducto("Dragon Ball"),
        {
          estado: "entregado",
          estadoPago: "pagado",
          fecha: new Date("2026-05-18"),
        },
      ),
      crearPedidoSeed(
        buscarUsuario("carlos@example.com"),
        buscarProducto("Batman: Hush"),
        {
          estado: "confirmado",
          estadoPago: "pendiente",
          metodoPago: "transferencia",
          fecha: new Date("2026-05-18"),
        },
      ),
      crearPedidoSeed(
        buscarUsuario("laura@example.com"),
        buscarProducto("One Piece"),
        {
          estado: "enviado",
          fecha: new Date("2026-05-17"),
        },
      ),
      crearPedidoSeed(
        buscarUsuario("roberto@example.com"),
        buscarProducto("Inuyasha"),
        {
          estado: "procesando",
          estadoPago: "pendiente",
          fecha: new Date("2026-05-17"),
        },
      ),
      crearPedidoSeed(
        buscarUsuario("maria@example.com"),
        buscarProducto("Pokemon Adventures"),
        {
          estado: "entregado",
          fecha: new Date("2026-05-16"),
        },
      ),
      crearPedidoSeed(
        buscarUsuario("diego@example.com"),
        buscarProducto("Dragon Ball"),
        {
          estado: "procesando",
          fecha: new Date("2026-05-12"),
        },
      ),
      // Pedidos adicionales para clientes frecuentes
      ...Array.from({ length: 11 }, (_, i) =>
        crearPedidoSeed(
          buscarUsuario("laura@example.com"),
          buscarProducto("One Piece"),
          {
            estado: "entregado",
            fecha: new Date(2026, 0, 5 + i),
          },
        ),
      ),
      ...Array.from({ length: 14 }, (_, i) =>
        crearPedidoSeed(
          buscarUsuario("maria@example.com"),
          buscarProducto("Pokemon Adventures"),
          {
            estado: "entregado",
            fecha: new Date(2026, 0, 1 + i),
          },
        ),
      ),
    ];

    const pedidosCreados = await Pedido.create(pedidosData);
    console.log(`✅ ${pedidosCreados.length} pedidos creados`);

    console.log("🏭 Creando proveedores...");
    const proveedoresCreados = await Proveedor.create(proveedores);
    console.log(`✅ ${proveedoresCreados.length} proveedores creados`);

    console.log("💰 Creando reglas de precio...");
    const reglasCreadas = await ReglaPrecio.create(reglasPrecio);
    console.log(`✅ ${reglasCreadas.length} reglas de precio creadas`);

    console.log("⚙️  Creando configuración...");
    await Configuracion.create(configuracionInicial);
    console.log("✅ Configuración creada");

    console.log("🔔 Creando alertas...");
    const alertasData = [
      {
        tipo: "critico",
        titulo: "Stock crítico",
        mensaje: "All-Star Superman tiene solo 2 unidades en stock",
        icono: "ti-alert-circle",
        accion: "Reabastecer",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        tipo: "advertencia",
        titulo: "Pedido pendiente de pago",
        mensaje:
          "Cliente Carlos Méndez debe segundo pago de un pedido reciente",
        icono: "ti-credit-card",
        accion: "Contactar",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        tipo: "advertencia",
        titulo: "Stock bajo",
        mensaje: "1001 Obras de Arte tiene 3 unidades. Umbral: 5",
        icono: "ti-alert-triangle",
        accion: "Revisar",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        tipo: "info",
        titulo: "Nuevo cliente registrado",
        mensaje: "Diego Torres se registró en la plataforma",
        icono: "ti-user-plus",
        accion: "Ver perfil",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        tipo: "info",
        titulo: "Pedido completado",
        mensaje: "Pedido de Ana Torres fue entregado exitosamente",
        icono: "ti-check-circle",
        accion: "Ver detalles",
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      },
      {
        tipo: "advertencia",
        titulo: "Retraso en envío",
        mensaje: "Un pedido de Roberto Silva está retrasado",
        icono: "ti-clock",
        accion: "Actualizar",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    ];
    const alertasCreadas = await Alerta.create(alertasData);
    console.log(`✅ ${alertasCreadas.length} alertas creadas`);

    console.log("\n✅ Datos importados exitosamente");
    console.log("\n📋 Credenciales de prueba:");
    console.log("Admin:");
    console.log("  Email: admin@mundosdepapel.com");
    console.log("  Password: admin123");
    console.log("\nUsuario:");
    console.log("  Email: usuario@example.com");
    console.log("  Password: usuario123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al importar datos:", error);
    process.exit(1);
  }
};

// Función para eliminar datos
const eliminarDatos = async () => {
  try {
    await connectDB();

    console.log("🗑️  Eliminando todos los datos...");
    await Usuario.deleteMany();
    await Producto.deleteMany();
    await Pedido.deleteMany();
    await Proveedor.deleteMany();
    await Alerta.deleteMany();
    await ReglaPrecio.deleteMany();
    await Configuracion.deleteMany();
    await Categoria.deleteMany();
    await Editorial.deleteMany();

    console.log("✅ Datos eliminados exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al eliminar datos:", error);
    process.exit(1);
  }
};

// Ejecutar según el argumento
if (process.argv[2] === "-i" || process.argv[2] === "--import") {
  importarDatos();
} else if (process.argv[2] === "-d" || process.argv[2] === "--delete") {
  eliminarDatos();
} else {
  console.log("Por favor usa:");
  console.log("  pnpm run seed -- -i   (para importar datos)");
  console.log("  pnpm run seed -- -d   (para eliminar datos)");
  process.exit(0);
}
