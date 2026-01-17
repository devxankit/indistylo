import express from "express";
import {
    getAppSettings,
    updateAppSettings,
    getCommissionRate,
    updateCommissionRate,
} from "../controllers/settings.controller.js";

const router = express.Router();

router.route("/").get(getAppSettings).post(updateAppSettings);
router.route("/commission").get(getCommissionRate).post(updateCommissionRate);

export default router;
