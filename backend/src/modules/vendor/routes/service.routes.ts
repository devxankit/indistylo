import express from "express";
import {
    getMyServices,
    addService,
    updateService,
    deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.route("/").get(getMyServices).post(addService);
router.route("/:id").put(updateService).delete(deleteService);

export default router;
