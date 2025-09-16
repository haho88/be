const mongoose = require("mongoose");

const sejarahSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // opsional kalau pakai upload
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sejarah", sejarahSchema);
