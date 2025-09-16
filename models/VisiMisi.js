// models/VisiMisi.js
import mongoose from "mongoose";

const visiMisiSchema = new mongoose.Schema(
  {
    visi: {
      type: String,
      required: true,
      trim: true,
    },
    misi: {
      type: [String], // Array of string (bisa banyak poin)
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0; // minimal ada 1 misi
        },
        message: "Misi harus memiliki minimal 1 poin.",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // otomatis tambahkan createdAt & updatedAt
);

export default mongoose.model("VisiMisi", visiMisiSchema);
