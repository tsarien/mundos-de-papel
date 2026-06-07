import { useState, useEffect } from "react";
import { TbEye } from "react-icons/tb";
import { obtenerMisPedidos } from "../../services/pedidoService";
import { formatearEstadoPedido, formatearFecha } from "../../utils/formatters";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargandoPedidos(true);
        const data = await obtenerMisPedidos();
        setPedidos(data.pedidos || []);
      } catch {
        setPedidos([]);
      } finally {
        setCargandoPedidos(false);
      }
    };

    cargarPedidos();
  }, []);

  return (
    <div>
      <h2 className="font-poppins text-2xl font-bold text-accent-pink mb-6 border-b border-white/5 pb-2">
        Historial de pedidos
      </h2>
      {cargandoPedidos ? (
        <p className="text-gray-400 text-sm">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-gray-400 text-sm">No tienes pedidos registrados.</p>
      ) : (
        <ul className="list-none m-0 p-0 flex flex-col gap-5">
          {pedidos.map((pedido) => {
            const item = pedido.items[0];
            const nombre = item?.nombre || item?.producto?.nombre;
            const imagen = item?.producto?.imagen;
            const estadoLabel = formatearEstadoPedido(pedido.estado);

            return (
              <li
                key={pedido._id}
                className="flex items-center gap-5 bg-[#13151b]/80 border border-white/5 rounded-xl p-5 justify-between hover:border-white/10 transition-all"
              >
                <div className="w-12 h-16 bg-[#232632] flex items-center justify-center p-1 rounded-lg border border-white/5 flex-shrink-0">
                  {imagen && (
                    <img
                      src={imagen}
                      alt={nombre}
                      className="h-full w-auto object-contain"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-accent-blue text-base block">
                    {nombre}
                  </span>
                  <span className="text-accent-pink text-sm mr-3 font-semibold">
                    {formatearFecha(pedido.createdAt)}
                  </span>
                  <span
                    className={`text-xs font-semibold rounded-lg py-1 px-3 ml-2 inline-block ${
                      pedido.estado === "entregado"
                        ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                        : "bg-accent-pink/20 text-accent-pink border border-accent-pink/30"
                    }`}
                  >
                    {estadoLabel}
                  </span>
                </div>
                <button className="bg-transparent text-accent-blue font-bold py-2 px-4 rounded-lg border border-accent-blue/40 cursor-pointer hover:bg-accent-blue hover:text-bg transition-all">
                  <span className="flex items-center gap-2">
                    <TbEye size={18} />
                    Ver detalles
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HistorialPedidos;
