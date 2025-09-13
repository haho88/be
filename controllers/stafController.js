// controllers/guruController.js
import Staf from "../models/Staf.js";

// GET semua Staf
export const getStaf = async (req, res) => {
  try {
    const staf = await Staf.find();
    res.json(staf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST tambah staf
export const tambahStaf = async (req, res) => {
  try {
    const staf = new Guru(req.body);
    await staf.save();
    res.status(201).json(staf);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
