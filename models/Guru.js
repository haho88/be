import mongoose from "mongoose";

const guruSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Data Guru", "Data Staf"],
      required: true,
      default: "Data Guru" // default value jika tidak dikirim
    },
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    tahun: { type: Number, required: true },
    foto: { type: String } // simpan nama file foto
  },
  {
    timestamps: true // optional: otomatis simpan createdAt & updatedAt
  }
);

export default mongoose.model("Guru", guruSchema);
