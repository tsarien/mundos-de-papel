import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// Layout
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Ofertas from './pages/Ofertas';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Cuenta from './pages/Cuenta';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rutas públicas con Header y Footer */}
            <Route path="/" element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } />
            
            <Route path="/catalogo" element={
              <>
                <Header />
                <Catalogo />
                <Footer />
              </>
            } />
            
            <Route path="/producto/:id" element={
              <>
                <Header />
                <ProductoDetalle />
                <Footer />
              </>
            } />
            
            <Route path="/carrito" element={
              <>
                <Header />
                <Carrito />
                <Footer />
              </>
            } />
            
            <Route path="/ofertas" element={
              <>
                <Header />
                <Ofertas />
                <Footer />
              </>
            } />
            
            <Route path="/login" element={
              <>
                <Header />
                <Login />
                <Footer />
              </>
            } />
            
            <Route path="/registro" element={
              <>
                <Header />
                <Registro />
                <Footer />
              </>
            } />
            
            <Route path="/cuenta" element={
              <>
                <Header />
                <Cuenta />
                <Footer />
              </>
            } />

            {/* Ruta del Dashboard (sin Header/Footer, protegida) */}
            <Route path="/admin/dashboard" element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } />

            {/* Ruta 404 */}
            <Route path="*" element={
              <>
                <Header />
                <div className="min-h-screen bg-bg flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
                    <a href="/" className="bg-accent-blue text-bg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      Volver al inicio
                    </a>
                  </div>
                </div>
                <Footer />
              </>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
