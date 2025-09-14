const mongoose = require("mongoose");

const fasilitasSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String },
    gambar: { type: String }, // opsional, simpan URL gambar
  },
  { timestamps: true }
);

export default mongoose.model("Fasilitas", fasilitasSchema);
