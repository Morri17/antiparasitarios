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

export default function RecordTable({ records, onAdminister, onDelete, onWhatsApp }) {
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
              <th className="px-4 py-3 text-left">Última fecha</th>
              <th className="px-4 py-3 text-left">Próxima fecha</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r) => (
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
                <td className="px-4 py-3 font-medium">
                  {dayjs(r.next_date).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <ActionButtons r={r} onAdminister={onAdminister} onDelete={onDelete} onWhatsApp={onWhatsApp} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil: tarjetas */}
      <div className="md:hidden space-y-3">
        {records.map((r) => (
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
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <ActionButtons r={r} onAdminister={onAdminister} onDelete={onDelete} onWhatsApp={onWhatsApp} />
            </div>
          </div>
        ))}
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

function ActionButtons({ r, onAdminister, onDelete, onWhatsApp }) {
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
        onClick={() => onDelete(r.id)}
        title="Eliminar registro"
        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg transition"
      >
        🗑
      </button>
    </div>
  );
}
