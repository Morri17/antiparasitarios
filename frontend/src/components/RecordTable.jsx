import dayjs from "dayjs";

const STATUS_STYLE = {
  "Al día": "bg-emerald-100 text-emerald-700",
  "Próximo": "bg-amber-100 text-amber-700",
  "Vencido": "bg-red-100 text-red-700",
};

const STATUS_ICON = {
  "Al día": "✅",
  "Próximo": "⏰",
  "Vencido": "❌",
};

function daysLabel(nextDate) {
  const diff = dayjs(nextDate).startOf("day").diff(dayjs().startOf("day"), "day");
  if (diff === 0) return { text: "Hoy", color: "text-amber-600 font-semibold" };
  if (diff === 1) return { text: "Mañana", color: "text-amber-500" };
  if (diff > 0) return { text: `en ${diff} días`, color: "text-emerald-600" };
  if (diff === -1) return { text: "Ayer", color: "text-red-500" };
  return { text: `hace ${Math.abs(diff)} días`, color: "text-red-600 font-semibold" };
}

export default function RecordTable({ records, onAdminister, onDelete, onWhatsApp, onEdit }) {
  return (
    <>
      {/* Vista escritorio: tabla con scroll horizontal contenido */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Mascota</th>
                <th className="px-4 py-3 text-left">Antiparasitario</th>
                <th className="px-4 py-3 text-left">Última</th>
                <th className="px-4 py-3 text-left">Próxima</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r) => {
                const days = daysLabel(r.next_date);
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 max-w-[160px]">
                      <div className="font-medium truncate">{r.client_name}</div>
                      <div className="text-gray-400 text-xs truncate">{r.phone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="mr-1">{r.pet_type === "Perro" ? "🐶" : "🐱"}</span>
                      {r.pet_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{r.antiparasitic}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {dayjs(r.last_date).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{dayjs(r.next_date).format("DD/MM/YYYY")}</div>
                      <div className={`text-xs ${days.color}`}>{days.text}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ActionButtons r={r} onAdminister={onAdminister} onDelete={onDelete} onWhatsApp={onWhatsApp} onEdit={onEdit} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista móvil: tarjetas */}
      <div className="md:hidden space-y-3">
        {records.map((r) => {
          const days = daysLabel(r.next_date);
          return (
            <div key={r.id} className="bg-white rounded-xl shadow p-4 space-y-3 w-full">
              {/* Fila superior: nombre + badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{r.client_name}</p>
                  <p className="text-xs text-gray-400 truncate">{r.phone}</p>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={r.status} />
                </div>
              </div>

              {/* Info mascota y fechas */}
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-1 min-w-0">
                  <span className="flex-shrink-0">{r.pet_type === "Perro" ? "🐶" : "🐱"}</span>
                  <span className="font-medium truncate">{r.pet_name}</span>
                  <span className="text-gray-400 flex-shrink-0">·</span>
                  <span className="truncate text-gray-500">{r.antiparasitic}</span>
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="text-gray-400">
                    Última: <span className="text-gray-600 font-medium">{dayjs(r.last_date).format("DD/MM/YYYY")}</span>
                  </span>
                  <span className="text-gray-400">
                    Próxima: <span className="text-gray-700 font-semibold">{dayjs(r.next_date).format("DD/MM/YYYY")}</span>
                    <span className={`ml-1 ${days.color}`}>({days.text})</span>
                  </span>
                </div>
              </div>

              {/* Botones en grilla 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onWhatsApp(r)}
                  className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-xs py-2 px-2 rounded-lg transition font-medium"
                >
                  📲 WhatsApp
                </button>
                <button
                  onClick={() => onAdminister(r.id)}
                  className="bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 text-emerald-700 text-xs py-2 px-2 rounded-lg transition font-medium"
                >
                  ✔ Administrado
                </button>
                <button
                  onClick={() => onEdit(r)}
                  className="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 text-xs py-2 px-2 rounded-lg transition font-medium"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => onDelete(r.id)}
                  className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 text-xs py-2 px-2 rounded-lg transition font-medium"
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLE[status]}`}>
      {STATUS_ICON[status]} {status}
    </span>
  );
}

function ActionButtons({ r, onAdminister, onDelete, onWhatsApp, onEdit }) {
  return (
    <div className="flex gap-1 flex-wrap">
      <button
        onClick={() => onWhatsApp(r)}
        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-lg transition"
      >
        📲 WhatsApp
      </button>
      <button
        onClick={() => onAdminister(r.id)}
        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs px-2 py-1 rounded-lg transition"
      >
        ✔ Administrado
      </button>
      <button
        onClick={() => onEdit(r)}
        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-lg transition"
      >
        ✏️ Editar
      </button>
      <button
        onClick={() => onDelete(r.id)}
        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg transition"
      >
        🗑
      </button>
    </div>
  );
}
