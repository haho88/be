import express from "express";
import multer from "multer";
import path from "path";
import { getAllStaf, createStaf } from "../controllers/guru/stafController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/", getAllStaf);
router.post("/", upload.single("foto"), createStaf);

export default router;
