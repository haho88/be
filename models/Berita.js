// models/Berita.js
import mongoose from "mongoose";

const BeritaSchema = new mongoose.Schema({
  judul: String,
  penulis: String,
  tanggal: { type: Date, default: Date.now },
  cover: String,
  isi: String,
}, { timestamps: true });

export default mongoose.model("Berita", BeritaSchema);
