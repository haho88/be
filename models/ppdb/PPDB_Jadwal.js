import mongoose from "mongoose";

const ppdbJadwalSchema = new mongoose.Schema(
  {
    tahunAjaran: { type: String, required: true },
    tahap: { type: String, required: true }, // contoh: "Seleksi Administrasi"
    tanggal: { type: Date, required: true },
    keterangan: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("PPDB_Jadwal", ppdbJadwalSchema);
