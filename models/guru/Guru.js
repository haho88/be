import mongoose from "mongoose";

const guruSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    mapel: { type: String },
    foto: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Guru", guruSchema);
