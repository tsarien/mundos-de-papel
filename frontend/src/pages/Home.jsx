import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productos } from '../data/productos';

const Home = () => {
  const destacados = productos.slice(0, 3);

  return (
    <div className="mt-[70px]">
      {/* Banner principal */}
      <section className="relative h-[60vh] min-h-[340px] flex items-center justify-center bg-gradient-to-br from-accent-purple to-accent-pink overflow-hidden">
        {/* Overlay con imagen */}
        <div className="absolute inset-0 opacity-20 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Contenido */}
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Explora nuevos <span className="text-accent-pink">mundos</span> en cada página
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Especialistas en cómics, manga y libros de arte para mentes creativas.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destacados.map(producto => (
            <ProductCard key={producto.id} producto={producto} showAddButton={false} />
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 max-w-7xl py-10">
        <h2 className="font-poppins text-3xl font-semibold mb-8 text-accent-pink text-center">
          Categorías
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <Link
            to="/catalogo?categoria=manga"
            className="flex-1 min-w-[200px] max-w-[300px] bg-white rounded-2xl p-10 text-center font-poppins text-xl font-semibold text-bg no-underline shadow-md border-2 border-transparent hover:border-accent-purple hover:bg-accent-purple hover:text-white transition-all duration-200 hover:-translate-y-1 hover:scale-105"
          >
            Manga
          </Link>
          <Link
            to="/catalogo?categoria=comic"
            className="flex-1 min-w-[200px] max-w-[300px] bg-white rounded-2xl p-10 text-center font-poppins text-xl font-semibold text-bg no-underline shadow-md border-2 border-transparent hover:border-accent-blue hover:bg-accent-blue hover:text-white transition-all duration-200 hover:-translate-y-1 hover:scale-105"
          >
            Cómic
          </Link>
          <Link
            to="/catalogo?categoria=arte"
            className="flex-1 min-w-[200px] max-w-[300px] bg-white rounded-2xl p-10 text-center font-poppins text-xl font-semibold text-bg no-underline shadow-md border-2 border-transparent hover:border-accent-pink hover:bg-accent-pink hover:text-white transition-all duration-200 hover:-translate-y-1 hover:scale-105"
          >
            Arte
          </Link>
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
