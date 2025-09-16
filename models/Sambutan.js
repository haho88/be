import mongoose from "mongoose";  // ✅ pakai import, bukan require

const sejarahSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // opsional untuk upload gambar
  },
  { timestamps: true }
);

const Sejarah = mongoose.model("Sejarah", sejarahSchema);

export default Sejarah; // ✅ export default
