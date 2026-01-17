import express from "express";
import { getVendorStats, getVendorCustomers, getVendorCustomerDetails, updateVendorCustomer } from "../controllers/analytics.controller.js";

import { isVerifiedVendor } from "../auth/vendor.middleware.js";

const router = express.Router();

router.use(isVerifiedVendor);

router.get("/stats", getVendorStats);
router.get("/customers", getVendorCustomers);
router.get("/customers/:id", getVendorCustomerDetails);
router.patch("/customers/:id", updateVendorCustomer);

export default router;
