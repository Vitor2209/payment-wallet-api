# 💳 Payment & Wallet API

A RESTful API that simulates a **digital wallet system**, allowing users to create accounts, manage balances, deposit money, and transfer funds between users.

This project was built to demonstrate **backend architecture, authentication, financial transactions, and database management** using modern technologies.

---

🌍 Live API

🚀 Backend deployed online:

https://payment-wallet-api.onrender.com

You can test the API using tools like Thunder Client, Postman, or any REST client.

---

# 🚀 Features

## 🔐 Authentication

* User registration
* Secure password hashing with **bcrypt**
* JWT authentication

## 👛 Wallet System

* Automatic wallet creation when a user registers
* Check wallet balance
* Deposit money into wallet

## 💸 Transfers

* Transfer funds between users
* Prevent self-transfers
* Prevent transfers with insufficient balance
* Database **atomic transactions**

## 🛡️ Security

* JWT protected routes
* Middleware authentication
* Input validation checks

---

# 🛠️ Tech Stack

## ⚙️ Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL (Neon)
* JSON Web Token (JWT)
* bcrypt

## 🧪 Development Tools

* Thunder Client
* Prisma Studio

---

# 📂 Project Structure

```id="t0oazf"
src
├── controllers
├── services
├── routes
├── middlewares
├── lib
└── utils
```

### 🏗 Architecture Pattern

```
Route → Controller → Service → Database
```

---

# 📌 API Endpoints

## 🔐 Authentication

### Register

```
POST /auth/register
```

Body:

```json id="p1qlu3"
{
  "name": "Vitor",
  "email": "vitor@email.com",
  "password": "123456"
}
```

---

### Login

```
POST /auth/login
```

Response:

```json id="i5jznl"
{
  "token": "JWT_TOKEN"
}
```

---

# 👛 Wallet

### Get Balance

```
GET /wallet/balance
```

Header:

```
Authorization: Bearer TOKEN
```

Response:

```json id="xw1m6u"
{
  "balance": 100
}
```

---

### Deposit

```
POST /wallet/deposit
```

Body:

```json id="2teix7"
{
  "amount": 100
}
```

---

# 💸 Transfers

### Transfer Funds

```
POST /wallet/transfer
```

Body:

```json id="ugm8n3"
{
  "toUserId": "USER_ID",
  "amount": 50
}
```

---

# 🗄️ Database Schema

### Models

* User
* Wallet
* Transaction

### Relationships

```
User → Wallet (1:1)
Wallet → Transactions
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```id="c89grs"
DATABASE_URL="your_database_url"
JWT_SECRET="your_secret_key"
PORT=3000
```

---

# ▶️ Running the Project

### Install dependencies

```
npm install
```

### Run the server

```
npm run dev
```

### Server runs on

```
http://localhost:3000
```

---

# 🔮 Future Improvements

Planned features for next versions:

* Transaction history endpoint
* API documentation with Swagger
* Request validation with Zod
* Global error handler
* Rate limiting
* Automated tests (Jest + Supertest)
* Docker support
* Logging system

---

# 📜 License

MIT License

---

# 👨‍💻 Author

Developed by **Vitor Dutra Melo**

Backend Developer

