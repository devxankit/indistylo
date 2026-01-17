import express from "express";
import upload from "../../utils/upload.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
router.post(
  "/",
  protect,
  (req, res, next) => {
    console.log(
      "Upload request started for file:",
      req.headers["content-length"]
    );
    next();
  },
  upload.single("image"),
  (req: any, res) => {
    console.log("Upload middleware finished");
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded successfully to Cloudinary:", req.file.path);
    res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  }
);

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
router.post(
  "/multiple",
  protect,
  upload.array("images", 10),
  (req: any, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = (req.files as any[]).map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    res.status(200).json(files);
  }
);

export default router;
