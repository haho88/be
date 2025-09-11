import mongoose from "mongoose";

const DataGuruSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true }, // contoh: "Guru Matematika"
    tahunMengajar: { type: Number, required: true }, // tahun mulai mengajar
    foto: { type: String }, // simpan nama file/folder
  },
  { timestamps: true }
);

const Guru = mongoose.model("DataGuru", DataGuruSchema);
export default DataGuru;
