import Staf from "../../models/guru/Staf.js";

export const getAllStaf = async (req, res) => {
  try {
    const data = await Staf.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data staf", error: err.message });
  }
};

export const createStaf = async (req, res) => {
  try {
    const { nama, jabatan } = req.body;
    const foto = req.file ? req.file.filename : null;

    const staf = new Staf({ nama, jabatan, foto });
    await staf.save();

    res.status(201).json(staf);
  } catch (err) {
    res.status(400).json({ message: "Gagal tambah staf", error: err.message });
  }
};
