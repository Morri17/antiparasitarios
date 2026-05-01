const express = require("express");
const cors = require("cors");
const dayjs = require("dayjs");
const db = require("./database");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Calcula el estado según la próxima fecha
function calcStatus(nextDate) {
  const today = dayjs().startOf("day");
  const next = dayjs(nextDate).startOf("day");
  const diff = next.diff(today, "day");

  if (diff < 0) return "Vencido";
  if (diff <= 5) return "Próximo";
  return "Al día";
}

// GET /api/records — listar todos con estado calculado
app.get("/api/records", (req, res) => {
  const rows = db.prepare("SELECT * FROM records ORDER BY next_date ASC").all();
  const records = rows.map((r) => ({ ...r, status: calcStatus(r.next_date) }));
  res.json(records);
});

// POST /api/records — crear nuevo registro
app.post("/api/records", (req, res) => {
  const { client_name, phone, pet_name, pet_type, antiparasitic, last_date, frequency } = req.body;

  if (!client_name || !phone || !pet_name || !pet_type || !antiparasitic || !last_date || !frequency) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  // Calcular próxima fecha sumando la frecuencia (en días) a la última fecha
  const next_date = dayjs(last_date).add(Number(frequency), "day").format("YYYY-MM-DD");

  const stmt = db.prepare(`
    INSERT INTO records (client_name, phone, pet_name, pet_type, antiparasitic, last_date, frequency, next_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(client_name, phone, pet_name, pet_type, antiparasitic, last_date, Number(frequency), next_date);
  const newRecord = db.prepare("SELECT * FROM records WHERE id = ?").get(result.lastInsertRowid);

  res.status(201).json({ ...newRecord, status: calcStatus(newRecord.next_date) });
});

// PUT /api/records/:id — marcar como administrado hoy
app.put("/api/records/:id", (req, res) => {
  const { id } = req.params;
  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(Number(id));

  if (!record) return res.status(404).json({ error: "Registro no encontrado." });

  const today = dayjs().format("YYYY-MM-DD");
  const next_date = dayjs(today).add(record.frequency, "day").format("YYYY-MM-DD");

  db.prepare("UPDATE records SET last_date = ?, next_date = ? WHERE id = ?").run(today, next_date, Number(id));

  const updated = db.prepare("SELECT * FROM records WHERE id = ?").get(Number(id));
  res.json({ ...updated, status: calcStatus(updated.next_date) });
});

// DELETE /api/records/:id — eliminar registro
app.delete("/api/records/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM records WHERE id = ?").run(Number(id));
  if (result.changes === 0) return res.status(404).json({ error: "Registro no encontrado." });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
