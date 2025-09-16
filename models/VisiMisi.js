// models/VisiMisi.js
import mongoose from "mongoose";

const VisiMisiSchema = new mongoose.Schema(
  {
    visi: { type: String, required: true },
    misi: { type: [String], required: true },
    foto: { type: String }, // opsional, kalau mau ada gambar
  },
  { timestamps: true }
);

export default mongoose.model("VisiMisi", VisiMisiSchema);
