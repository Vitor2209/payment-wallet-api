import prisma from "../lib/prisma.js"

// 🔹 Garante que o usuário sempre tenha wallet
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

// 🔹 Ver saldo
export const getBalance = async (userId) => {

  const wallet = await getOrCreateWallet(userId)

  return wallet.balance
}

// 🔹 Depositar dinheiro
export const deposit = async (userId, amount) => {

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero")
  }

  const wallet = await getOrCreateWallet(userId)

  const newBalance = wallet.balance + amount

  // 🔥 LIMITE
  if (newBalance > 1000000) {
    throw new Error("Maximum balance limit reached (1,000,000)")
  }

  const updatedWallet = await prisma.wallet.update({
    where: {
      id: wallet.id
    },
    data: {
      balance: newBalance
    }
  })

  return updatedWallet.balance
}

// 🔹 Transferência por EMAIL
export const transfer = async (fromUserId, toEmail, amount) => {

  console.log("===== DEBUG TRANSFER =====")
  console.log("FROM USER ID:", fromUserId)
  console.log("TO EMAIL:", toEmail)
  console.log("AMOUNT:", amount)

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero")
  }

  // 🔍 Buscar usuário pelo email
  const toUser = await prisma.user.findUnique({
    where: { email: toEmail }
  })

  console.log("FOUND USER:", toUser)

  if (!toUser) {
    throw new Error("Recipient not found")
  }

  const toUserId = toUser.id

  console.log("TO USER ID:", toUserId)

  if (fromUserId === toUserId) {
    throw new Error("Cannot transfer to yourself")
  }

  // 🔍 Buscar wallets (SEM criar automaticamente)
  const fromWallet = await prisma.wallet.findFirst({
    where: { userId: fromUserId }
  })

  const toWallet = await prisma.wallet.findFirst({
    where: { userId: toUserId }
  })

  console.log("FROM WALLET:", fromWallet)
  console.log("TO WALLET:", toWallet)

  if (!fromWallet) {
    throw new Error("Sender wallet not found")
  }

  if (!toWallet) {
    throw new Error("Receiver wallet not found")
  }

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