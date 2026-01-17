import express from "express";
import { getVendorBookings, updateBookingStatus } from "../controllers/booking.controller.js";

import { isVerifiedVendor } from "../auth/vendor.middleware.js";

const router = express.Router();

router.use(isVerifiedVendor);

router.route("/").get(getVendorBookings);
router.route("/:id").patch(updateBookingStatus);

export default router;
