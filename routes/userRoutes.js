import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { followUser } from "../controllers/userController.js";

const router = express.Router();

// FOLLOW / UNFOLLOW
router.put("/follow/:id", protect, followUser);

export default router;