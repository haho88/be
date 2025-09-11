const mongoose = require("mongoose");

const sejarahSchema = new mongoose.Schema(
  {
    isi: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sejarah", sejarahSchema);

