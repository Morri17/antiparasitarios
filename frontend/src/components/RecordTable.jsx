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

// Etiqueta de días restantes/vencidos para mostrar junto a la fecha
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
      {/* Vista escritorio: tabla */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
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
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.client_name}</div>
                    <div className="text-gray-400 text-xs">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="mr-1">{r.pet_type === "Perro" ? "🐶" : "🐱"}</span>
                    {r.pet_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.antiparasitic}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {dayjs(r.last_date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{dayjs(r.next_date).format("DD/MM/YYYY")}</div>
                    <div className={`text-xs ${days.color}`}>{days.text}</div>
                  </td>
                  <td className="px-4 py-3">
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

      {/* Vista móvil: tarjetas */}
      <div className="md:hidden space-y-3">
        {records.map((r) => {
          const days = daysLabel(r.next_date);
          return (
            <div key={r.id} className="bg-white rounded-xl shadow p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{r.client_name}</p>
                  <p className="text-xs text-gray-400">{r.phone}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="mr-1">{r.pet_type === "Perro" ? "🐶" : "🐱"}</span>
                  <strong>{r.pet_name}</strong> — {r.antiparasitic}
                </p>
                <p>
                  Última: <span className="font-medium">{dayjs(r.last_date).format("DD/MM/YYYY")}</span>
                  {" · "}
                  Próxima: <span className="font-medium">{dayjs(r.next_date).format("DD/MM/YYYY")}</span>
                  <span className={`ml-1 text-xs ${days.color}`}>({days.text})</span>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <ActionButtons r={r} onAdminister={onAdminister} onDelete={onDelete} onWhatsApp={onWhatsApp} onEdit={onEdit} />
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
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[status]}`}>
      {STATUS_ICON[status]} {status}
    </span>
  );
}

function ActionButtons({ r, onAdminister, onDelete, onWhatsApp, onEdit }) {
  return (
    <div className="flex gap-1 flex-wrap">
      <button
        onClick={() => onWhatsApp(r)}
        title="Enviar recordatorio por WhatsApp"
        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-lg transition"
      >
        📲 WhatsApp
      </button>
      <button
        onClick={() => onAdminister(r.id)}
        title="Marcar como administrado hoy"
        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs px-2 py-1 rounded-lg transition"
      >
        ✔ Administrado
      </button>
      <button
        onClick={() => onEdit(r)}
        title="Editar registro"
        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-lg transition"
      >
        ✏️ Editar
      </button>
      <button
        onClick={() => onDelete(r.id)}
        title="Eliminar registro"
        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg transition"
      >
        🗑
      </button>
    </div>
  );
}
