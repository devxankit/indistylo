import express from "express";
import { getWalletBalance, getWalletTransactions } from "../controllers/wallet.controller.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/balance", getWalletBalance);
router.get("/transactions", getWalletTransactions);

export default router;
