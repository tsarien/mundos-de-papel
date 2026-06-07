const StatCard = ({
  label,
  valor,
  sub,
  subColor = "text-gray-400",
  hoverColor = "hover:border-accent-blue/30",
}) => (
  <div
    className={`glass-panel rounded-2xl p-5 border border-white/5 ${hoverColor} transition-all duration-300 shadow-soft`}
  >
    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="font-poppins font-bold text-2xl text-white">{valor}</div>
    <div
      className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 ${subColor}`}
    >
      {sub}
    </div>
  </div>
);

export default StatCard;
