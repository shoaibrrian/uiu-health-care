import express from "express";
import {
  getAllSOS,
  acknowledgeSOS,
  resolveSOS,
  getAllStudents,
  getAdminStats,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/students", getAllStudents);

router.get("/sos", getAllSOS);
router.patch("/sos/:id/acknowledge", acknowledgeSOS);
router.patch("/sos/:id/resolve", resolveSOS);

export default router;
