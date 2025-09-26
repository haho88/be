// routes/adminRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

import Admin from "../models/Admin.js";
import VisiMisi from "../models/VisiMisi.js";
import Sambutan from "../models/Sambutan.js";
import Sejarah from "../models/Sejarah.js";
import Fasilitas from "../models/Fasilitas.js";
import StrukturOrganisasi from "../models/StrukturOrganisasi.js";
import Guru from "../models/Guru.js";
import Staf from "../models/Staf.js";
import Siswa from "../models/Siswa.js";
import PrestasiSiswa from "../models/PrestasiSiswa.js";
import Alumni from "../models/Alumni.js";
import Berita from "../models/Berita.js";
import Galeri from "../models/Galeri.js";
import Pengumuman from "../models/Pengumuman.js";
import PPDB_Info from "../models/ppdb/PPDB_Info.js";
import FormulirPPDB from "../models/PPDB_Formulir.js";
import PPDB_Jadwal from "../models/ppdb/PPDB_Jadwal.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js"; // pastikan config sudah ada



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
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

// ========== CRUD GENERIC HELPERS (for clarity we implement separately) ===========
// -------------- SEJARAH --------------- \\
// Create
router.post("/sejarah", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const sejarah = new Sejarah({
      title,
      content,
      image: req.file ? req.file.filename : null,
    });

    await sejarah.save();
    res.status(201).json({ message: "Sejarah berhasil ditambahkan", data: sejarah });
  } catch (err) {
    console.error("❌ Error Sejarah [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sejarah", error: err.message });
  }
});

// Read all
router.get("/sejarah", async (req, res) => {
  try {
    const sejarah = await Sejarah.find().sort({ createdAt: -1 });
    res.json(sejarah);
  } catch (err) {
    console.error("❌ Error Sejarah [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sejarah", error: err.message });
  }
});

// Read by ID
router.get("/sejarah/:id", async (req, res) => {
  try {
    const sejarah = await Sejarah.findById(req.params.id);
    if (!sejarah) return res.status(404).json({ message: "Sejarah tidak ditemukan" });
    res.json(sejarah);
  } catch (err) {
    console.error("❌ Error Sejarah [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sejarah", error: err.message });
  }
});

// Update
router.put("/sejarah/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const sejarah = await Sejarah.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!sejarah) return res.status(404).json({ message: "Sejarah tidak ditemukan" });

    res.json({ message: "Sejarah berhasil diperbarui", data: sejarah });
  } catch (err) {
    console.error("❌ Error Sejarah [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sejarah", error: err.message });
  }
});

// Delete
router.delete("/sejarah/:id", async (req, res) => {
  try {
    const sejarah = await Sejarah.findByIdAndDelete(req.params.id);
    if (!sejarah) return res.status(404).json({ message: "Sejarah tidak ditemukan" });

    res.json({ message: "Sejarah berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error Sejarah [POST]:", err); // <--- tambahkan ini
    res.status(500).json({ message: "Gagal menambahkan sejarah", error: err.message });
  }
});




// ---------- VISI-MISI ----------
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


// -------------------- SAMBUTAN ---------------------
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
    let imageUrl = null;
    let localFile = null;

    if (req.file) {
      try {
        // ✅ Upload ke Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "mtsmuhcil/fasilitas",
        });
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        // ✅ Jika gagal ke Cloudinary, simpan ke lokal
        localFile = req.file.filename;
      }
    }

    const newFasilitas = new Fasilitas({
      nama: req.body.nama,
      deskripsi: req.body.deskripsi,
      image: imageUrl,
      foto: localFile,
    });

    await newFasilitas.save();
    res.json({
      message: "✅ Fasilitas berhasil ditambahkan",
      data: newFasilitas,
    });
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

// ✅ GET detail fasilitas by ID
router.get("/fasilitas/:id", async (req, res) => {
  try {
    const fasilitas = await Fasilitas.findById(req.params.id);
    if (!fasilitas) {
      return res.status(404).json({ message: "❌ Fasilitas tidak ditemukan" });
    }
    res.json(fasilitas);
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

    if (req.file) {
      try {
        // ✅ Upload baru ke Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "mtsmuhcil/fasilitas",
        });
        updateData.image = uploadResult.secure_url;
      } catch (err) {
        // ✅ Fallback simpan nama file lokal
        updateData.foto = req.file.filename;
      }
    }

    const updated = await Fasilitas.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "✅ Fasilitas berhasil diupdate",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE fasilitas
router.delete("/fasilitas/:id", async (req, res) => {
  try {
    await Fasilitas.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Fasilitas berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- STRUKTUR ORGANISASI ----------

// CREATE
router.post("/strukturorganisasi", upload.single("image"), async (req, res) => {
  try {
    const { nama, jabatan } = req.body;
    const struktur = new StrukturOrganisasi({
      nama,
      jabatan,
      image: req.file ? req.file.filename : null,
    });
    await struktur.save();
    res.status(201).json(struktur);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah struktur", error });
  }
});

// READ (All)
router.get("/strukturorganisasi", async (req, res) => {
  try {
    const struktur = await StrukturOrganisasi.find();
    res.json(struktur);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data struktur", error });
  }
});

// READ (By ID)
router.get("/strukturorganisasi/:id", async (req, res) => {
  try {
    const struktur = await StrukturOrganisasi.findById(req.params.id);
    if (!struktur) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(struktur);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail struktur", error });
  }
});

// UPDATE
router.put("/strukturorganisasi/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jabatan } = req.body;

    const existing = await StrukturOrganisasi.findById(id);
    if (!existing) return res.status(404).json({ message: "Data tidak ditemukan" });

    if (req.file && existing.image) {
      const oldPath = path.join("uploads/struktur", existing.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    existing.nama = nama || existing.nama;
    existing.jabatan = jabatan || existing.jabatan;
    existing.image = req.file ? req.file.filename : existing.image;

    await existing.save();
    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: "Gagal update struktur", error });
  }
});

// DELETE
router.delete("/strukturorganisasi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await StrukturOrganisasi.findById(id);
    if (!existing) return res.status(404).json({ message: "Data tidak ditemukan" });

    if (existing.image) {
      const oldPath = path.join("uploads/struktur", existing.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await StrukturOrganisasi.findByIdAndDelete(id);
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus struktur", error });
  }
});

// -------------- GURU -----------------
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


// ------------------ STAF ------------------
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

// ========== SETUP UPLOAD SISWA (folder khusus) ==========
const siswaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_DIR, "siswa");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // buat folder kalau belum ada
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const uploadSiswa = multer({ storage: siswaStorage });

// -------------- SISWA ----------------
// CREATE Siswa
router.post("/siswa", uploadSiswa.single("foto"), async (req, res) => {
  try {
    const { nama, nis, kelas, jenisKelamin, alamat, tanggalLahir } = req.body;

    const newSiswa = new Siswa({
      nama,
      nis,
      kelas,
      jenisKelamin,
      alamat,
      tanggalLahir,
      foto: req.file ? req.file.filename : null,
    });

    await newSiswa.save();
    res.status(201).json({ message: "Siswa berhasil ditambahkan", data: newSiswa });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ semua siswa
router.get("/siswa", async (req, res) => {
  try {
    const siswa = await Siswa.find();
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ detail siswa
router.get("/siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findById(req.params.id);
    if (!siswa) return res.status(404).json({ error: "Siswa tidak ditemukan" });
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE siswa
router.put("/siswa/:id", uploadSiswa.single("foto"), async (req, res) => {
  try {
    const { nama, nis, kelas, jenisKelamin, alamat, tanggalLahir } = req.body;

    const siswa = await Siswa.findById(req.params.id);
    if (!siswa) return res.status(404).json({ error: "Siswa tidak ditemukan" });

    if (req.file) {
      const oldPath = path.join(UPLOAD_DIR, "siswa", siswa.foto || "");
      if (siswa.foto && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      siswa.foto = req.file.filename;
    }

    siswa.nama = nama || siswa.nama;
    siswa.nis = nis || siswa.nis;
    siswa.kelas = kelas || siswa.kelas;
    siswa.jenisKelamin = jenisKelamin || siswa.jenisKelamin;
    siswa.alamat = alamat || siswa.alamat;
    siswa.tanggalLahir = tanggalLahir || siswa.tanggalLahir;

    await siswa.save();
    res.json({ message: "Data siswa berhasil diperbarui", data: siswa });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE siswa
router.delete("/siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findById(req.params.id);
    if (!siswa) return res.status(404).json({ error: "Siswa tidak ditemukan" });

    if (siswa.foto) {
      const filePath = path.join(UPLOAD_DIR, "siswa", siswa.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await siswa.deleteOne();
    res.json({ message: "Siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============== PRESTASI SISWA ==================
// ========== SETUP UPLOAD PRESTASI SISWA ==========
const prestasiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_DIR, "prestasi-siswa");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const uploadPrestasi = multer({ storage: prestasiStorage });


// ======================= PRESTASI SISWA ======================= //

// CREATE Prestasi Siswa
router.post("/prestasi-siswa", upload.single("sertifikat"), async (req, res) => {
  try {
    const { siswaId, namaPrestasi, tingkat, tahun, keterangan } = req.body;

    let sertifikatUrl = null;
    let localFile = null;

    if (req.file) {
      try {
        // ✅ Upload ke Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "mtsmuhcil/prestasi-siswa",
        });
        sertifikatUrl = uploadResult.secure_url;
      } catch (err) {
        // ✅ Fallback simpan nama file lokal
        localFile = req.file.filename;
      }
    }

    const newPrestasi = new PrestasiSiswa({
      siswaId,
      namaPrestasi,
      tingkat,
      tahun,
      keterangan,
      sertifikat: sertifikatUrl,
      fileLokal: localFile,
    });

    await newPrestasi.save();
    res.status(201).json({
      message: "✅ Prestasi siswa berhasil ditambahkan",
      data: newPrestasi,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// READ semua prestasi
router.get("/prestasi-siswa", async (req, res) => {
  try {
    const prestasi = await PrestasiSiswa.find().populate("siswaId", "nama nis kelas");
    res.json(prestasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ detail prestasi by ID
router.get("/prestasi-siswa/:id", async (req, res) => {
  try {
    const prestasi = await PrestasiSiswa.findById(req.params.id).populate("siswaId");
    if (!prestasi) {
      return res.status(404).json({ message: "❌ Prestasi tidak ditemukan" });
    }
    res.json(prestasi);
  } catch (err) {
    res.status(500).json({ message: "Error ambil detail prestasi", error: err.message });
  }
});


// UPDATE Prestasi
router.put("/prestasi-siswa/:id", upload.single("sertifikat"), async (req, res) => {
  try {
    const { namaPrestasi, tingkat, tahun, keterangan, siswaId } = req.body;
    const prestasi = await PrestasiSiswa.findById(req.params.id);
    if (!prestasi) return res.status(404).json({ error: "❌ Prestasi tidak ditemukan" });

    if (req.file) {
      try {
        // ✅ Upload baru ke Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "mtsmuhcil/prestasi-siswa",
        });
        prestasi.sertifikat = uploadResult.secure_url;
        prestasi.fileLokal = null; // reset kalau sudah berhasil upload cloudinary
      } catch (err) {
        // ✅ Fallback lokal
        prestasi.fileLokal = req.file.filename;
      }
    }

    prestasi.namaPrestasi = namaPrestasi || prestasi.namaPrestasi;
    prestasi.tingkat = tingkat || prestasi.tingkat;
    prestasi.tahun = tahun || prestasi.tahun;
    prestasi.keterangan = keterangan || prestasi.keterangan;
    prestasi.siswaId = siswaId || prestasi.siswaId;

    await prestasi.save();
    res.json({ message: "✅ Prestasi berhasil diperbarui", data: prestasi });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE Prestasi
router.delete("/prestasi-siswa/:id", async (req, res) => {
  try {
    const prestasi = await PrestasiSiswa.findById(req.params.id);
    if (!prestasi) return res.status(404).json({ error: "❌ Prestasi tidak ditemukan" });

    // ✅ (Optional) kalau mau hapus file lokal juga
    if (prestasi.fileLokal) {
      const filePath = path.join(UPLOAD_DIR, "prestasi-siswa", prestasi.fileLokal);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prestasi.deleteOne();
    res.json({ message: "✅ Prestasi siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE Prestasi
router.delete("/prestasi-siswa/:id", async (req, res) => {
  try {
    const prestasi = await PrestasiSiswa.findById(req.params.id);
    if (!prestasi) return res.status(404).json({ error: "❌ Prestasi tidak ditemukan" });

    // ✅ (Optional) kalau mau hapus file lokal juga
    if (prestasi.fileLokal) {
      const filePath = path.join(UPLOAD_DIR, "prestasi-siswa", prestasi.fileLokal);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prestasi.deleteOne();
    res.json({ message: "✅ Prestasi siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ---------- ALUMNI ----------
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

// ---------- BERITA ----------
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


// ---------- GALERI ----------
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

// ---------- PENGUMUMAN ----------
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

// ==================== PPDB INFO ====================
router.post("/ppdb/info", async (req, res) => {
  try {
    const data = new PPDB_Info(req.body);
    await data.save();
    res.status(201).json({ message: "Info PPDB ditambahkan", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/ppdb/info", async (req, res) => {
  try {
    const data = await PPDB_Info.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/ppdb/info/:id", async (req, res) => {
  try {
    const data = await PPDB_Info.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Info PPDB diperbarui", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/ppdb/info/:id", async (req, res) => {
  try {
    await PPDB_Info.findByIdAndDelete(req.params.id);
    res.json({ message: "Info PPDB dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==================== PPDB FORMULIR ====================
// ➡️ Read (lihat semua pendaftar)
router.get("/formulir", async (req, res) => {
  try {
    const data = await FormulirPPDB.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ Read by ID (lihat detail 1 pendaftar)
router.get("/formulir/:id", async (req, res) => {
  try {
    const data = await FormulirPPDB.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ Delete (hapus pendaftar + hapus file Cloudinary)
router.delete("/formulir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const form = await FormulirPPDB.findByIdAndDelete(id);

    if (!form) return res.status(404).json({ error: "Data tidak ditemukan" });

    if (form.ijazahPublicId) {
      await cloudinary.uploader.destroy(form.ijazahPublicId);
    }

    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==================== PPDB JADWAL ====================
router.post("/ppdb/jadwal", async (req, res) => {
  try {
    const data = new PPDB_Jadwal(req.body);
    await data.save();
    res.status(201).json({ message: "Jadwal seleksi ditambahkan", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/ppdb/jadwal", async (req, res) => {
  try {
    const data = await PPDB_Jadwal.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/ppdb/jadwal/:id", async (req, res) => {
  try {
    const data = await PPDB_Jadwal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Jadwal diperbarui", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/ppdb/jadwal/:id", async (req, res) => {
  try {
    await PPDB_Jadwal.findByIdAndDelete(req.params.id);
    res.json({ message: "Jadwal dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
