const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL requerido en Railway (producción)
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Crea la tabla si no existe (se ejecuta al iniciar el servidor)
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS records (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      pet_name TEXT NOT NULL,
      pet_type TEXT NOT NULL CHECK(pet_type IN ('Perro', 'Gato')),
      antiparasitic TEXT NOT NULL,
      last_date TEXT NOT NULL,
      frequency INTEGER NOT NULL CHECK(frequency IN (30, 60, 90)),
      next_date TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log("Base de datos lista.");
}

module.exports = { pool, initDB };
