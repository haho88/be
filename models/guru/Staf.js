import mongoose from "mongoose";

const stafSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    foto: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Staf", stafSchema);
