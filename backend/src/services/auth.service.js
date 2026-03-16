import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async ({ name, email, password }) => {

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("Email already registered")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      wallet: {
        create: {
          balance: 0
        }
      }
    },
    include: {
      wallet: true
    }
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    wallet: user.wallet
  }
}

export const loginUser = async ({ email, password }) => {

  const user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: true }
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new Error("Invalid credentials")
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}