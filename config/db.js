// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoURI;

    if (process.env.NODE_ENV === "production") {
      // 🚀 Railway: pakai internal dulu, fallback ke public
      mongoURI =
        process.env.MONGO_INTERNAL_URI ||
        process.env.MONGO_PUBLIC_URI ||
        process.env.MONGO_URI_ATLAS;
    } else {
      // 💻 Lokal: pakai Atlas dulu, kalau nggak ada pakai lokal
      mongoURI =
        process.env.MONGO_URI_ATLAS ||
        process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/mtsmuhcil";
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected to: ${mongoURI}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
