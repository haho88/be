const mongoose = require("mongoose");

const visiMisiSchema = new mongoose.Schema(
  {
    visi: { type: String, required: true },
    misi: [{ type: String }], // array misi
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisiMisi", visiMisiSchema);
