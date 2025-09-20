import mongoose from "mongoose";

const ppdbInfoSchema = new mongoose.Schema(
  {
    tahunAjaran: { type: String, required: true }, // contoh: "2025/2026"
    judul: { type: String, required: true },
    deskripsi: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("PPDB_Info", ppdbInfoSchema);

