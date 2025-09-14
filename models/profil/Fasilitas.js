import mongoose from "mongoose";

const fasilitasSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String },
    foto: { type: String }, // simpan nama file/folder
  },
  { timestamps: true }
);

export default mongoose.model("Fasilitas", fasilitasSchema);
