import mongoose from "mongoose";

const siswaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Data Siswa", "Prestasi"],
      required: true,
      default: "Data Siswa",
    },
    nama: { type: String, trim: true },     
    kelas: { type: String, trim: true },       
    tahunMasuk: { type: Number },              
    foto: { type: String },                    
  },
  { timestamps: true }
);
export default mongoose.model("Siswa", siswaSchema);
