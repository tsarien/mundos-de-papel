import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ producto, showAddButton = true }) => {
  const { addToCart } = useCart();

  const precioFinal = producto.enOferta
    ? producto.precio - (producto.precio * producto.descuento / 100)
    : producto.precio;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(producto, 1);
  };

  return (
    <div className="bg-white rounded-[22px] shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-2 hover:scale-105">
      {/* Imagen */}
      <Link to={`/producto/${producto._id}`}>
        <div
          className="w-full h-48 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${producto.imagen})` }}
        >
          {producto.enOferta && (
            <div className="absolute top-3 left-3 bg-accent-pink text-white text-sm font-bold px-3 py-1 rounded-lg shadow-md">
              -{producto.descuento}%
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3">
        <Link to={`/producto/${producto._id}`} className="no-underline">
          <h3 className="font-poppins text-lg font-bold text-accent-blue m-0 mb-1">
            {producto.nombre}
          </h3>
        </Link>

        <span className="text-sm text-accent-pink font-semibold">
          {producto.categoria}
        </span>

        <div className="flex items-center gap-3">
          {producto.enOferta && (
            <span className="text-base text-gray-400 line-through">
              ${producto.precio.toLocaleString()}
            </span>
          )}
          <span className="text-lg text-accent-purple font-bold">
            ${precioFinal.toLocaleString()}
          </span>
        </div>

        {showAddButton && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-accent-blue text-bg font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-accent-pink mt-2"
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
