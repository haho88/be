const mongoose = require("mongoose");

const strukturSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    foto: { type: String }, // opsional, link foto
  },
  { timestamps: true }
);

module.exports = mongoose.model("StrukturOrganisasi", strukturSchema);
