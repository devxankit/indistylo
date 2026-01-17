import express from "express";
import {
    getPublicContent,
    getContentByType,
    addContent,
    updateContent,
    deleteContent,
} from "../controllers/content.controller.js";

const router = express.Router();

// Public route
router.get("/public", getPublicContent);

// Protected routes (mounted under admin middleware)
router.get("/:type", getContentByType);
router.post("/", addContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

export default router;
