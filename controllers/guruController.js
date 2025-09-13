// controllers/guruController.js
import Guru from "../models/Guru.js";

// GET semua guru
export const getGuru = async (req, res) => {
  try {
    const guru = await Guru.find();
    res.json(guru);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST tambah guru
export const tambahGuru = async (req, res) => {
  try {
    const guru = new Guru(req.body);
    await guru.save();
    res.status(201).json(guru);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
