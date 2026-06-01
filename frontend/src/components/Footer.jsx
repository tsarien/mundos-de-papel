import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-bg-light text-gray-300 py-10 mt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap gap-8 items-center justify-between">
          {/* Social */}
          <div className="flex gap-5">
            <a 
              href="#" 
              className="text-accent-blue font-semibold no-underline hover:text-accent-pink transition-colors duration-200"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a 
              href="#" 
              className="text-accent-blue font-semibold no-underline hover:text-accent-pink transition-colors duration-200"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a 
              href="#" 
              className="text-accent-blue font-semibold no-underline hover:text-accent-pink transition-colors duration-200"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-5">
            <Link 
              to="/contacto" 
              className="text-gray-300 no-underline hover:text-accent-blue transition-colors duration-200"
            >
              Contacto
            </Link>
            <Link 
              to="/terminos" 
              className="text-gray-300 no-underline hover:text-accent-blue transition-colors duration-200"
            >
              Términos
            </Link>
            <Link 
              to="/politicas" 
              className="text-gray-300 no-underline hover:text-accent-blue transition-colors duration-200"
            >
              Políticas
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left mt-4 md:mt-0">
            &copy; 2024 Mundos de Papel. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
