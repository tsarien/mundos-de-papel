import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { productos as todosLosProductos } from '../data/productos';

const Ofertas = () => {
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDescuento, setFiltroDescuento] = useState('');

  // Filtrar productos en oferta
  let productosOferta = todosLosProductos.filter(p => p.enOferta);

  // Aplicar filtros
  if (filtroCategoria) {
    productosOferta = productosOferta.filter(p => 
      p.categoria.toLowerCase() === filtroCategoria.toLowerCase()
    );
  }

  if (filtroDescuento) {
    productosOferta = productosOferta.filter(p => 
      p.descuento >= parseInt(filtroDescuento)
    );
  }

  return (
    <main className="mt-[94px] mb-10 container mx-auto px-4 max-w-7xl">
      <h1 className="font-poppins text-4xl font-bold text-accent-pink mb-9 text-center">
        Ofertas Especiales
      </h1>

      {/* Banner promocional */}
      <section className="bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl shadow-lg mb-10 py-10 px-6 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-poppins text-3xl font-bold mb-4">
            ¡Descuentos de hasta{' '}
            <span className="text-accent-blue text-4xl font-bold">40%</span>{' '}
            en tus libros favoritos!
          </h2>
          <p className="text-lg text-gray-200">
            Promociones por tiempo limitado en manga, cómics y libros de arte. ¡No te lo pierdas!
          </p>
        </div>
      </section>

      {/* Filtros superiores */}
      <form className="flex gap-5 justify-center items-center mb-9 flex-wrap">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="py-3 px-5 rounded-xl border-2 border-gray-300 text-base bg-white text-gray-800 focus:border-accent-pink outline-none transition-colors"
          aria-label="Tipo de oferta"
        >
          <option value="">Tipo de oferta</option>
          <option value="descuento">Descuento</option>
          <option value="2x1">2x1</option>
          <option value="ultimas">Últimas unidades</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="py-3 px-5 rounded-xl border-2 border-gray-300 text-base bg-white text-gray-800 focus:border-accent-pink outline-none transition-colors"
          aria-label="Categoría"
        >
          <option value="">Categoría</option>
          <option value="manga">Manga</option>
          <option value="comic">Cómic</option>
          <option value="arte">Arte</option>
        </select>

        <select
          value={filtroDescuento}
          onChange={(e) => setFiltroDescuento(e.target.value)}
          className="py-3 px-5 rounded-xl border-2 border-gray-300 text-base bg-white text-gray-800 focus:border-accent-pink outline-none transition-colors"
          aria-label="Porcentaje de descuento"
        >
          <option value="">Descuento</option>
          <option value="10">10% o más</option>
          <option value="20">20% o más</option>
          <option value="30">30% o más</option>
        </select>
      </form>

      {/* Productos en oferta */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productosOferta.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-400">No hay productos en oferta con estos filtros</p>
          </div>
        ) : (
          productosOferta.map(producto => (
            <ProductCard key={producto.id} producto={producto} />
          ))
        )}
      </section>
    </main>
  );
};

export default Ofertas;
