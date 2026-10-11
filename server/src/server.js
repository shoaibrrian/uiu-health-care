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
import mentalHealthRoutes from "./routes/mentalHealthRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import healthPostRoutes from "./routes/healthPostRoutes.js";

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

// Verify JWT before allowing any socket connection
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || user.isActive === false) {
      return next(new Error("Invalid user"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const user = socket.user;

  // Server decides the room, client cannot choose
  if (user.role === "admin") {
    socket.join("admins");
  } else {
    socket.join(`student-${user._id}`);
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${user.email}`);
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
app.use("/api/mental-health", mentalHealthRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/health-posts", healthPostRoutes);

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
