import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import firstAidRoutes from "./routes/firstAidRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Connect to MongoDB
await connectDB();

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Admin joins a room to receive all SOS broadcasts
  socket.on("join-admin-room", () => {
    socket.join("admins");
    console.log(`Socket ${socket.id} joined admin room`);
  });

  // Student joins a personal room to receive status updates
  socket.on("join-student-room", (studentId) => {
    socket.join(`student-${studentId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible in controllers via req.app.get("io")
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/first-aid", firstAidRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UIU Health Care API is running",
    timestamp: new Date().toISOString(),
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// Start server (httpServer, not app, so Socket.io works)
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
