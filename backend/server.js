const express = require("express");
const cors = require("cors");
const dayjs = require("dayjs");
const path = require("path");
const { pool, initDB } = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

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
app.get("/api/records", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM records ORDER BY next_date ASC");
    res.json(rows.map((r) => ({ ...r, status: calcStatus(r.next_date) })));
  } catch {
    res.status(500).json({ error: "Error al obtener registros." });
  }
});

// POST /api/records — crear nuevo registro
app.post("/api/records", async (req, res) => {
  const { client_name, phone, pet_name, pet_type, antiparasitic, last_date, frequency } = req.body;

  if (!client_name || !phone || !pet_name || !pet_type || !antiparasitic || !last_date || !frequency) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const next_date = dayjs(last_date).add(Number(frequency), "day").format("YYYY-MM-DD");

  try {
    const { rows } = await pool.query(
      `INSERT INTO records (client_name, phone, pet_name, pet_type, antiparasitic, last_date, frequency, next_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [client_name, phone, pet_name, pet_type, antiparasitic, last_date, Number(frequency), next_date]
    );
    res.status(201).json({ ...rows[0], status: calcStatus(rows[0].next_date) });
  } catch {
    res.status(500).json({ error: "Error al guardar el registro." });
  }
});

// PUT /api/records/:id — marcar como administrado hoy
app.put("/api/records/:id", async (req, res) => {
  try {
    const { rows: existing } = await pool.query("SELECT * FROM records WHERE id = $1", [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: "Registro no encontrado." });

    const today = dayjs().format("YYYY-MM-DD");
    const next_date = dayjs(today).add(existing[0].frequency, "day").format("YYYY-MM-DD");

    const { rows } = await pool.query(
      "UPDATE records SET last_date = $1, next_date = $2 WHERE id = $3 RETURNING *",
      [today, next_date, req.params.id]
    );
    res.json({ ...rows[0], status: calcStatus(rows[0].next_date) });
  } catch {
    res.status(500).json({ error: "Error al actualizar el registro." });
  }
});

// DELETE /api/records/:id — eliminar registro
app.delete("/api/records/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM records WHERE id = $1", [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: "Registro no encontrado." });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Error al eliminar el registro." });
  }
});

// En producción, Express sirve el frontend compilado
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Inicializar DB y arrancar servidor
initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
    process.exit(1);
  });
