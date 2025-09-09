// db.js
import mongoose from "mongoose";


const connectDB = async () => {
  try {
    let mongoURI;

    if (process.env.NODE_ENV === "production") {
      // 🔹 kalau running di Railway server → pakai INTERNAL (27017)
      mongoURI = process.env.MONGO_INTERNAL_URI || process.env.MONGO_URI;
    } else {
      // 🔹 kalau running di lokal → pakai PUBLIC (23302) atau Localhost
      mongoURI = process.env.MONGO_PUBLIC_URI || "mongodb://127.0.0.1:27017/mtsmuhcil";
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${mongoURI}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
