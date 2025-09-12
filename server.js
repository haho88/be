// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";
import { registerIfNotExist } from "./controllers/adminController.js"; // ✅ import
import profilRoutes from "./routes/profilRoutes.js";
import guruRoutes from "./routes/guruRoutes.js";


dotenv.config();
const app = express();


// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// Middleware
app.use(cors({
  origin: ["https://mtsmuhammadiyah-vercel-app.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Preflight
app.options("*", cors());

app.use(express.json());
;

// Serve file uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/profil", profilRoutes);
app.use("/api/guru", guruRoutes);

// ✅ Connect Mongo lalu buat admin default
connectDB().then(() => {
  registerIfNotExist(); // ⬅️ panggil di sini
});

// Default route (optional, buat test di Railway)
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Jalankan server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
