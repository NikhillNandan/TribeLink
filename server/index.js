const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database('./tribelink.db', (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log("📦 Connected to the TribeLink SQLite Database.");
});

// Setup Tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS matches (
    room_id TEXT PRIMARY KEY,
    team TEXT,
    fan1_id TEXT,
    fan2_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    room_id TEXT,
    sender_id TEXT,
    text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST"],
  },
});

// In-memory state for lightning-fast matching
const queues = {}; // e.g. { CSK: [{ socket, visitorId, fanCode }], MI: [] }
const activeRooms = {}; // maps socket.id to their current roomId

io.on("connection", (socket) => {
  console.log(`⚡ Fan connected: ${socket.id}`);

  socket.on("join_queue", ({ team, visitorId, fanCode }) => {
    console.log(`[Queue] Fan ${fanCode} joining ${team} queue`);
    
    if (!queues[team]) queues[team] = [];

    // Find any waiting fan of the same team
    let waitingFanIndex = queues[team].findIndex((f) => f.visitorId !== visitorId);

    if (waitingFanIndex !== -1) {
      // Match found!
      const opponent = queues[team].splice(waitingFanIndex, 1)[0];
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Join both to the room
      socket.join(roomId);
      opponent.socket.join(roomId);

      // Save room state
      activeRooms[socket.id] = roomId;
      activeRooms[opponent.socket.id] = roomId;

      // Save Match to SQLite Database
      db.run(`INSERT INTO matches (room_id, team, fan1_id, fan2_id) VALUES (?, ?, ?, ?)`, 
        [roomId, team, visitorId, opponent.visitorId], (err) => {
          if (err) console.error("Error saving match:", err.message);
          else console.log(`💾 Saved Match to DB: ${roomId}`);
      });

      // Notify both fans
      socket.emit("match_found", { roomId, opponentFanCode: opponent.fanCode, opponentId: opponent.visitorId });
      opponent.socket.emit("match_found", { roomId, opponentFanCode: fanCode, opponentId: visitorId });

      console.log(`[Match] ${fanCode} matched with ${opponent.fanCode} in ${roomId}`);
    } else {
      // No match found, add to queue
      // First ensure they aren't already in the queue
      queues[team] = queues[team].filter(f => f.visitorId !== visitorId);
      queues[team].push({ socket, visitorId, fanCode });
    }
  });

  socket.on("send_message", ({ text }) => {
    const roomId = activeRooms[socket.id];
    if (roomId) {
      const msgId = Date.now().toString();

      // Save Message to SQLite Database
      db.run(`INSERT INTO messages (id, room_id, sender_id, text) VALUES (?, ?, ?, ?)`,
        [msgId, roomId, socket.id, text], (err) => {
          if (err) console.error("Error saving message:", err.message);
      });

      // Broadcast to everyone else in the room
      socket.to(roomId).emit("receive_message", {
        id: msgId,
        text,
        sender: "match",
        timestamp: new Date(),
      });
    }
  });

  socket.on("skip_match", ({ team, visitorId, fanCode }) => {
    handleDisconnectOrSkip(socket);
    // Automatically throw them back into the queue for a new match
    if (team) {
      // Simulate slight delay before re-queueing for effect
      setTimeout(() => {
        socket.emit("finding_new_match");
        // Reuse join logic
        if (!queues[team]) queues[team] = [];
        queues[team].push({ socket, visitorId, fanCode });
      }, 500);
    }
  });

  socket.on("disconnect", () => {
    handleDisconnectOrSkip(socket);
    console.log(`🔌 Fan disconnected: ${socket.id}`);
  });

  function handleDisconnectOrSkip(targetSocket) {
    const roomId = activeRooms[targetSocket.id];
    if (roomId) {
      // Notify opponent
      targetSocket.to(roomId).emit("opponent_left");
      
      // Leave room
      targetSocket.leave(roomId);
      delete activeRooms[targetSocket.id];
      
      // The opponent should also leave the room and wait for user action
      io.in(roomId).socketsLeave(roomId);
    }

    // Remove from any queues
    for (const team in queues) {
      queues[team] = queues[team].filter((f) => f.socket.id !== targetSocket.id);
    }
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 TribeLink Live Server running on port ${PORT}`);
});
