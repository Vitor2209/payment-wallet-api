import { getUsers } from "../services/user.service.js"

export const listUsers = async (req, res) => {

  try {

    const users = await getUsers()

    res.json(users)

  } catch (error) {

    res.status(500).json({
      message: "Error fetching users"
    })

  }

}