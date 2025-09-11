import Guru from "../../models/guru/Guru.js";

export const getAllGuru = async (req, res) => {
  try {
    const data = await Guru.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data guru", error: err.message });
  }
};

export const createGuru = async (req, res) => {
  try {
    const { nama, jabatan, mapel } = req.body;
    const foto = req.file ? req.file.filename : null;

    const guru = new Guru({ nama, jabatan, mapel, foto });
    await guru.save();

    res.status(201).json(guru);
  } catch (err) {
    res.status(400).json({ message: "Gagal tambah guru", error: err.message });
  }
};
