import prisma from "../lib/prisma.js"

export const getUserTransactions = async (userId) => {

  const wallet = await prisma.wallet.findUnique({
    where: { userId }
  })

  if (!wallet) {
    throw new Error("Wallet not found")
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromWalletId: wallet.id },
        { toWalletId: wallet.id }
      ]
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return transactions
}