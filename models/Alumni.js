import mongoose from "mongoose";

const AlumniSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Data Alumni", "Testimoni"],
      required: true,
      default: "Data Alumni",
    },
    nama: {
      type: String,
      trim: true,
    },
    tahun: {
      type: Number,
    },
    pekerjaan: {
      type: String,
      trim: true,
    },
    // kalau Data Alumni
    foto: {
      type: String,
    },
    // kalau Testimoni
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alumni", AlumniSchema);
