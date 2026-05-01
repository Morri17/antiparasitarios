import dayjs from "dayjs";
import { useState } from "react";

// Genera el texto del recordatorio
function buildMessage(r) {
  const fecha = dayjs(r.next_date).format("DD/MM/YYYY");
  return `Hola ${r.client_name}! 🐾 Te recordamos que a *${r.pet_name}* (${r.pet_type}) le corresponde su antiparasitario (*${r.antiparasitic}*) el día *${fecha}*. Cualquier consulta, estamos a disposición. ¡Saludos!`;
}

export default function WhatsAppModal({ record, onClose }) {
  const [copied, setCopied] = useState(false);
  const message = buildMessage(record);

  // Número limpio: solo dígitos
  const phone = record.phone.replace(/\D/g, "");
  // URL de WhatsApp Web con mensaje prellenado
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">📲 Recordatorio WhatsApp</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Info del registro */}
        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 space-y-1">
          <p><strong>Cliente:</strong> {record.client_name}</p>
          <p><strong>Mascota:</strong> {record.pet_name} ({record.pet_type})</p>
          <p><strong>Antiparasitario:</strong> {record.antiparasitic}</p>
          <p><strong>Próxima fecha:</strong> {dayjs(record.next_date).format("DD/MM/YYYY")}</p>
        </div>

        {/* Texto del mensaje */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
            Mensaje generado
          </label>
          <textarea
            readOnly
            value={message}
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 resize-none focus:outline-none"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center font-medium py-2 px-4 rounded-xl transition text-sm"
          >
            Abrir en WhatsApp Web
          </a>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
              copied
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {copied ? "✓ Copiado" : "Copiar texto"}
          </button>
        </div>
      </div>
    </div>
  );
}
