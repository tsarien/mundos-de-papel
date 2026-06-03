import { Link } from "react-router-dom";
import {
  TbBrandInstagram,
  TbBrandFacebook,
  TbBrandTwitter,
  TbMail,
  TbFileText,
  TbShieldCheck,
} from "react-icons/tb";

const Footer = () => {
  return (
    <footer className="bg-bg-light text-gray-300 py-10 mt-2">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap gap-8 items-center justify-between">
          {/* Social */}
          <div className="flex gap-5">
            <a
              href="#"
              className="flex items-center gap-1.5 text-accent-blue font-semibold no-underline hover:text-accent-pink transition-colors duration-200"
              aria-label="Instagram"
            >
              <TbBrandInstagram size={18} />
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-accent-blue font-semibold no-underline hover:text-accent-pink transition-colors duration-200"
              aria-label="Facebook"
            >
              <TbBrandFacebook size={18} />
              Facebook
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-accent-blue font-semibold no-underline hover:text-accent-pink transition-colors duration-200"
              aria-label="Twitter"
            >
              <TbBrandTwitter size={18} />
              Twitter
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-5">
            <Link
              to="/contacto"
              className="flex items-center gap-1.5 text-gray-300 no-underline hover:text-accent-blue transition-colors duration-200"
            >
              <TbMail size={16} />
              Contacto
            </Link>
            <Link
              to="/terminos"
              className="flex items-center gap-1.5 text-gray-300 no-underline hover:text-accent-blue transition-colors duration-200"
            >
              <TbFileText size={16} />
              Términos
            </Link>
            <Link
              to="/politicas"
              className="flex items-center gap-1.5 text-gray-300 no-underline hover:text-accent-blue transition-colors duration-200"
            >
              <TbShieldCheck size={16} />
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
