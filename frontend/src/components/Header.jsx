import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-bg-light shadow-md z-50">
      <div className="container mx-auto px-4 h-full max-w-7xl">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-accent-blue bg-white">
              <div className="w-full h-full bg-gradient-to-br from-accent-purple to-accent-pink" />
            </div>
            <span className="font-poppins font-bold text-xl tracking-wide text-accent-blue">
              Mundos de Papel
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-8 list-none m-0 p-0">
              <li>
                <Link
                  to="/"
                  className={`text-gray-100 no-underline font-medium text-base pb-1.5 border-b-2 transition-all duration-200
                    ${isActive('/') 
                      ? 'text-accent-blue border-accent-blue' 
                      : 'border-transparent hover:text-accent-blue hover:border-accent-blue'
                    }`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className={`text-gray-100 no-underline font-medium text-base pb-1.5 border-b-2 transition-all duration-200
                    ${isActive('/catalogo') 
                      ? 'text-accent-blue border-accent-blue' 
                      : 'border-transparent hover:text-accent-blue hover:border-accent-blue'
                    }`}
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/ofertas"
                  className={`text-gray-100 no-underline font-medium text-base pb-1.5 border-b-2 transition-all duration-200
                    ${isActive('/ofertas') 
                      ? 'text-accent-blue border-accent-blue' 
                      : 'border-transparent hover:text-accent-blue hover:border-accent-blue'
                    }`}
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  to="/cuenta"
                  className={`text-gray-100 no-underline font-medium text-base pb-1.5 border-b-2 transition-all duration-200
                    ${isActive('/cuenta') 
                      ? 'text-accent-blue border-accent-blue' 
                      : 'border-transparent hover:text-accent-blue hover:border-accent-blue'
                    }`}
                >
                  Mi Cuenta
                </Link>
              </li>
              <li className="relative">
                <Link
                  to="/carrito"
                  className={`text-gray-100 no-underline font-medium text-base pb-1.5 border-b-2 transition-all duration-200
                    ${isActive('/carrito') 
                      ? 'text-accent-blue border-accent-blue' 
                      : 'border-transparent hover:text-accent-blue hover:border-accent-blue'
                    }`}
                >
                  Carrito
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-accent-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-100 text-2xl">☰</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
