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
    <div className="flex flex-col gap-5">
      {/* Métricas de inventario */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Total productos
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {productos.length}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            En catálogo
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Stock total
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {productos.reduce((acc, p) => acc + p.stock, 0)}
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Unidades
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Stock bajo
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            {productos.filter(p => p.estado === 'low').length}
          </div>
          <div className="text-[11px] text-[#8C5A0A] mt-1.5">
            Requieren reorden
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-2xl p-4">
          <div className="text-[11px] text-[#9E9890] uppercase tracking-wider mb-2">
            Valor inventario
          </div>
          <div className="font-serif text-[26px] text-[#1A1814]">
            ${(productos.reduce((acc, p) => acc + (p.precio * p.stock), 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-[#9E9890] mt-1.5">
            Costo total
          </div>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] font-medium text-[#1A1814]">
            Control de inventario
          </div>
          <div className="flex gap-2">
            <select 
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="text-[12px] px-3 py-1.5 rounded-lg border border-black/14 bg-white text-[#1A1814]"
            >
              <option value="todos">Todas las categorías</option>
              <option value="Manga">Manga</option>
              <option value="Cómic">Cómic</option>
              <option value="Arte">Arte</option>
            </select>
            <button className="text-[12px] px-3 py-1.5 rounded-lg bg-[#2D5016] text-white hover:bg-[#4A7C28] transition-colors">
              + Agregar producto
            </button>
          </div>
        </div>

        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] text-[#9E9890] uppercase border-b border-black/8">
              <th className="text-left pb-2 font-medium">Producto</th>
              <th className="text-left pb-2 font-medium">Categoría</th>
              <th className="text-right pb-2 font-medium">Precio</th>
              <th className="text-right pb-2 font-medium">Stock</th>
              <th className="text-right pb-2 font-medium">Estado</th>
              <th className="text-right pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id} className="border-b border-black/8 last:border-0">
                <td className="py-2.5">
                  <div className="font-medium text-[#1A1814]">{producto.nombre}</div>
                </td>
                <td className="py-2.5 text-[#6B6560]">{producto.categoria}</td>
                <td className="py-2.5 text-right font-medium text-[#1A1814]">
                  ${producto.precio.toLocaleString()}
                </td>
                <td className="py-2.5 text-right text-[#1A1814]">
                  {producto.stock}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    producto.estado === 'ok' 
                      ? 'bg-[#EAF3DE] text-[#2D5016]' 
                      : 'bg-[#FDF3E0] text-[#8C5A0A]'
                  }`}>
                    {producto.estado === 'ok' ? 'Normal' : 'Bajo'}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex gap-1 justify-end">
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Editar"
                    >
                      <i className="ti-pencil text-sm text-[#6B6560]"></i>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-lg border border-black/14 flex items-center justify-center hover:bg-[#F0EDE6] transition-colors"
                      title="Ajustar stock"
                    >
                      <i className="ti-plus text-sm text-[#6B6560]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribución por categoría */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Distribución por categoría
        </div>
        <div className="space-y-3">
          {['Manga', 'Cómic', 'Arte'].map((categoria) => {
            const count = productos.filter(p => p.categoria === categoria).length;
            const total = productos.length;
            const pct = (count / total) * 100;
            return (
              <div key={categoria} className="flex items-center gap-3">
                <div className="text-[11px] text-[#6B6560] w-16">{categoria}</div>
                <div className="flex-1 h-[7px] bg-[#F0EDE6] rounded overflow-hidden">
                  <div
                    className="h-full bg-[#2D5016] rounded transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#9E9890] w-12 text-right">
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
