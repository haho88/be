import mongoose from "mongoose";

const prestasiSiswaSchema = new mongoose.Schema(
  {
    siswaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Siswa", // relasi ke Siswa
      required: true,
    },
    namaPrestasi: { type: String, required: true },
    tingkat: { type: String, enum: ["Sekolah", "Kabupaten", "Provinsi", "Nasional", "Internasional"], required: true },
    tahun: { type: Number, required: true },
    keterangan: { type: String },
    sertifikat: { type: String }, // opsional (file scan sertifikat)
  },
  { timestamps: true }
);

export default mongoose.model("PrestasiSiswa", prestasiSiswaSchema);
