import mongoose from "mongoose";

const visiMisiSchema = new mongoose.Schema(
  {
    visi: { type: String, required: true },
    misi: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("VisiMisi", visiMisiSchema);
