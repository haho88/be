// middleware/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// bikin storage ke cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mtsmuhcil", // semua file masuk ke folder "mtsmuhcil" di Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// export middleware multer
const upload = multer({ storage });
export default upload;
