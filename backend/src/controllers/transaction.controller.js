import prisma from "../lib/prisma.js";

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.userId;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            fromWallet: {
              userId: userId
            }
          },
          {
            toWallet: {
              userId: userId
            }
          }
        ]
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(transactions);

  } catch (error) {
    next(error);
  }
};