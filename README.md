# 💳 Payment & Wallet API

A full-stack **Digital Wallet API** that simulates a real-world financial system, allowing users to register, authenticate, manage balances, deposit funds, and transfer money securely between accounts.

🚀 This project was built to demonstrate **backend engineering skills**, including authentication, transactional logic, validation, and production-ready architecture.

---

## 🌐 Live Demo

🔗 API Base URL:
https://payment-wallet-api.onrender.com

📄 API Documentation (Swagger):
https://payment-wallet-api.onrender.com/docs

---

## ✨ Features

### 🔐 Authentication

* User registration
* Secure password hashing with bcrypt
* JWT-based authentication

### 💰 Wallet System

* Automatic wallet creation on registration
* Real-time balance tracking
* Deposit funds with validation and limits

### 🔁 Transfers

* Transfer money using **email (unique identifier)**
* Prevent self-transfers
* Prevent insufficient balance transfers
* Enforced maximum balance limit (1,000,000)
* Atomic database transactions (Prisma)

### 🛡️ Security & Validation

* Input validation with **Zod**
* Global error handling middleware
* Protected routes using JWT

### 📄 API Documentation

* Interactive API documentation with **Swagger UI**
* Test endpoints directly from the browser

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL (Neon)
* JWT (Authentication)
* bcrypt (Password hashing)
* Zod (Validation)

### Tools & Dev

* Swagger UI (API documentation)
* Thunder Client / Postman
* Git & GitHub

---

## 📂 Project Structure

```
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validations/
├── utils/
├── config/
└── lib/
```

### 🧠 Architecture

```
Route → Controller → Service → Database
```

---

## 📌 API Endpoints

### 🔐 Auth

#### Register

```
POST /auth/register
```

```json
{
  "name": "Vitor",
  "email": "vitor@email.com",
  "password": "123456"
}
```

---

#### Login

```
POST /auth/login
```

```json
{
  "email": "vitor@email.com",
  "password": "123456"
}
```

---

### 💰 Wallet

#### Get Balance

```
GET /wallet/balance
Authorization: Bearer TOKEN
```

---

#### Deposit

```
POST /wallet/deposit
```

```json
{
  "amount": 100
}
```

---

#### Transfer

```
POST /wallet/transfer
```

```json
{
  "toEmail": "user@email.com",
  "amount": 50
}
```

---

## 🗄️ Database Schema

### Models:

* User
* Wallet
* Transaction

### Relationships:

* User → Wallet (1:1)
* Wallet → Transactions (1:N)

---

## ⚙️ Environment Variables

Create a `.env` file:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=3000
```

---

## ▶️ Running Locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## 🧪 API Testing

Access Swagger:

```
http://localhost:3000/docs
```

---

## 🚀 Future Improvements

* Transaction filtering & pagination
* Rate limiting
* Unit & integration tests (Jest)
* Docker support
* Logging system
* Email verification system

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Vitor Dutra Melo**
Backend Developer

📍 London, UK
📧 [vitordutra1125@gmail.com](mailto:vitordutra1125@gmail.com)

---

## 💡 About This Project

This project was developed as part of my journey to becoming a professional backend developer, focusing on building **real-world systems with production-level practices**.

---

⭐ If you found this project interesting, feel free to give it a star!

