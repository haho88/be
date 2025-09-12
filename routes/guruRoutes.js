import express from "express";
import Guru from "../models/Guru.js";
import auth from "../middleware/auth.js"; // kalau pakai auth
import upload from "../middleware/upload.js"; // kalau ada upload foto
import fs from "fs";
import path from "path";

const router = express.Router();

// ✅ GET semua guru
router.get("/", async (req, res) => {
  try {
    const items = await Guru.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST guru baru
router.post("/", auth, upload.single("foto"), async (req, res) => {
  const obj = { ...req.body };
  if (req.file) obj.foto = req.file.filename;
  const doc = await Guru.create(obj);
  res.json(doc);
});

// ✅ UPDATE guru
router.put("/:id", auth, upload.single("foto"), async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.foto = req.file.filename;
  const u = await Guru.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(u);
});

// ✅ DELETE guru
router.delete("/:id", auth, async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });

    if (guru.foto) {
      const filePath = path.join(process.cwd(), "uploads", guru.foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await guru.deleteOne();
    res.json({ message: "Guru berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
