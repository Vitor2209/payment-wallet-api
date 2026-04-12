import { getBalance, deposit, transfer } from "../services/wallet.service.js";
import { depositSchema, transferSchema } from "../validations/wallet.validation.js";
import { AppError } from "../utils/AppError.js";

// ============================
// GET BALANCE
// ============================
export const balance = async (req, res, next) => {
  try {
    const walletBalance = await getBalance(req.userId);

    res.json({ balance: walletBalance });
  } catch (error) {
    next(error);
  }
};

// ============================
// DEPOSIT
// ============================
export const depositMoney = async (req, res, next) => {
  try {
    const parsed = depositSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { amount } = parsed.data;

    const newBalance = await deposit(req.userId, amount);

    res.json({
      message: "Deposit successful",
      balance: newBalance
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// TRANSFER
// ============================
export const transferMoney = async (req, res, next) => {
  try {
    const parsed = transferSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { toEmail, amount } = parsed.data;

    const result = await transfer(req.userId, toEmail, amount);

    res.json({
      message: "Transfer successful",
      senderBalance: result.senderBalance,
      transaction: result.transaction
    });

  } catch (error) {
    next(error);
  }
};