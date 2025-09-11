import mongoose from "mongoose";

const DatastafSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true }, // contoh: "TU / Tata Usaha"
    tahunMasuk: { type: Number, required: true },
    foto: { type: String },
  },
  { timestamps: true }
);

const Staf = mongoose.model("DataStaf", DatastafSchema);
export default DataStaf;
