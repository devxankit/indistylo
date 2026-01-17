import express from "express";
import { vendorProtect } from "../auth/vendor.middleware.js";
import {
    createPackage,
    getVendorPackages,
    deletePackage,
} from "../controllers/package.controller.js";

const router = express.Router();

router.route("/")
    .post(vendorProtect, createPackage)
    .get(vendorProtect, getVendorPackages);

router.route("/:id")
    .delete(vendorProtect, deletePackage);

export default router;
