import mongoose from "mongoose";  // ✅ pakai import, bukan require

const sambutanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // opsional untuk upload gambar
  },
  { timestamps: true }
);

const Sambutan = mongoose.model("Sambutan", sambutanSchema);

export default Sambutan; // ✅ export default
