import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { obtenerProductos } from "../services/productoService";
import { obtenerCategorias } from "../services/catalogoService";

const Home = () => {
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          obtenerProductos({ destacado: true, limite: 3 }),
          obtenerCategorias(),
        ]);
        setDestacados(productosData.productos);
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div>
      {/* Banner principal */}
      <section className="relative h-[60vh] min-h-[340px] flex items-center justify-center bg-gradient-to-br from-accent-purple to-accent-pink overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Explora nuevos <span className="text-accent-pink">mundos</span> en
            cada página
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Especialistas en cómics, manga y libros de arte para mentes
            creativas.
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-accent-blue text-bg font-semibold py-3 px-8 rounded-2xl no-underline shadow-lg hover:bg-accent-pink transition-all duration-200"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Destacados */}
      <section className="container mx-auto px-4 max-w-7xl py-14">
        <h2 className="font-poppins text-3xl font-semibold mb-8 text-accent-purple text-center">
          Destacados
        </h2>
        {loading ? (
          <p className="text-center text-gray-400 text-xl">
            Cargando destacados...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destacados.map((producto) => (
              <ProductCard
                key={producto._id}
                producto={producto}
                showAddButton={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 max-w-7xl py-2">
        <h2 className="font-poppins text-3xl font-semibold mb-8 text-accent-pink text-center">
          Categorías
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalogo?categoria=${cat._id}`}
                className="flex-1 min-w-[200px] max-w-[300px] glass-panel rounded-2xl p-10 text-center font-poppins text-xl font-bold text-accent-purple no-underline hover:border-accent-purple hover:shadow-[0_8px_32px_0_rgba(182,166,230,0.15)] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
              >
                {cat.nombre}
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400">Cargando categorías...</p>
          )}
        </div>
      </section>

      {/* Promoción */}
      <section className="bg-gradient-to-br from-accent-pink to-accent-purple py-10 mt-10">
        <div className="container mx-auto px-4 max-w-7xl text-center text-bg">
          <h2 className="font-poppins text-3xl font-bold mb-4">
            ¡Promoción especial!
          </h2>
          <p className="text-lg mb-6">
            Envío gratis en compras superiores a $100.000. ¡Aprovecha ahora!
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-accent-blue text-bg font-semibold py-3 px-8 rounded-2xl no-underline hover:bg-white transition-all duration-200"
          >
            Comprar ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
