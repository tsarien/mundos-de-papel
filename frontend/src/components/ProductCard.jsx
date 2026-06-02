import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { TbShoppingCartPlus } from "react-icons/tb";

const ProductCard = ({ producto, showAddButton = true }) => {
  const { addToCart } = useCart();

  const precioFinal = producto.enOferta
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(producto, 1);
  };

  return (
    <div className="glass-panel rounded-[22px] overflow-hidden transition-all duration-300 hover:border-accent-blue/40 hover:shadow-[0_8px_32px_0_rgba(126,195,230,0.1)] hover:-translate-y-2 group">
      {/* Imagen */}
      <Link to={`/producto/${producto._id}`}>
        <div className="w-full h-56 bg-[#13151b]/80 relative border-b border-white/5 overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.05]"
          />
          {producto.enOferta && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-pink to-accent-purple text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md z-10">
              -{producto.descuento}%
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3">
        <Link to={`/producto/${producto._id}`} className="no-underline">
          <h3 className="font-poppins text-base font-bold text-accent-blue m-0 line-clamp-1 group-hover:text-accent-pink transition-colors">
            {producto.nombre}
          </h3>
        </Link>

        <span className="text-xs text-accent-pink/90 font-semibold tracking-wider uppercase">
          {producto.categoria}
        </span>

        <div className="flex items-center gap-2 mt-1">
          {producto.enOferta && (
            <span className="text-sm text-gray-500 line-through">
              ${producto.precio.toLocaleString()}
            </span>
          )}
          <span className="text-base text-white font-bold">
            ${precioFinal.toLocaleString()}
          </span>
        </div>

        {showAddButton && (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-accent-blue text-bg font-bold py-2.5 px-6 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-accent-blue hover:to-accent-purple hover:text-white hover:shadow-lg mt-2"
          >
            <TbShoppingCartPlus size={18} />
            <span>Agregar al carrito</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
