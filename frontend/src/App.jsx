import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RecordForm from "./components/RecordForm";
import RecordTable from "./components/RecordTable";
import WhatsAppModal from "./components/WhatsAppModal";
import EditModal from "./components/EditModal";
import Stats from "./components/Stats";
import ToastContainer from "./components/Toast";
import useToast from "./hooks/useToast";

const API = "/api/records";

export default function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [whatsappRecord, setWhatsappRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchRecords = useCallback(async () => {
    try {
      setError(null);
      const { data } = await axios.get(API);
      setRecords(data);
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleAdd = async (formData) => {
    const { data } = await axios.post(API, formData);
    setRecords((prev) => [...prev, data].sort((a, b) => a.next_date.localeCompare(b.next_date)));
    setShowForm(false);
    addToast("Registro guardado correctamente");
  };

  const handleEdit = async (id, formData) => {
    const { data } = await axios.patch(`${API}/${id}`, formData);
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? data : r)).sort((a, b) => a.next_date.localeCompare(b.next_date))
    );
    setEditingRecord(null);
    addToast("Registro actualizado correctamente");
  };

  const handleAdminister = async (id) => {
    const { data } = await axios.put(`${API}/${id}`);
    setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));
    addToast("Marcado como administrado hoy");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    await axios.delete(`${API}/${id}`);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    addToast("Registro eliminado", "info");
  };

  const filtered = records.filter((r) => {
    const matchStatus = filterStatus === "Todos" || r.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q || r.client_name.toLowerCase().includes(q) || r.pet_name.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const statusCounts = {
    Todos: records.length,
    "Al día": records.filter((r) => r.status === "Al día").length,
    Próximo: records.filter((r) => r.status === "Próximo").length,
    Vencido: records.filter((r) => r.status === "Vencido").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md w-full">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl flex-shrink-0">🐾</span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold leading-tight truncate">
                Antiparasitarios
              </h1>
              <p className="text-emerald-100 text-xs hidden sm:block">Recordatorios para mascotas</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-emerald-700 font-semibold px-3 py-2 rounded-lg shadow hover:bg-emerald-50 transition text-sm flex-shrink-0"
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 w-full">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-base font-semibold mb-4 text-gray-700">Nuevo registro</h2>
            <RecordForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <Stats counts={statusCounts} active={filterStatus} onFilter={setFilterStatus} />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar cliente o mascota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 px-2 flex-shrink-0">
              ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm px-4">
            {records.length === 0
              ? 'No hay registros. Tocá "+ Nuevo" para empezar.'
              : "No hay registros que coincidan."}
          </div>
        ) : (
          <RecordTable
            records={filtered}
            onAdminister={handleAdminister}
            onDelete={handleDelete}
            onWhatsApp={setWhatsappRecord}
            onEdit={setEditingRecord}
          />
        )}
      </main>

      {whatsappRecord && (
        <WhatsAppModal record={whatsappRecord} onClose={() => setWhatsappRecord(null)} />
      )}

      {editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={(formData) => handleEdit(editingRecord.id, formData)}
          onClose={() => setEditingRecord(null)}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
