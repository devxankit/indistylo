import express from "express";
import { getAllBookings } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getAllBookings);

export default router;
