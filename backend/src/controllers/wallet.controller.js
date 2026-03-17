import { getBalance, deposit, transfer } from "../services/wallet.service.js"

export const balance = async (req, res) => {

  try {

    const userId = req.userId

    const walletBalance = await getBalance(userId)

    res.json({
      balance: walletBalance
    })

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}

export const depositMoney = async (req, res) => {

  try {

    const userId = req.userId
    const { amount } = req.body

    const newBalance = await deposit(userId, amount)

    res.json({
      message: "Deposit successful",
      balance: newBalance
    })

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}

export const transferMoney = async (req, res) => {

  try {

    const fromUserId = req.userId
    const { toEmail, amount } = req.body

    const result = await transfer(fromUserId, toEmail, amount)

    res.json({
      message: "Transfer successful",
      senderBalance: result.senderBalance,
      transaction: result.transaction
    })

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}