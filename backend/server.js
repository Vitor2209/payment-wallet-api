import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import walletRoutes from "./src/routes/wallet.routes.js";

import { errorHandler } from "./src/middlewares/error.middleware.js";

// 🔥 SWAGGER
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// ROUTES
// ============================
app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);

// ============================
// SWAGGER
// ============================
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================
// ERROR HANDLER
// ============================
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});