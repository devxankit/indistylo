import express from "express";
import { getMySchedule, updateSchedule } from "../controllers/schedule.controller.js";

const router = express.Router();

router.route("/").get(getMySchedule).post(updateSchedule);

export default router;
