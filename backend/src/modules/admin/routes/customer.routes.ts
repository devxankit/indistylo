import express from "express";
import { getAllCustomers, createCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.route("/").get(getAllCustomers).post(createCustomer);

export default router;
