import express from "express"
import { listTransactions } from "../controllers/transaction.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", authMiddleware, listTransactions)

export default router