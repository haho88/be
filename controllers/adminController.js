// controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
//import KontenBerita from "../models/KontenBerita.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Username tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

export const registerIfNotExist = async () => {
  try {
    const exists = await Admin.findOne({ username: "admin" });
    if (!exists) {
      const hashed = await bcrypt.hash("admin123", 10);
      await Admin.create({ username: "admin", password: hashed });
      console.log("✅ Admin default dibuat: username=admin password=admin123");
    }
  } catch (e) {
    console.error("Gagal buat admin default:", e.message);
  }
};

export const createBerita = async (req, res) => {
  try {
    const { judul, isi, kategori } = req.body;
    const file = req.file;
    const gambar = file ? file.filename : null;

    const berita = await KontenBerita.create({ judul, isi, kategori, gambar });
    res.status(201).json({ message: "Berita dibuat", data: berita });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat berita", error: err.message });
  }
};

export const getBerita = async (req, res) => {
  try {
    const semua = await KontenBerita.find().sort({ createdAt: -1 });
    res.json(semua);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil berita" });
  }
};
