import express from "express";
import {
  getStudentDashboard,
  createSOS,
  getSOSHistory,
  getMedicalProfile,
  saveMedicalProfile,
  deleteMedicalProfile,
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
router.get("/sos/history", getSOSHistory);

// Medical profile
router.get("/medical-profile", getMedicalProfile);
router.put("/medical-profile", saveMedicalProfile);
router.delete("/medical-profile", deleteMedicalProfile);

export default router;
