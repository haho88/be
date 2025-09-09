// models/PPDB.js
import mongoose from "mongoose";

const PPDBSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Formulir", "Info PPDB", "Jadwal Seleksi"],
      required: true,
    },

    // Untuk Formulir
    nama: String,
    nisn: String,
    tgl_lahir: Date,
    alamat: String,
    orangtua: String,
    hp_orangtua: String,
    dokumen: String, // filename dokumen
    status: { type: String, enum: ["pending", "lulus", "tidak_lulus"], default: "pending" },

    // Untuk Info PPDB
    judul: String,
    deskripsi: String,

    // Untuk Jadwal Seleksi
    tanggal: Date,
  },
  { timestamps: true }
);

export default mongoose.model("PPDB", PPDBSchema);
