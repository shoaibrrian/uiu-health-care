import express from "express";
import { getAllResources, createResource } from "../controllers/mentalHealthController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllResources);
router.post("/", authorize("admin"), createResource);

export default router;
