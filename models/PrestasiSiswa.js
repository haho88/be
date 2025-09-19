// models/PrestasiSiswa.js
import mongoose from "mongoose";

const prestasiSiswaSchema = new mongoose.Schema(
  {
    siswaId: { type: mongoose.Schema.Types.ObjectId, ref: "Siswa", required: false }, // ✅ opsional
    namaPrestasi: { type: String, required: true },
    tingkat: { type: String, required: true },
    tahun: { type: Number, required: true },
    keterangan: { type: String },
    sertifikat: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("PrestasiSiswa", prestasiSiswaSchema);
