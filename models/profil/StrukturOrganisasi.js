import mongoose from "mongoose";

const strukturSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    foto: { type: String }, // simpan filename gambar
  },
  { timestamps: true }
);

export default mongoose.model("StrukturOrganisasi", strukturSchema);
