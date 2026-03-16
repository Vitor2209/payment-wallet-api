import express from "express"
import { balance, depositMoney, transferMoney } from "../controllers/wallet.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/balance", authMiddleware, balance)

router.post("/deposit", authMiddleware, depositMoney)

router.post("/transfer", authMiddleware, transferMoney)

export default router