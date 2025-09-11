import mongoose from "mongoose";

const DataStafSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true }, // contoh: "TU / Tata Usaha"
    tahunMasuk: { type: Number, required: true },
    foto: { type: String },
  },
  { timestamps: true }
);

const DataStaf = mongoose.model("DataStaf", DatastafSchema);
export default DataStaf;
