import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';
import Producto from '../models/Producto.js';
import Pedido from '../models/Pedido.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    process.exit(1);
  }
};

// Datos de ejemplo para usuarios
const usuarios = [
  {
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@mundosdepapel.com',
    password: 'admin123',
    telefono: '300-111-1111',
    direccion: 'Calle Principal #123',
    rol: 'admin'
  },
  {
    nombre: 'Usuario',
    apellido: 'Demo',
    email: 'usuario@example.com',
    password: 'usuario123',
    telefono: '300-222-2222',
    direccion: 'Carrera 45 #67-89',
    cedula: '1234567890',
    rol: 'usuario'
  }
];

// Datos de ejemplo para productos
const productos = [
  {
    nombre: 'Dragon Ball',
    descripcion: 'Acompaña a Son Goku, un joven guerrero con una fuerza increíble y un corazón puro, en su viaje para reunir las legendarias Esferas del Dragón.',
    descripcionCompleta: 'Con el inconfundible estilo de Akira Toriyama, Dragon Ball combina humor, aventura y acción en una historia que ha inspirado a millones alrededor del mundo. Esta edición recopila los capítulos originales restaurados, junto con ilustraciones exclusivas y detalles del proceso creativo del autor.',
    precio: 60000,
    categoria: 'Manga',
    autor: 'Akira Toriyama',
    editorial: 'Planeta Comic',
    paginas: 240,
    idioma: 'Español España',
    presentacion: 'Tapa Blanda con sobrecubierta',
    imagen: '/productos/dragon-ball.webp',
    stock: 15,
    enOferta: true,
    descuento: 10,
    destacado: true
  },
  {
    nombre: 'Batman: Hush',
    descripcion: 'Sumérgete en las sombras de Gotham con Batman: Hush, una de las historias más aclamadas del Cruzado Enmascarado.',
    descripcionCompleta: 'Este volumen recopila ilustraciones espectaculares de Jim Lee, acompañadas por comentarios exclusivos del equipo creativo y bocetos inéditos que muestran el proceso artístico detrás de cada escena. Descubre los secretos del misterioso enemigo que manipula a los villanos más peligrosos de Gotham.',
    precio: 80000,
    categoria: 'Cómic',
    autor: 'Jim Lee, Jeph Loeb',
    editorial: 'DC Comics / ECC Ediciones',
    paginas: 256,
    idioma: 'Español España',
    presentacion: 'Tapa Dura con sobrecubierta',
    imagen: '/productos/batman.jpg',
    stock: 8,
    enOferta: false,
    destacado: true
  },
  {
    nombre: 'Pokemon Adventures',
    descripcion: 'Embárcate en un viaje lleno de emoción, amistad y batallas épicas con Pokémon Adventures.',
    descripcionCompleta: 'Acompaña a Red, un joven entrenador decidido a convertirse en el mejor, mientras recorre la región de Kanto enfrentando a poderosos rivales, descubriendo los secretos del Team Rocket y fortaleciendo el lazo con sus Pokémon.',
    precio: 80000,
    categoria: 'Manga',
    autor: 'Hidenori Kusaka, Mato',
    editorial: 'Norma Editorial',
    paginas: 192,
    idioma: 'Español España',
    presentacion: 'Tapa Blanda con sobrecubierta',
    imagen: '/productos/pokemon.webp',
    stock: 12,
    enOferta: false,
    destacado: true
  },
  {
    nombre: 'One Piece',
    descripcion: 'Únete a Monkey D. Luffy y su tripulación en la búsqueda del tesoro más grande del mundo: el One Piece.',
    descripcionCompleta: 'Con un arte único y una narrativa envolvente, One Piece es uno de los mangas más exitosos de todos los tiempos. Descubre por qué millones de fans en todo el mundo han seguido esta historia durante décadas.',
    precio: 60000,
    categoria: 'Manga',
    autor: 'Eiichiro Oda',
    editorial: 'Planeta Comic',
    paginas: 200,
    idioma: 'Español España',
    presentacion: 'Tapa Blanda',
    imagen: '/productos/one-piece.jpg',
    stock: 20,
    enOferta: true,
    descuento: 20
  },
  {
    nombre: 'All-Star Superman',
    descripcion: 'Vive la leyenda de Superman como nunca antes en All-Star Superman.',
    descripcionCompleta: 'Tras descubrir que su tiempo en la Tierra llega a su fin, el Último Hijo de Krypton decide dedicar sus últimos días a dejar un legado de esperanza para la humanidad. Con un guion brillante de Grant Morrison y el arte impresionante de Frank Quitely.',
    precio: 80000,
    categoria: 'Cómic',
    autor: 'Grant Morrison, Frank Quitely',
    editorial: 'DC Comics / ECC Ediciones',
    paginas: 320,
    idioma: 'Español España',
    presentacion: 'Tapa Dura con sobrecubierta',
    imagen: '/productos/superman.jpg',
    stock: 6,
    enOferta: true,
    descuento: 25
  },
  {
    nombre: 'Armonia de Color para Artistas',
    descripcion: 'Explora el fascinante mundo del color con esta guía esencial para artistas.',
    descripcionCompleta: 'Descubre cómo los grandes maestros utilizan la luz, la temperatura y el contraste cromático para crear equilibrio y emoción en sus obras. A través de ejemplos ilustrados, paletas sugeridas y ejercicios guiados.',
    precio: 120000,
    categoria: 'Arte',
    autor: 'Laura Méndez',
    editorial: 'ArteStudio Ediciones',
    paginas: 256,
    idioma: 'Español España',
    presentacion: 'Tapa Dura con sobrecubierta',
    imagen: '/productos/armonia.jpg',
    stock: 10,
    enOferta: true,
    descuento: 15
  },
  {
    nombre: '1001 Obras de Arte',
    descripcion: 'Un recorrido visual impresionante por las obras de arte más importantes de la historia.',
    descripcionCompleta: 'Desde el Renacimiento hasta el arte contemporáneo, este libro monumental presenta pinturas que han definido y transformado nuestra cultura visual. Cada obra viene acompañada de análisis detallados y contexto histórico.',
    precio: 120000,
    categoria: 'Arte',
    autor: 'Varios Autores',
    editorial: 'Editorial Taschen',
    paginas: 960,
    idioma: 'Español España',
    presentacion: 'Tapa Dura',
    imagen: '/productos/1001-obras.jpg',
    stock: 5,
    enOferta: false
  },
  {
    nombre: 'Inuyasha',
    descripcion: 'Una historia de aventuras, romance y batallas en el Japón feudal.',
    descripcionCompleta: 'Con un equilibrio perfecto entre acción, humor y drama, Inuyasha es una de las obras más queridas de Rumiko Takahashi. Una saga que ha cautivado a generaciones de lectores con su mezcla única de elementos tradicionales japoneses.',
    precio: 60000,
    categoria: 'Manga',
    autor: 'Rumiko Takahashi',
    editorial: 'Planeta Comic',
    paginas: 200,
    idioma: 'Español España',
    presentacion: 'Tapa Blanda',
    imagen: '/productos/inuyasha.avif',
    stock: 18,
    enOferta: true,
    descuento: 30
  }
];

// Función para importar datos
const importarDatos = async () => {
  try {
    await connectDB();

    console.log('🗑️  Eliminando datos existentes...');
    await Usuario.deleteMany();
    await Producto.deleteMany();
    await Pedido.deleteMany();

    console.log('👥 Creando usuarios...');
    const usuariosCreados = await Usuario.create(usuarios);
    console.log(`✅ ${usuariosCreados.length} usuarios creados`);

    console.log('📚 Creando productos...');
    const productosCreados = await Producto.create(productos);
    console.log(`✅ ${productosCreados.length} productos creados`);

    console.log('✅ Datos importados exitosamente');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Admin:');
    console.log('  Email: admin@mundosdepapel.com');
    console.log('  Password: admin123');
    console.log('\nUsuario:');
    console.log('  Email: usuario@example.com');
    console.log('  Password: usuario123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al importar datos:', error);
    process.exit(1);
  }
};

// Función para eliminar datos
const eliminarDatos = async () => {
  try {
    await connectDB();

    console.log('🗑️  Eliminando todos los datos...');
    await Usuario.deleteMany();
    await Producto.deleteMany();
    await Pedido.deleteMany();

    console.log('✅ Datos eliminados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al eliminar datos:', error);
    process.exit(1);
  }
};

// Ejecutar según el argumento
if (process.argv[2] === '-i' || process.argv[2] === '--import') {
  importarDatos();
} else if (process.argv[2] === '-d' || process.argv[2] === '--delete') {
  eliminarDatos();
} else {
  console.log('Por favor usa:');
  console.log('  npm run seed -- -i   (para importar datos)');
  console.log('  npm run seed -- -d   (para eliminar datos)');
  process.exit(0);
}
