import mongoose from "mongoose";

const Formulir_PPDBSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    nisn: { type: String, required: true },
    alamat: { type: String, required: true },
    asalSekolah: { type: String, required: true },
    noHp: { type: String, required: true },
    ijazah: { type: String }, // opsional, simpan filename/path hasil upload
  },
  { timestamps: true }
);

export default mongoose.model("Formulir_PPDB", Formulir_PPDBSchema);
