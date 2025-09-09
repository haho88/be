import mongoose from "mongoose";

const GaleriSchema = new mongoose.Schema(
  {
    tipe: { type: String, enum: ["foto", "vidio"], required: true }, // kategori
    judul: { type: String, required: true }, // judul foto/vidio
    konten: { type: String }, // deskripsi tambahan / isi konten
    file: { type: String }, // filename atau url
    tanggal: { type: Date, default: Date.now }, // tanggal upload
  },
  { timestamps: true }
);

export default mongoose.model("Galeri", GaleriSchema);
