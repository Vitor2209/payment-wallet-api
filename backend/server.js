import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from "./src/routes/auth.routes.js";
import walletRoutes from "./src/routes/wallet.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";

// SWAGGER
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";

// ERROR HANDLER
import { errorHandler } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

// ============================
// MIDDLEWARES
// ============================
app.use(cors());
app.use(express.json());

// ============================
// ROUTES
// ============================
app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);

// ============================
// SWAGGER
// ============================
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================
// ERROR HANDLER (SEMPRE ÚLTIMO)
// ============================
app.use(errorHandler);

// ============================
// SERVER
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});