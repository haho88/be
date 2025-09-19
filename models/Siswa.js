// models/Siswa.js
import mongoose from "mongoose";

const siswaSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    nis: {
      type: String,
      required: true,
      unique: true,
    },
    kelas: {
      type: String,
      required: true,
    },
    jenisKelamin: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
      required: true,
    },
    alamat: {
      type: String,
    },
    tanggalLahir: {
      type: Date,
    },
    foto: {
      type: String, // bisa simpan nama file atau URL
    },
  },
  { timestamps: true }
);

export default mongoose.model("Siswa", siswaSchema);
