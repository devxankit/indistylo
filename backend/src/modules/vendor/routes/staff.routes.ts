import express from "express";
import { getMyStaff, addStaff, updateStaff, deleteStaff } from "../controllers/staff.controller.js";

const router = express.Router();

router.route("/").get(getMyStaff).post(addStaff);
router.route("/:id").put(updateStaff).delete(deleteStaff);

export default router;
