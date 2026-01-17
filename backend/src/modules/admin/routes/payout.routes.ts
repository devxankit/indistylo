import express from "express";
import { getAllPayouts, updatePayoutStatus } from "../controllers/payout.controller.js";

const router = express.Router();

router.get("/", getAllPayouts);
router.patch("/:id", updatePayoutStatus);

export default router;
