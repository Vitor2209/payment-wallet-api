# 💳 Payment & Wallet API

A RESTful API that simulates a **digital wallet system**, allowing users to create accounts, manage balances, deposit money, and transfer funds between users.

This project was built to demonstrate **backend architecture, authentication, financial transactions, and database management** using modern technologies.

---

# 🚀 Features

### Authentication
- User registration
- Secure password hashing with bcrypt
- JWT authentication

### Wallet System
- Automatic wallet creation when a user registers
- Check wallet balance
- Deposit money into wallet

### Transfers
- Transfer funds between users
- Prevent self-transfers
- Prevent transfers with insufficient balance
- Database **atomic transactions**

### Security
- JWT protected routes
- Middleware authentication
- Input validation checks

---

# 🛠️ Tech Stack

Backend:

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)
- JSON Web Token (JWT)
- bcrypt

Development Tools:

- Thunder Client
- Prisma Studio

---

# 📂 Project Structure


src
├── controllers
├── services
├── routes
├── middlewares
├── lib
└── utils


Architecture pattern:


Route → Controller → Service → Database


---

# 📌 API Endpoints

## Authentication

### Register


POST /auth/register


Body:

```json
{
"name": "Vitor",
"email": "vitor@email.com",
"password": "123456"
}
Login

POST /auth/login


Response:

{
"token": "JWT_TOKEN"
}
Wallet
Get Balance

GET /wallet/balance


Header:


Authorization: Bearer TOKEN


Response:

{
"balance": 100
}
Deposit

POST /wallet/deposit


Body:

{
"amount": 100
}
Transfers
Transfer Funds

POST /wallet/transfer


Body:

{
"toUserId": "USER_ID",
"amount": 50
}
🗄️ Database Schema

Models:


User
Wallet
Transaction


Relationships:


User → Wallet (1:1)
Wallet → Transactions

⚙️ Environment Variables

Create a .env file:


DATABASE_URL="your_database_url"
JWT_SECRET="your_secret_key"
PORT=3000

▶️ Running the Project

Install dependencies:


npm install


Run the server:


npm run dev


Server runs on:


http://localhost:3000

🔮 Future Improvements

Planned features for next versions:

Transaction history endpoint

API documentation with Swagger

Request validation with Zod

Global error handler

Rate limiting

Automated tests (Jest + Supertest)

Docker support

Logging system

📜 License

MIT License

👨‍💻 Author

Developed by Vitor Dutra Melo

Backend Developer
