// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";
import { registerIfNotExist } from "./controllers/adminController.js";

dotenv.config();
const app = express();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Setup fix untuk Railway + Vercel
const allowedOrigins = [
  "https://mtsmuhammadiyah-vercel-app.vercel.app", // frontend
  "http://localhost:3000", // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
     preflightContinue: false,
  })
);

app.use(express.json());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", adminRoutes);


// DB connect + admin default
connectDB().then(() => {
  registerIfNotExist();
});

// Root
app.get("/", (req, res) => {
  res.send("🚀 API is running and CORS fixed...");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
