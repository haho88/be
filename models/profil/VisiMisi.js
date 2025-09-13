// models/profil/VisiMisi.js
import mongoose from "mongoose";

const visiMisiSchema = new mongoose.Schema(
  {
    visi: { type: String, required: true },
    misi: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("VisiMisi", visiMisiSchema);
