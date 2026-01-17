import express from "express";
import { getVendorEarnings, requestPayout } from "../controllers/earnings.controller.js";

import { isVerifiedVendor } from "../auth/vendor.middleware.js";

const router = express.Router();

router.use(isVerifiedVendor);

router.get("/", getVendorEarnings);
router.post("/payouts", requestPayout);

export default router;
