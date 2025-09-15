// routes/profilRoutes.js
import express from "express";
import Profil from "../models/Profil.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ========== MULTER SETUP ==========
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// ========== ROUTES ==========

// GET semua profil (admin dashboard)
router.get("/", async (req, res) => {
  try {
    const data = await Profil.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET berdasarkan type (misal: /profil/sejarah, /profil/visi-misi, dll.)
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const data = await Profil.find({ type: type.toLowerCase() });

    // Kalau kosong jangan 404, balikin array kosong aja
    if (!data || data.length === 0) {
      return res.json([]);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST tambah data
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, title, content } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const doc = await Profil.create({
      type: type.toLowerCase(),
      title,
      content,
      image,
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update data
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.type) body.type = body.type.toLowerCase();
    if (req.file) body.image = req.file.filename;

    const updated = await Profil.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE data + hapus file gambar
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Profil.findByIdAndDelete(req.params.id);

    if (deleted?.image) {
      const filePath = path.join(UPLOAD_DIR, deleted.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Data profil berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== ENDPOINT KHUSUS ==========
router.get("/sejarah/all", async (req, res) => {
  try {
    const data = await Profil.find({ type: "sejarah" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/visi-misi/all", async (req, res) => {
  try {
    const data = await Profil.find({ type: "visi-misi" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/sambutan/all", async (req, res) => {
  try {
    const data = await Profil.find({ type: "sambutan" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/struktur/all", async (req, res) => {
  try {
    const data = await Profil.find({ type: "struktur" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
