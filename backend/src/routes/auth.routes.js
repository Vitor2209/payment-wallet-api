import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Vitor
 *             email: vitor@email.com
 *             password: 123456
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: vitor@email.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: JWT token
 */
router.post("/login", login);

export default router;