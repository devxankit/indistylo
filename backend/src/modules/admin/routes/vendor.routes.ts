import express from "express";
import {
    getAllVendors,
    getVendorDetails,
    updateVendorStatus,
    verifyVendorDocument,
    createVendor,
} from "../controllers/vendor.controller.js";

const router = express.Router();

router.route("/").get(getAllVendors).post(createVendor);
router.get("/:id", getVendorDetails);
router.patch("/:id/status", updateVendorStatus);
router.patch("/:id/verify-document", verifyVendorDocument);

export default router;
