const Fasilitas = require("../../models/profil/Fasilitas");

// GET
exports.getAll = async (req, res) => {
  try {
    const data = await Fasilitas.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST
exports.create = async (req, res) => {
  try {
    const data = new Fasilitas(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT
exports.update = async (req, res) => {
  try {
    const data = await Fasilitas.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const data = await Fasilitas.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Tidak ditemukan" });
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
