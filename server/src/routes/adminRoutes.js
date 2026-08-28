import express from "express";

import {
  getAllSOS,
  getPendingSOS,
  getSOSById,
  acknowledgeSOS,
  resolveSOS,
  createAdmin,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// ADMIN SETUP
// =========================
// Used only to create the initial admin account.
// This route does not require authentication.
router.post("/setup", createAdmin);

// =========================
// PROTECTED ADMIN ROUTES
// =========================

router.use(protect);
router.use(authorize("admin"));

// =========================
// SOS MANAGEMENT
// =========================

router.get("/sos", getAllSOS);

router.get("/sos/pending", getPendingSOS);

router.get("/sos/:id", getSOSById);

router.patch("/sos/:id/acknowledge", acknowledgeSOS);

router.patch("/sos/:id/resolve", resolveSOS);

export default router;
