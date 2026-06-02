import { useState } from 'react';

const InventarioView = () => {
  const [filterCategoria, setFilterCategoria] = useState('todos');
  
  const productos = [
    { id: 1, nombre: 'Dragon Ball Vol. 1', categoria: 'Manga', precio: 60000, stock: 15, estado: 'ok' },
    { id: 2, nombre: 'Batman: Hush', categoria: 'Cómic', precio: 80000, stock: 8, estado: 'ok' },
    { id: 3, nombre: 'Pokemon Adventures', categoria: 'Manga', precio: 80000, stock: 12, estado: 'ok' },
    { id: 4, nombre: 'One Piece Vol. 3', categoria: 'Manga', precio: 60000, stock: 20, estado: 'ok' },
    { id: 5, nombre: 'All-Star Superman', categoria: 'Cómic', precio: 80000, stock: 2, estado: 'low' },
    { id: 6, nombre: 'Armonía de Color', categoria: 'Arte', precio: 120000, stock: 10, estado: 'ok' },
    { id: 7, nombre: '1001 Obras de Arte', categoria: 'Arte', precio: 120000, stock: 3, estado: 'low' },
    { id: 8, nombre: 'Inuyasha Vol. 12', categoria: 'Manga', precio: 60000, stock: 18, estado: 'ok' },
  ];

  const productosFiltrados = filterCategoria === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria === filterCategoria);

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Métricas de inventario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Total productos
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {productos.length}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            En catálogo
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Stock total
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            {productos.reduce((acc, p) => acc + p.stock, 0)}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Unidades
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-red-500/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Stock bajo
          </div>
          <div className="font-poppins font-bold text-2xl text-red-400">
            {productos.filter(p => p.estado === 'low').length}
          </div>
          <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider mt-2.5">
            Requieren reorden
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 shadow-soft">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Valor inventario
          </div>
          <div className="font-poppins font-bold text-2xl text-white">
            ${(productos.reduce((acc, p) => acc + (p.precio * p.stock), 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
            Costo total
          </div>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Control de inventario
          </div>
          <div className="flex gap-2">
            <select 
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-[#232632] text-white focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              <option value="todos" className="bg-[#232632] text-white">Todas las categorías</option>
              <option value="Manga" className="bg-[#232632] text-white">Manga</option>
              <option value="Cómic" className="bg-[#232632] text-white">Cómic</option>
              <option value="Arte" className="bg-[#232632] text-white">Arte</option>
            </select>
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:opacity-90 hover:shadow-md transition-all border-none cursor-pointer">
              + Agregar producto
            </button>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">Producto</th>
              <th className="text-left pb-2 font-bold tracking-wider">Categoría</th>
              <th className="text-right pb-2 font-bold tracking-wider">Precio</th>
              <th className="text-right pb-2 font-bold tracking-wider">Stock</th>
              <th className="text-right pb-2 font-bold tracking-wider">Estado</th>
              <th className="text-right pb-2 font-bold tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-2.5">
                  <div className="font-semibold text-white">{producto.nombre}</div>
                </td>
                <td className="py-2.5 text-gray-300">{producto.categoria}</td>
                <td className="py-2.5 text-right font-bold text-white">
                  ${producto.precio.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {producto.stock}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    producto.estado === 'ok' 
                      ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
                      : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {producto.estado === 'ok' ? 'Normal' : 'Bajo'}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Editar"
                    >
                      <i className="ti-pencil text-sm"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      title="Ajustar stock"
                    >
                      <i className="ti-plus text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribución por categoría */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Distribución por categoría
        </div>
        <div className="space-y-4">
          {['Manga', 'Cómic', 'Arte'].map((categoria) => {
            const count = productos.filter(p => p.categoria === categoria).length;
            const total = productos.length;
            const pct = (count / total) * 100;
            return (
              <div key={categoria} className="flex items-center gap-4">
                <div className="text-xs font-semibold text-gray-300 w-16">{categoria}</div>
                <div className="flex-1 h-2 bg-[#13151b] rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-accent-blue rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(126,195,230,0.5)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-gray-400 w-16 text-right">
                  {count} ({pct.toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventarioView;
