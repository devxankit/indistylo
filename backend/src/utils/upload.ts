import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "indistylo/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  } as any,
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
