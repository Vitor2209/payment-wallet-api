import express from "express"
import { listUsers } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", authMiddleware, listUsers)

export default router