// models/Guru.js
import mongoose from "mongoose";

const guruSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  mapel: { type: String, required: true },
  jabatan: { type: String },
  foto: { type: String }
}, { timestamps: true });

const Guru = mongoose.model("Guru", guruSchema);

export default Guru;
