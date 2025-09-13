// models/Staf.js
import mongoose from "mongoose";

const stafSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  Jobdesk: { type: String, required: true },
  jabatan: { type: String },
  foto: { type: String }
}, { timestamps: true });

const Staf = mongoose.model("Staf", stafSchema);

export default Staf;
