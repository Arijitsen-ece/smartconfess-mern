import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import confessionRoutes from "./routes/confessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();

// Required for ES modules (__dirname fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists (VERY IMPORTANT for Render)
import fs from "fs";
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Serve static uploads
app.use("/uploads", express.static(uploadsPath));

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.status(200).json({ message: "SmartConfess API Running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/confessions", confessionRoutes);
app.use("/api/users", userRoutes);

// ================= ERROR HANDLER =================
app.use(notFound);
app.use(errorHandler);

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});