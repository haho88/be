// models/Profil.js
import mongoose from "mongoose";

const ProfilSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["visi-misi", "sejarah", "struktur","sambutan", "fasilitas"],
      required: true,
      default: "visi-misi", // default value jika tidak dikirim
    },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profil", ProfilSchema);
