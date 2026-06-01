const ConfiguracionView = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Información general */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Información de la tienda
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-[#9E9890] mb-1.5">
              Nombre de la tienda
            </label>
            <input 
              type="text" 
              defaultValue="Mundos de Papel"
              className="w-full text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#9E9890] mb-1.5">
              Email de contacto
            </label>
            <input 
              type="email" 
              defaultValue="contacto@mundosdepapel.com"
              className="w-full text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#9E9890] mb-1.5">
              Teléfono
            </label>
            <input 
              type="tel" 
              defaultValue="+57 300 123 4567"
              className="w-full text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#9E9890] mb-1.5">
              Dirección
            </label>
            <input 
              type="text" 
              defaultValue="Calle 45 #67-89, Bogotá"
              className="w-full text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814]"
            />
          </div>
        </div>
      </div>

      {/* Configuración de pedidos */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Configuración de pedidos
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-black/8">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Pedido mínimo
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Monto mínimo para realizar un pedido
              </div>
            </div>
            <input 
              type="number" 
              defaultValue="30000"
              className="w-32 text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] text-right"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-black/8">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Envío gratis desde
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Monto mínimo para envío gratuito
              </div>
            </div>
            <input 
              type="number" 
              defaultValue="100000"
              className="w-32 text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] text-right"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-black/8">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Costo de envío
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Costo estándar de envío
              </div>
            </div>
            <input 
              type="number" 
              defaultValue="10000"
              className="w-32 text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] text-right"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                IVA (%)
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Porcentaje de IVA aplicado
              </div>
            </div>
            <input 
              type="number" 
              defaultValue="19"
              className="w-32 text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] text-right"
            />
          </div>
        </div>
      </div>

      {/* Configuración de stock */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Configuración de inventario
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-black/8">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Umbral de stock bajo
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Cantidad mínima antes de alertar
              </div>
            </div>
            <input 
              type="number" 
              defaultValue="5"
              className="w-32 text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] text-right"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Alerta de stock crítico
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Notificar cuando el stock sea menor o igual a este valor
              </div>
            </div>
            <input 
              type="number" 
              defaultValue="2"
              className="w-32 text-[12px] px-3 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] text-right"
            />
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="bg-white border border-black/8 rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#1A1814] mb-4">
          Métodos de pago
        </div>

        <div className="space-y-3">
          {[
            { nombre: 'Tarjeta de crédito/débito', activo: true },
            { nombre: 'Transferencia bancaria', activo: true },
            { nombre: 'PSE', activo: true },
            { nombre: 'Efectivo contra entrega', activo: true },
            { nombre: 'Anticipo + saldo', activo: true },
          ].map((metodo, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-black/8 last:border-0">
              <div className="text-[12px] text-[#1A1814]">
                {metodo.nombre}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked={metodo.activo}
                />
                <div className="w-9 h-5 bg-[#F0EDE6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2D5016]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="bg-white border border-[#8C1A1A] rounded-2xl p-5">
        <div className="text-[13px] font-medium text-[#8C1A1A] mb-4">
          Zona de peligro
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-black/8">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Exportar datos
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Descargar todos los datos del sistema
              </div>
            </div>
            <button className="text-[12px] px-3 py-1.5 rounded-lg border border-black/14 bg-white text-[#1A1814] hover:bg-[#F0EDE6] transition-colors">
              Exportar
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-black/8">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1814] mb-1">
                Limpiar caché
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Eliminar archivos temporales y caché del sistema
              </div>
            </div>
            <button className="text-[12px] px-3 py-1.5 rounded-lg border border-black/14 bg-white text-[#1A1814] hover:bg-[#F0EDE6] transition-colors">
              Limpiar
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#8C1A1A] mb-1">
                Restablecer configuración
              </div>
              <div className="text-[11px] text-[#9E9890]">
                Volver a los valores predeterminados
              </div>
            </div>
            <button className="text-[12px] px-3 py-1.5 rounded-lg bg-[#8C1A1A] text-white hover:bg-[#6B1414] transition-colors">
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end gap-2">
        <button className="text-[12px] px-4 py-2 rounded-lg border border-black/14 bg-white text-[#1A1814] hover:bg-[#F0EDE6] transition-colors">
          Cancelar
        </button>
        <button className="text-[12px] px-4 py-2 rounded-lg bg-[#2D5016] text-white hover:bg-[#4A7C28] transition-colors">
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionView;
