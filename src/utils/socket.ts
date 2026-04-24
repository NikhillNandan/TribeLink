import { io, Socket } from "socket.io-client";

// In production, you must change this to your Render/Railway backend URL!
// e.g. const SOCKET_URL = import.meta.env.PROD ? "https://your-backend.onrender.com" : "http://localhost:3001";
const SOCKET_URL = import.meta.env.PROD ? "https://tribelink-backend.onrender.com" : "http://localhost:3001";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

// For debugging
socket.on("connect", () => {
  console.log("Connected to live server:", socket.id);
});
