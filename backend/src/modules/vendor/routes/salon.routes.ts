import express from "express";
import { getMySalon, upsertSalon } from "../controllers/salon.controller.js";

const router = express.Router();

router.route("/").get(getMySalon).post(upsertSalon);

export default router;
