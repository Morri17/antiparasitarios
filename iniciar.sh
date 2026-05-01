#!/bin/bash

echo "Iniciando Antiparasitarios..."

# Iniciar backend en segundo plano
cd "$(dirname "$0")/backend"
node server.js &
BACKEND_PID=$!

# Esperar a que el backend levante
sleep 2

# Iniciar frontend en segundo plano
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!

sleep 3

echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Abriendo navegador..."
open http://localhost:5173

echo ""
echo "Presioná Ctrl+C para detener todo."

# Al hacer Ctrl+C, cierra ambos procesos
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
