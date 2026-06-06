import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedAdminRoute from "./components/ui/ProtectedAdminRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import Ofertas from "./pages/Ofertas";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Cuenta from "./pages/Cuenta";
import Dashboard from "./pages/Dashboard";

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-bg text-gray-100">
      <Header />
      <main className="flex-grow pt-[70px]">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rutas públicas con Header y Footer */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />

            <Route
              path="/catalogo"
              element={
                <PublicLayout>
                  <Catalogo />
                </PublicLayout>
              }
            />

            <Route
              path="/producto/:id"
              element={
                <PublicLayout>
                  <ProductoDetalle />
                </PublicLayout>
              }
            />

            <Route
              path="/carrito"
              element={
                <PublicLayout>
                  <Carrito />
                </PublicLayout>
              }
            />

            <Route
              path="/ofertas"
              element={
                <PublicLayout>
                  <Ofertas />
                </PublicLayout>
              }
            />

            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />

            <Route
              path="/registro"
              element={
                <PublicLayout>
                  <Registro />
                </PublicLayout>
              }
            />

            <Route
              path="/cuenta"
              element={
                <PublicLayout>
                  <Cuenta />
                </PublicLayout>
              }
            />

            {/* Ruta del Dashboard (sin Header/Footer, protegida) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* Ruta 404 */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-white mb-4">
                        404
                      </h1>
                      <p className="text-xl text-gray-400 mb-8">
                        Página no encontrada
                      </p>
                      <a
                        href="/"
                        className="bg-accent-blue text-bg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Volver al inicio
                      </a>
                    </div>
                  </div>
                </PublicLayout>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
