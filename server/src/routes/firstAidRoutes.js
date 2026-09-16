import express from "express";
import {
  getAllGuides,
  createGuide,
  deleteGuide,
} from "../controllers/firstAidController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Any logged-in user can view
router.get("/", getAllGuides);

// Only admin can create/delete
router.post("/", authorize("admin"), createGuide);
router.delete("/:id", authorize("admin"), deleteGuide);

export default router;
