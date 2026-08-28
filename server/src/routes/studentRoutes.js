import express from "express";
import {
  getStudentDashboard,
  createSOS,
  getSOSHistory,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All student routes require authentication
router.use(protect);
router.use(authorize("student"));

// Dashboard
router.get("/dashboard", getStudentDashboard);

// SOS
router.post("/sos", createSOS);

// SOS history
router.get("/sos/history", getSOSHistory);

export default router;
