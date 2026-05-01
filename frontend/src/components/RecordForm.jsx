import { useState } from "react";
import dayjs from "dayjs";

const EMPTY = {
  client_name: "",
  phone: "",
  pet_name: "",
  pet_type: "Perro",
  antiparasitic: "",
  last_date: dayjs().format("YYYY-MM-DD"),
  frequency: "30",
};

export default function RecordForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");

    // Validación básica
    if (!form.client_name.trim() || !form.phone.trim() || !form.pet_name.trim() || !form.antiparasitic.trim()) {
      setFieldError("Completá todos los campos antes de guardar.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, frequency: Number(form.frequency) });
      setForm(EMPTY);
    } catch (err) {
      setFieldError(err.response?.data?.error || "Error al guardar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fieldError && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {fieldError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre del cliente" required>
          <input
            type="text"
            value={form.client_name}
            onChange={set("client_name")}
            placeholder="Ej: María López"
            className={INPUT}
          />
        </Field>

        <Field label="Teléfono (WhatsApp)" required>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="Ej: 5491112345678"
            className={INPUT}
          />
        </Field>

        <Field label="Nombre de la mascota" required>
          <input
            type="text"
            value={form.pet_name}
            onChange={set("pet_name")}
            placeholder="Ej: Firulais"
            className={INPUT}
          />
        </Field>

        <Field label="Tipo de mascota" required>
          <select value={form.pet_type} onChange={set("pet_type")} className={INPUT}>
            <option value="Perro">🐶 Perro</option>
            <option value="Gato">🐱 Gato</option>
          </select>
        </Field>

        <Field label="Marca / Antiparasitario" required>
          <input
            type="text"
            value={form.antiparasitic}
            onChange={set("antiparasitic")}
            placeholder="Ej: Bravecto, Nexgard, Revolution"
            className={INPUT}
          />
        </Field>

        <Field label="Frecuencia">
          <select value={form.frequency} onChange={set("frequency")} className={INPUT}>
            <option value="30">Cada 30 días</option>
            <option value="60">Cada 60 días</option>
            <option value="90">Cada 90 días</option>
          </select>
        </Field>

        <Field label="Fecha de última aplicación" required>
          <input
            type="date"
            value={form.last_date}
            onChange={set("last_date")}
            max={dayjs().format("YYYY-MM-DD")}
            className={INPUT}
          />
        </Field>
      </div>

      {/* Vista previa de próxima fecha */}
      {form.last_date && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
          📅 Próxima aplicación:{" "}
          <strong>
            {dayjs(form.last_date).add(Number(form.frequency), "day").format("DD/MM/YYYY")}
          </strong>
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {submitting ? "Guardando..." : "Guardar registro"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600 mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}

const INPUT =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white";
