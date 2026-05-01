const FILTERS = [
  { label: "Todos", color: "bg-gray-100 text-gray-700 hover:bg-gray-200", active: "bg-gray-700 text-white" },
  { label: "Al día", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", active: "bg-emerald-600 text-white" },
  { label: "Próximo", color: "bg-amber-50 text-amber-700 hover:bg-amber-100", active: "bg-amber-500 text-white" },
  { label: "Vencido", color: "bg-red-50 text-red-700 hover:bg-red-100", active: "bg-red-600 text-white" },
];

export default function Stats({ counts, active, onFilter }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {FILTERS.map(({ label, color, active: activeClass }) => (
        <button
          key={label}
          onClick={() => onFilter(label)}
          className={`rounded-xl p-4 text-left transition shadow-sm border ${
            active === label ? activeClass + " border-transparent shadow" : color + " border-gray-200"
          }`}
        >
          <div className="text-2xl font-bold">{counts[label]}</div>
          <div className="text-sm font-medium mt-1">{label}</div>
        </button>
      ))}
    </div>
  );
}
