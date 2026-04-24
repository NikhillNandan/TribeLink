import { io, Socket } from "socket.io-client";

// Connect to the local Node.js backend
// In production, this will use the Vercel routing, and in dev it will use Vite proxy
const SOCKET_URL = "/";

export const socket: Socket = io(SOCKET_URL, {
  path: "/socket.io/",
  autoConnect: true,
  reconnection: true,
});

// For debugging
socket.on("connect", () => {
  console.log("Connected to live server:", socket.id);
});
