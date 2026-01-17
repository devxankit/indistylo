import express from "express";
import {
    addAddress,
    getAddresses,
    deleteAddress,
    updateAddress,
    setDefaultAddress,
} from "../controllers/address.controller.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAddresses).post(addAddress);
router.route("/:id").put(updateAddress).delete(deleteAddress);
router.patch("/:id/default", setDefaultAddress);

export default router;
