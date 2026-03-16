import { getUserTransactions } from "../services/transaction.service.js"

export const listTransactions = async (req, res) => {

  try {

    const userId = req.userId

    const transactions = await getUserTransactions(userId)

    res.json(transactions)

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}