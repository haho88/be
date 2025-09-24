import mongoose from "mongoose";

const fasilitasSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String },
  foto: { type: String,}, // nama file lokal (fallback)
  image: { type: String }, // URL Cloudinary
}, { timestamps: true });

export default mongoose.model("Fasilitas", fasilitasSchema);
