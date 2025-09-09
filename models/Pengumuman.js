// models/Pengumuman.js
import mongoose from "mongoose";

const PengumumanSchema = new mongoose.Schema({
  judul: String,
  tanggal: { type: Date, default: Date.now },
  isi: String,
}, { timestamps: true });

export default mongoose.model("Pengumuman", PengumumanSchema);
