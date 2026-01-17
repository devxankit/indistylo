import express from "express";
import {
    createBooking,
    getUserBookings,
    payBooking,
    cancelBooking,
    getBookingDetails,
    updateBooking,
    createRazorpayOrder,
    verifyRazorpayPayment,
    payWithWallet,
} from "../controllers/booking.controller.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getUserBookings).post(createBooking);
router.route("/:id").get(getBookingDetails).patch(updateBooking);
router.patch("/:id/cancel", cancelBooking);
router.post("/:id/pay", payBooking);
router.post("/:id/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.post("/:id/pay-wallet", payWithWallet);

export default router;
