import express from "express";
import { protect } from "../../../middleware/authMiddleware.js";
import { createOrder, getUserOrders, payOrder, verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

router.route("/")
    .post(protect, createOrder)
    .get(protect, getUserOrders);

router.route("/:id/pay").post(protect, payOrder);
router.route("/verify-payment").post(protect, verifyPayment);

export default router;
