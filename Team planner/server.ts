import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("planner.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS completed_tasks (
    instanceId TEXT PRIMARY KEY,
    completedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  app.use(cors());
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // API to get initial state
  app.get("/api/completed-tasks", (req, res) => {
    const rows = db.prepare("SELECT instanceId FROM completed_tasks").all();
    res.json(rows.map((row: any) => row.instanceId));
  });

  // WebSocket handling
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("task:toggle", (instanceId: string) => {
      const exists = db.prepare("SELECT 1 FROM completed_tasks WHERE instanceId = ?").get(instanceId);
      
      if (exists) {
        db.prepare("DELETE FROM completed_tasks WHERE instanceId = ?").run(instanceId);
        io.emit("task:removed", instanceId);
      } else {
        db.prepare("INSERT INTO completed_tasks (instanceId) VALUES (?)").run(instanceId);
        io.emit("task:added", instanceId);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
