import express from "express";
import {
  getAllPosts,
  createPost,
  deletePost,
} from "../controllers/healthPostController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Any logged-in user can read
router.get("/", getAllPosts);

// Only admin can publish or delete
router.post("/", authorize("admin"), createPost);
router.delete("/:id", authorize("admin"), deletePost);

export default router;
