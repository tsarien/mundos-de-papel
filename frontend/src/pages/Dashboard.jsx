import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumenView from '../components/admin/ResumenView';
import VentasView from '../components/admin/VentasView';
import InventarioView from '../components/admin/InventarioView';
import PreciosView from '../components/admin/PreciosView';
import ClientesView from '../components/admin/ClientesView';
import ProveedoresView from '../components/admin/ProveedoresView';
import AlertasView from '../components/admin/AlertasView';
import ConfiguracionView from '../components/admin/ConfiguracionView';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('resumen');

  const pages = {
    resumen: { title: 'Resumen general', sub: 'Visión global del negocio', icon: 'ti-layout-dashboard' },
    ventas: { title: 'Ventas', sub: 'Historial y pedidos activos', icon: 'ti-shopping-cart' },
    inventario: { title: 'Inventario', sub: 'Control de stock y productos', icon: 'ti-package' },
    precios: { title: 'Precios', sub: 'Reglas y políticas de precio', icon: 'ti-tag' },
    clientes: { title: 'Clientes', sub: 'Base de datos de compradores', icon: 'ti-users' },
    proveedores: { title: 'Proveedores', sub: 'Directorio y estado de relaciones', icon: 'ti-building-store' },
    alertas: { title: 'Alertas', sub: 'Notificaciones pendientes', icon: 'ti-bell', badge: 3 },
    configuracion: { title: 'Configuración', sub: 'Ajustes del sistema', icon: 'ti-settings' },
  };

  const navigateToView = (view) => {
    setActiveView(view);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Verificar si el usuario es admin
  if (user?.rol !== 'admin') {
    navigate('/');
    return null;
  }

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F5F0]">
      {/* Sidebar */}
      <aside className="w-[200px] bg-white border-r border-black/8 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-[22px] border-b border-black/8">
          <div className="font-serif text-[17px] text-[#1A1814] leading-tight">
            Mundos de Papel
          </div>
          <div className="text-[10px] text-[#9E9890] uppercase tracking-wider mt-0.5">
            AdminPanel
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2.5">
          {/* Principal */}
          <div className="px-4 pt-3 pb-1 text-[9px] uppercase tracking-wider text-[#9E9890] font-medium">
            Principal
          </div>
          <div
            onClick={() => navigateToView('resumen')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'resumen'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.resumen.icon} text-base`}></i>
            Resumen
          </div>
          <div
            onClick={() => navigateToView('ventas')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'ventas'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.ventas.icon} text-base`}></i>
            Ventas
          </div>

          {/* Gestión */}
          <div className="px-4 pt-3 pb-1 text-[9px] uppercase tracking-wider text-[#9E9890] font-medium mt-2">
            Gestión
          </div>
          <div
            onClick={() => navigateToView('inventario')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'inventario'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.inventario.icon} text-base`}></i>
            Inventario
          </div>
          <div
            onClick={() => navigateToView('precios')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'precios'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.precios.icon} text-base`}></i>
            Precios
          </div>
          <div
            onClick={() => navigateToView('clientes')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'clientes'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.clientes.icon} text-base`}></i>
            Clientes
          </div>
          <div
            onClick={() => navigateToView('proveedores')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'proveedores'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.proveedores.icon} text-base`}></i>
            Proveedores
          </div>

          {/* Sistema */}
          <div className="px-4 pt-3 pb-1 text-[9px] uppercase tracking-wider text-[#9E9890] font-medium mt-2">
            Sistema
          </div>
          <div
            onClick={() => navigateToView('alertas')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'alertas'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.alertas.icon} text-base`}></i>
            Alertas
            {pages.alertas.badge > 0 && (
              <span className="ml-auto text-[10px] bg-[#8C1A1A] text-white rounded-full px-1.5 py-0.5">
                {pages.alertas.badge}
              </span>
            )}
          </div>
          <div
            onClick={() => navigateToView('configuracion')}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-all border-l-2 ${
              activeView === 'configuracion'
                ? 'text-[#2D5016] bg-[#EAF0E1] border-[#2D5016] font-medium'
                : 'text-[#6B6560] border-transparent hover:text-[#1A1814] hover:bg-[#F0EDE6]'
            }`}
          >
            <i className={`${pages.configuracion.icon} text-base`}></i>
            Configuración
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-black/8 flex items-center gap-2 text-xs text-[#9E9890]">
          <div className="w-7 h-7 rounded-full bg-[#EAF0E1] flex items-center justify-center text-[11px] font-medium text-[#2D5016]">
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[#1A1814] font-medium truncate">
              {user?.nombre} {user?.apellido}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#6B6560] hover:text-[#1A1814] transition-colors"
            title="Cerrar sesión"
          >
            <i className="ti-logout text-base"></i>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-black/8 px-7 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-serif text-xl text-[#1A1814]">
              {pages[activeView].title}
            </h1>
            <p className="text-xs text-[#9E9890]">
              {pages[activeView].sub}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-[11px] bg-[#F0EDE6] rounded-[10px] px-3 py-1.5 text-[#6B6560]">
              {currentDate}
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] border border-black/14 bg-white text-[#1A1814] text-xs hover:bg-[#F0EDE6] transition-all"
            >
              <i className="ti-home text-sm"></i>
              Ver tienda
            </button>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-[#2D5016] text-white text-xs hover:bg-[#4A7C28] transition-all">
              <i className="ti-plus text-sm"></i>
              Nuevo pedido
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'resumen' && <ResumenView />}
          {activeView === 'ventas' && <VentasView />}
          {activeView === 'inventario' && <InventarioView />}
          {activeView === 'precios' && <PreciosView />}
          {activeView === 'clientes' && <ClientesView />}
          {activeView === 'proveedores' && <ProveedoresView />}
          {activeView === 'alertas' && <AlertasView />}
          {activeView === 'configuracion' && <ConfiguracionView />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
