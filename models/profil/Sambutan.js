const mongoose = require("mongoose");

const sambutanSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    isi: { type: String, required: true },
    penulis: { type: String }, // misal Kepala Sekolah
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sambutan", sambutanSchema);

