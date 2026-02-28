import express from "express";
import multer from "multer";
import {
  createConfession,
  getConfessions,
  getUserConfessions,
  likeConfession,
  deleteConfession,
  updateConfession,
} from "../controllers/confessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

// 🔥 IMPORTANT: USER ROUTE FIRST
router.get("/user/:id", getUserConfessions);

// GET ALL
router.get("/", getConfessions);

// CREATE
router.post("/", protect, upload.single("image"), createConfession);

// LIKE
router.put("/:id/like", protect, likeConfession);

// DELETE
router.delete("/:id", protect, deleteConfession);

// EDIT
router.put("/:id", protect, updateConfession);

export default router;