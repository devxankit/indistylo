import express from "express";
import { getPackages, getPackageById } from "../controllers/package.controller.js";

const router = express.Router();

router.get("/", getPackages);
router.get("/:id", getPackageById);

export default router;
