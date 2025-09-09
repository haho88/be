// createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();
const doIt = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const username = "mts_muhammadiyah";
  const password = "PakSiswoyo";
  const exists = await Admin.findOne({ username });
  if (exists) {
    console.log("admin already exists");
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  await Admin.create({ username, password: hash });
  console.log("admin created:", username, password);
  process.exit(0);
};
doIt();
