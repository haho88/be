import mongoose from "mongoose";

const formulirPPDBSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    nisn: { type: String, required: true },
    alamat: { type: String, required: true },
    asalSekolah: { type: String, required: true },
    noHp: { type: String, required: true },
    ijazah: { type: String }, // opsional, simpan filename/path hasil upload
    ijazahPublicId: { type: String }, // ID file Cloudinary
  },
  { timestamps: true }
);

export default mongoose.model("FormulirPPDB", formulirPPDBSchema);
