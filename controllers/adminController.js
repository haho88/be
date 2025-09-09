const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const KontenBerita = require('../models/KontenBerita');

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Username tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

const registerIfNotExist = async () => {
  try {
    const exists = await Admin.findOne({ username: 'admin' });
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashed });
      console.log('✅ Admin default dibuat: username=admin password=admin123');
    }
  } catch (e) {
    console.error('Gagal buat admin default:', e.message);
  }
};

const createBerita = async (req, res) => {
  try {
    const { judul, isi, kategori } = req.body;
    const file = req.file;
    const gambar = file ? file.filename : null;

    const berita = await KontenBerita.create({ judul, isi, kategori, gambar });
    res.status(201).json({ message: 'Berita dibuat', data: berita });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat berita', error: err.message });
  }
};

const getBerita = async (req, res) => {
  try {
    const semua = await KontenBerita.find().sort({ createdAt: -1 });
    res.json(semua);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil berita' });
  }
};

module.exports = { login, registerIfNotExist, createBerita, getBerita };
