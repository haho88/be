import mongoose from "mongoose";

const ppdbFormulirSchema = new mongoose.Schema(
  {
    tahunAjaran: { type: String, required: true },
    tipe: { type: String, enum: ["file", "link"], default: "link" },
    link: { type: String },
    file: { type: String }, // kalau upload PDF
  },
  { timestamps: true }
);

export default mongoose.model("PPDB_Formulir", ppdbFormulirSchema);
