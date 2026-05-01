const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "antiparasitarios.db"));

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    pet_name TEXT NOT NULL,
    pet_type TEXT NOT NULL CHECK(pet_type IN ('Perro', 'Gato')),
    antiparasitic TEXT NOT NULL,
    last_date TEXT NOT NULL,
    frequency INTEGER NOT NULL CHECK(frequency IN (30, 60, 90)),
    next_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
