import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("student"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student dashboard access granted",
    user: req.user,
  });
});

export default router;
