import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import walletRoutes from "./routes/wallet.routes.js"
import transactionRoutes from "./routes/transaction.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/wallet", walletRoutes)
app.use("/transactions", transactionRoutes)
app.use("/users", userRoutes)

app.get("/", (req, res) => {
  res.send("Payment Wallet API running")
})

export default app