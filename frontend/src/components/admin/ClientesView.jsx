import { formatearFecha } from "../../utils/formatters.js";
import { useAdminData } from "../../hooks/useAdminData";
import StatCard from "./StatCard.jsx";

const ClientesView = () => {
  const { data, loading } = useAdminData("clientes");

  if (loading)
    return <p className="text-gray-400 text-sm">Cargando clientes...</p>;
  if (!data)
    return (
      <p className="text-gray-400 text-sm">
        No se pudieron cargar los clientes.
      </p>
    );

  const { lista: clientes, total, vip, nuevos, valorPromedio } = data;

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total clientes" valor={total} sub="Registrados" />
        <StatCard label="Clientes VIP" valor={vip} sub="+10 pedidos" />
        <StatCard
          label="Nuevos este mes"
          valor={nuevos}
          sub="Recientes"
          subColor="text-accent-green"
        />
        <StatCard
          label="Valor promedio"
          valor={`$${Math.round(valorPromedio / 1000)}K`}
          sub="Por cliente"
        />
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-blue">
            Base de datos de clientes
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase border-b border-white/5">
              <th className="text-left pb-2 font-bold tracking-wider">
                Cliente
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Pedidos
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Total comprado
              </th>
              <th className="text-left pb-2 font-bold tracking-wider">
                Última compra
              </th>
              <th className="text-right pb-2 font-bold tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-2.5">
                  <div className="font-semibold text-white">
                    {cliente.nombre}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {cliente.email}
                  </div>
                </td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {cliente.pedidos}
                </td>
                <td className="py-2.5 text-right font-bold text-white">
                  ${cliente.total.toLocaleString()}
                </td>
                <td className="py-2.5 text-gray-300">
                  {formatearFecha(cliente.ultima)}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      cliente.estado === "VIP"
                        ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                        : cliente.estado === "Nuevo"
                          ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                          : "bg-white/5 text-gray-300 border border-white/5"
                    }`}
                  >
                    {cliente.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="text-xs font-bold uppercase tracking-wider text-accent-purple mb-4 border-b border-white/5 pb-2.5">
          Top clientes por compras
        </div>
        <div className="space-y-3.5 mt-2">
          {clientes.slice(0, 5).map((cliente, index) => (
            <div key={cliente.id} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue border border-accent-blue/20">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-white">
                  {cliente.nombre}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {cliente.pedidos} pedidos
                </div>
              </div>
              <div className="text-xs font-bold text-white">
                ${cliente.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientesView;
