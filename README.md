# Over-Capacity — Multijugador v7

## Probar en el mismo computador/red
1. Instala Node.js.
2. En esta carpeta ejecuta `npm install`.
3. Ejecuta `npm start`.
4. Abre `index.html` en dos a cuatro navegadores/pestañas.
5. Pulsa **Multijugador**, deja `ws://localhost:8080`, usa la misma sala (por ejemplo `COCINA1`) y nombres diferentes.

## Publicarlo en internet
GitHub Pages sirve el `index.html`, pero el servidor WebSocket debe estar desplegado aparte. Usa el contenido de esta carpeta en un servicio que soporte Node.js/WebSocket y luego coloca su dirección `wss://...` en el campo **Servidor WebSocket** del juego.

## Protocolo
- Máximo 4 jugadores por sala.
- El servidor asigna J1, J2, J3 y J4.
- Cada cliente mueve solo su personaje cuando está conectado.
- Las posiciones y acciones se sincronizan.
- El primer jugador actúa como host y envía snapshots del estado de producción.
