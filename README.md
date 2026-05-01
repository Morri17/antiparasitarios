# 🐾 Antiparasitarios — Recordatorios para Mascotas

App web para gestionar recordatorios de antiparasitarios de clientes con mascotas.

## Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Base de datos**: SQLite (archivo local `backend/antiparasitarios.db`)
- **Fechas**: dayjs

---

## Instalación (primera vez)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Iniciar la app

### Opción A — Doble clic (Windows)
Ejecutar el archivo `iniciar.bat` en la raíz del proyecto.

### Opción B — Manual (dos terminales)

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# Corre en http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Corre en http://localhost:5173
```

Luego abrir http://localhost:5173 en el navegador.

---

## Funcionalidades

| Función | Descripción |
|---------|-------------|
| ➕ Nuevo registro | Carga cliente, mascota, antiparasitario, fecha y frecuencia |
| 📅 Cálculo automático | La próxima fecha se calcula sola (última fecha + frecuencia) |
| 📊 Estados | Al día / Próximo a vencer (≤5 días) / Vencido |
| 📲 WhatsApp | Genera mensaje prellenado y abre WhatsApp Web |
| ✔ Administrado | Actualiza la fecha de última aplicación a hoy |
| 🔍 Búsqueda | Por nombre de cliente o mascota |
| 🗂 Filtros | Por estado: Todos / Al día / Próximo / Vencido |
| 📱 Responsive | Funciona en celular con vista de tarjetas |

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/records` | Listar todos los registros |
| POST | `/api/records` | Crear nuevo registro |
| PUT | `/api/records/:id` | Marcar como administrado hoy |
| DELETE | `/api/records/:id` | Eliminar registro |

---

## Lógica de fechas

- **Próxima fecha** = `last_date + frequency (días)`
- **Estado**:
  - `Vencido`: próxima fecha < hoy
  - `Próximo`: próxima fecha entre hoy y hoy+5 días
  - `Al día`: más de 5 días para la próxima fecha
- Al marcar "Administrado": `last_date = hoy`, `next_date = hoy + frequency`
