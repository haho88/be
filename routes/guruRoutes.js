import express from "express";
import multer from "multer";
import path from "path";
import { getAllGuru, createGuru } from "../controllers/guru/guruController.js";

const router = express.Router();

// setup upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/", getAllGuru);
router.post("/", upload.single("foto"), createGuru);

export default router;
