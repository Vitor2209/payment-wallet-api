import { registerUser, loginUser } from "../services/auth.service.js"

export const register = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      })
    }

    const user = await registerUser({
      name,
      email,
      password
    })

    res.status(201).json({
      message: "User created successfully",
      user
    })

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }
}

export const login = async (req, res) => {
  try {

    const { email, password } = req.body

    const result = await loginUser({
      email,
      password
    })

    res.json(result)

  } catch (error) {

    res.status(401).json({
      message: error.message
    })

  }
}