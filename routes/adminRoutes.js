// routes/adminRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

import Admin from "../models/Admin.js";
import Profil from "../models/Profil.js";
import VisiMisi from "../models/VisiMisi.js";
import Sambutan from "../models/Sambutan.js";
import Fasilitas from "../models/Fasilitas.js";
import StrukturOrganisasi from "../models/StrukturOrganisasi.js";
import Guru from "../models/Guru.js";
import Staf from "../models/Staf.js";
import Siswa from "../models/Siswa.js";
import Alumni from "../models/Alumni.js";
import Berita from "../models/Berita.js";
import Galeri from "../models/Galeri.js";
import Pengumuman from "../models/Pengumuman.js";
import PPDB from "../models/PPDB.js";


const router = express.Router();

// ========== MULTER SETUP ===========
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// ========== AUTH MIDDLEWARE ===========
const auth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

// register (optional) - protect in production
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: "Admin exists" });
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hash });
    res.json({ message: "Admin created", admin: { id: admin._id, username: admin.username }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "User not found" });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: "Wrong password" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== UPLOAD ENDPOINT ===========
router.post("/upload", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// ========== CRUD GENERIC HELPERS (for clarity we implement separately) ===========
// -------------- SEJARAH --------------- \\
// Create
router.post("/sejarah", async (req, res) => {
  try {
    const { isi } = req.body;

    if (!isi) {
      return res.status(400).json({ message: "Isi sejarah wajib diisi" });
    }

    // supaya cuma ada 1 sejarah → hapus dulu yang lama
    await Sejarah.deleteMany();

    const sejarah = new Sejarah({ isi });
    await sejarah.save();

    res.status(201).json({ message: "Sejarah berhasil ditambahkan", data: sejarah });
  } catch (err) {
    console.error("❌ Error tambah sejarah:", err);
    res.status(500).json({ message: "Gagal menambahkan sejarah", error: err.message });
  }
});

// Read all (ambil hanya 1)
router.get("/sejarah", async (req, res) => {
  try {
    const sejarah = await Sejarah.find().sort({ createdAt: -1 });
    res.json(sejarah);
  } catch (err) {
    console.error("❌ Error ambil sejarah:", err);
    res.status(500).json({ message: "Gagal mengambil data sejarah", error: err.message });
  }
});

// Read by ID
router.get("/sejarah/:id", async (req, res) => {
  try {
    const sejarah = await Sejarah.findById(req.params.id);
    if (!sejarah) return res.status(404).json({ message: "Sejarah tidak ditemukan" });
    res.json(sejarah);
  } catch (err) {
    console.error("❌ Error ambil sejarah by ID:", err);
    res.status(500).json({ message: "Gagal mengambil sejarah", error: err.message });
  }
});

// Update
router.put("/sejarah/:id", async (req, res) => {
  try {
    const { isi } = req.body;
    const sejarah = await Sejarah.findByIdAndUpdate(
      req.params.id,
      { isi },
      { new: true }
    );

    if (!sejarah) return res.status(404).json({ message: "Sejarah tidak ditemukan" });

    res.json({ message: "Sejarah berhasil diperbarui", data: sejarah });
  } catch (err) {
    console.error("❌ Error update sejarah:", err);
    res.status(500).json({ message: "Gagal memperbarui sejarah", error: err.message });
  }
});

// Delete
router.delete("/sejarah/:id", async (req, res) => {
  try {
    const sejarah = await Sejarah.findByIdAndDelete(req.params.id);
    if (!sejarah) return res.status(404).json({ message: "Sejarah tidak ditemukan" });

    res.json({ message: "Sejarah berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error delete sejarah:", err);
    res.status(500).json({ message: "Gagal menghapus sejarah", error: err.message });
  }
});

// ---------- VisiMisi ----------
// CREATE
router.post("/visimisi", upload.single("foto"), async (req, res) => {
  try {
    let { visi, misi } = req.body;

    // kalau misi dikirim sebagai string, ubah jadi array
    if (typeof misi === "string") {
      misi = misi.split(/[.,;]/).map((s) => s.trim()).filter((s) => s !== "");
    }

    const newVisiMisi = new VisiMisi({
      visi,
      misi,
      foto: req.file ? req.file.filename : null,
    });

    await newVisiMisi.save();
    res.json({ message: "VisiMisi berhasil ditambahkan", data: newVisiMisi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ
router.get("/visimisi", async (req, res) => {
  try {
    const data = await VisiMisi.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/visimisi/:id", upload.single("foto"), async (req, res) => {
  try {
    const { visi, misi } = req.body;
    const updateData = {
      visi,
      misi: Array.isArray(misi) ? misi : [misi],
    };
    if (req.file) updateData.foto = req.file.filename;

    const updated = await VisiMisi.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json({ message: "VisiMisi berhasil diupdate", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/visimisi/:id", async (req, res) => {
  try {
    await VisiMisi.findByIdAndDelete(req.params.id);
    res.json({ message: "VisiMisi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------- Sambutan ----------
// Create
router.post("/sambutan", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const sambutan = new Sambutan({
      title,
      content,
      image: req.file ? req.file.filename : null,
    });

    await sambutan.save();
    res.status(201).json({ message: "Sambutan berhasil ditambahkan", data: sambutan });
  } catch (err) {
    console.error("❌ Error Sambutan [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sambutan", error: err.message });
  }
});

// Read all
router.get("/sambutan", async (req, res) => {
  try {
    const sambutan = await Sambutan.find().sort({ createdAt: -1 });
    res.json(sambutan);
  } catch (err) {
    console.error("❌ Error Sambutan [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sambutan", error: err.message });
  }
});

// Read by ID
router.get("/sambutan/:id", async (req, res) => {
  try {
    const sambutan = await Sambutan.findById(req.params.id);
    if (!sambutan) return res.status(404).json({ message: "Sambutan tidak ditemukan" });
    res.json(sambutan);
  } catch (err) {
    console.error("❌ Error Sambutan [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sambutan", error: err.message });
  }
});

// Update
router.put("/sambutan/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const sambutan = await Sambutan.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!sambutan) return res.status(404).json({ message: "Sambutan tidak ditemukan" });

    res.json({ message: "Sambutan berhasil diperbarui", data: sambutan });
  } catch (err) {
    console.error("❌ Error Sambutan [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sambutan", error: err.message });
  }
});

// Delete
router.delete("/sambutan/:id", async (req, res) => {
  try {
    const sambutan = await Sambutan.findByIdAndDelete(req.params.id);
    if (!sambutan) return res.status(404).json({ message: "Sambutan tidak ditemukan" });

    res.json({ message: "Sambutan berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error Sambutan [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sambutan", error: err.message });
  }
});

// ======================= FASILITAS ======================= //

// CREATE fasilitas
router.post("/fasilitas", upload.single("foto"), async (req, res) => {
  try {
    const newFasilitas = new Fasilitas({
      nama: req.body.nama,
      deskripsi: req.body.deskripsi,
      foto: req.file ? req.file.filename : null,
    });
    await newFasilitas.save();
    res.json({ message: "Fasilitas berhasil ditambahkan", data: newFasilitas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET semua fasilitas
router.get("/fasilitas", async (req, res) => {
  try {
    const data = await Fasilitas.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE fasilitas
router.put("/fasilitas/:id", upload.single("foto"), async (req, res) => {
  try {
    const updateData = {
      nama: req.body.nama,
      deskripsi: req.body.deskripsi,
    };
    if (req.file) updateData.foto = req.file.filename;

    const updated = await Fasilitas.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Fasilitas berhasil diupdate", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE fasilitas
router.delete("/fasilitas/:id", async (req, res) => {
  try {
    await Fasilitas.findByIdAndDelete(req.params.id);
    res.json({ message: "Fasilitas berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Struktur Organisasi ----------
router.get("/struktur", async (req, res) => {
  try {
    const data = await StrukturOrganisasi.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/struktur", auth, async (req, res) => {
  try {
    const newData = new StrukturOrganisasi(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- Guru ----------
router.get("/guru", async (req, res) => {
  try {
    const items = await Guru.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/guru", auth, upload.single("foto"), async (req, res) => {
try {
  const obj = { ...req.body };
  if (req.file) obj.foto = req.file.filename;
  const doc = await Guru.create(obj);
  res.json(doc);
  } catch (err) {
    console.error("❌ Error tambah guru:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.put("/guru/:id", auth, upload.single("foto"), async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.foto = req.file.filename;
  const u = await Guru.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(u);
});

router.delete("/guru/:id", auth, async (req, res) => {
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


// ---------- Staf ----------
router.get("/staf", async (req, res) => {
  try {
    const items = await Staf.find().sort({ createdAt: -1 }); // ✅ pakai model Staf
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/staf", auth, upload.single("foto"), async (req, res) => {
  const obj = { ...req.body };
  if (req.file) obj.foto = req.file.filename;
  const doc = await Staf.create(obj);
  res.json(doc);
});

router.put("/staf/:id", auth, upload.single("foto"), async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.foto = req.file.filename;
  const u = await Staf.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(u);
});

router.delete("/staf/:id", auth, async (req, res) => {
  try {
    const staf = await Staf.findById(req.params.id);
    if (!staf) return res.status(404).json({ message: "Staf tidak ditemukan" }); // ✅ perbaikan

    if (staf.foto) {
      const filePath = path.join(process.cwd(), "uploads", staf.foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await staf.deleteOne();
    res.json({ message: "Staf berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ---------- Siswa ----------
router.get("/siswa", async (req, res) => {
  const items = await Siswa.find().sort({ createdAt: -1 });
  res.json(items);
});
router.post("/siswa", auth, upload.single("foto"), async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILE:", req.file);
  const obj = { ...req.body };
  if (req.file) obj.foto = req.file.filename;
  const doc = await Siswa.create(obj);
  res.json(doc);
});
router.put("/siswa/:id", auth, upload.single("foto"), async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.foto = req.file.filename;
  const u = await Siswa.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(u);
});
router.delete("/siswa/:id", auth, async (req, res) => {
  await Siswa.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

// ---------- Alumni ----------
router.get("/alumni", async (req, res) => {
  const items = await Alumni.find().sort({ createdAt: -1 });
  res.json(items);
});
router.post("/alumni", auth, upload.single("foto"), async (req, res) => {
  const obj = { ...req.body };
  if (req.file) obj.foto = req.file.filename;
  const doc = await Alumni.create(obj);
  res.json(doc);
});
router.put("/alumni/:id", auth, upload.single("foto"), async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.foto = req.file.filename;
  const u = await Alumni.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(u);
});
router.delete("/alumni/:id", auth, async (req, res) => {
  await Alumni.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

// ---------- Berita ----------
router.get("/berita", async (req, res) => {
  try {
    const items = await Berita.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil berita" });
  }
});

router.get("/berita/:id", async (req, res) => {
  try {
    const item = await Berita.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Berita tidak ditemukan" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil detail berita" });
  }
});

router.post("/berita", auth, upload.single("cover"), async (req, res) => {
  try {
    const obj = { ...req.body };
    if (req.file) obj.cover = req.file.filename;
    const doc = await Berita.create(obj);
    res.json(doc);
  } catch (err) {
    console.error("❌ Error simpan berita:", err.message);
    res.status(500).json({ error: "Gagal simpan berita" });
  }
});

router.put("/berita/:id", auth, upload.single("cover"), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.cover = req.file.filename;
    const u = await Berita.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!u) return res.status(404).json({ error: "Berita tidak ditemukan" });
    res.json(u);
  } catch (err) {
    console.error("❌ Error update berita:", err.message);
    res.status(500).json({ error: "Gagal update berita" });
  }
});

router.delete("/berita/:id", auth, async (req, res) => {
  try {
    const berita = await Berita.findById(req.params.id);
    if (!berita) return res.status(404).json({ error: "Berita tidak ditemukan" });

    // Jika ada cover gambar, hapus file dari folder uploads
    if (berita.cover) {
      const filePath = path.join(process.cwd(), "uploads", berita.cover);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Berita.findByIdAndDelete(req.params.id);
    res.json({ message: "Berita dan cover berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error hapus berita:", err.message);
    res.status(500).json({ error: "Gagal hapus berita" });
  }
});


// ---------- Galeri ----------
router.get("/galeri", async (req, res) => {
  const items = await Galeri.find().sort({ createdAt: -1 });
  res.json(items);
});
router.post("/galeri", auth, upload.single("file"), async (req, res) => {
  try {
    const { tipe, judul } = req.body;
    const file = req.file ? req.file.filename : undefined;

    if (!tipe) {
      return res.status(400).json({ error: "Field 'tipe' wajib diisi (foto/vidio)" });
    }

    const doc = await Galeri.create({ tipe, judul, file });
    res.json(doc);
  } catch (err) {
    console.error("❌ Error simpan galeri:", err.message);
    res.status(500).json({ error: "Gagal menyimpan galeri" });
  }
});

router.put("/galeri/:id", auth, upload.single("file"), async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.file = req.file.filename;
  const u = await Galeri.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(u);
});
router.delete("/galeri/:id", auth, async (req, res) => {
  await Galeri.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

// ---------- Pengumuman ----------
router.get("/pengumuman", async (req, res) => {
  const items = await Pengumuman.find().sort({ createdAt: -1 });
  res.json(items);
});
router.post("/pengumuman", auth, async (req, res) => {
  const doc = await Pengumuman.create(req.body);
  res.json(doc);
});
router.put("/pengumuman/:id", auth, async (req, res) => {
  const u = await Pengumuman.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(u);
});
router.delete("/pengumuman/:id", auth, async (req, res) => {
  await Pengumuman.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

// ---------- PPDB (pendaftar) ----------

router.post("/ppdb/formulir", upload.single("dokumen"), async (req, res) => {
  try {
    const ppdb = new PPDB({
      type: "Formulir",
      nama: req.body.nama,
      nisn: req.body.nisn,
      tgl_lahir: req.body.tgl_lahir,
      alamat: req.body.alamat,
      nama_orangtua: req.body.nama_orangtua,
      hp_orangtua: req.body.hp_orangtua,
      dokumen: req.file ? req.file.filename : null,
    });
    await ppdb.save();
    res.json({ message: "Pendaftaran berhasil", data: ppdb });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal simpan data" });
  }
});

// ADMIN GET ALL
router.get("/ppdb", auth, async (req, res) => {
  try {
    const data = await PPDB.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data" });
  }
});

// ADMIN UPDATE
router.put("/ppdb/:id", auth, async (req, res) => {
  try {
    const updated = await PPDB.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Gagal update data" });
  }
});

// ADMIN DELETE
router.delete("/ppdb/:id", auth, async (req, res) => {
  try {
    await PPDB.findByIdAndDelete(req.params.id);
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal hapus data" });
  }
});


export default router;
