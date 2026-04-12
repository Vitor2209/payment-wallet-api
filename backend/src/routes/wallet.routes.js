import express from "express";
import { balance, depositMoney, transferMoney } from "../controllers/wallet.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get("/balance", authMiddleware, balance);

/**
 * @swagger
 * /wallet/deposit:
 *   post:
 *     summary: Deposit money
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             amount: 100
 */
router.post("/deposit", authMiddleware, depositMoney);

/**
 * @swagger
 * /wallet/transfer:
 *   post:
 *     summary: Transfer money
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             toEmail: test@email.com
 *             amount: 50
 */
router.post("/transfer", authMiddleware, transferMoney);

export default router;