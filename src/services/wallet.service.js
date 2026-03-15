import prisma from "../lib/prisma.js"

export const getOrCreateWallet = async (userId) => {

  let wallet = await prisma.wallet.findUnique({
    where: { userId: userId }
  })

  if (!wallet) {

    wallet = await prisma.wallet.create({
      data: {
        userId: userId,
        balance: 0
      }
    })

  }

  return wallet
}

export const getBalance = async (userId) => {

  const wallet = await getOrCreateWallet(userId)

  return wallet.balance
}

export const deposit = async (userId, amount) => {

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero")
  }

  const wallet = await getOrCreateWallet(userId)

  const updatedWallet = await prisma.wallet.update({
    where: {
      id: wallet.id
    },
    data: {
      balance: wallet.balance + amount
    }
  })

  return updatedWallet.balance
}

export const transfer = async (fromUserId, toUserId, amount) => {

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero")
  }

  if (fromUserId === toUserId) {
    throw new Error("Cannot transfer to yourself")
  }

  const fromWallet = await getOrCreateWallet(fromUserId)
  const toWallet = await getOrCreateWallet(toUserId)

  if (fromWallet.balance < amount) {
    throw new Error("Insufficient balance")
  }

  const result = await prisma.$transaction(async (tx) => {

    const updatedSender = await tx.wallet.update({
      where: { id: fromWallet.id },
      data: {
        balance: fromWallet.balance - amount
      }
    })

    await tx.wallet.update({
      where: { id: toWallet.id },
      data: {
        balance: toWallet.balance + amount
      }
    })

    const transaction = await tx.transaction.create({
      data: {
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
        amount: amount,
        type: "transfer"
      }
    })

    return {
      senderBalance: updatedSender.balance,
      transaction
    }

  })

  return result
}