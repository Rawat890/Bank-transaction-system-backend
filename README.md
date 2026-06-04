# 🏦 Banking Ledger System — Backend

A robust **RESTful backend API** for a banking transaction and ledger management system. Built with **Node.js**, **Express**, **MongoDB**, and **Nodemailer**, this system handles user registration, authentication, financial transactions, and automated email notifications.

---

## 📋 Table of Contents

- [What is a Banking Ledger System?](#-what-is-a-banking-ledger-system)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Email Notifications](#-email-notifications)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 What is a Banking Ledger System?

A **ledger** is the core accounting record of a bank. In traditional banking, a ledger records every financial transaction — deposits, withdrawals, transfers, and payments — against each account. It is the single source of truth for account balances and transaction history.

### Double-Entry Bookkeeping

Banks use **double-entry bookkeeping**, meaning every transaction affects at least two accounts:

| Transaction | Debit | Credit |
|---|---|---|
| Customer deposits ₹10,000 | Cash Account | Customer Account |
| Customer withdraws ₹5,000 | Customer Account | Cash Account |
| Transfer between accounts | Sender Account | Receiver Account |

This ensures the ledger always **balances** — total debits always equal total credits.

### How Banks Use Ledgers

- **General Ledger** — master record of all accounts and transactions
- **Account Ledger** — per-customer transaction history
- **Balance Sheet** — derived from ledger entries (assets, liabilities, equity)
- **Audit Trail** — every entry is immutable and timestamped for compliance

This system digitizes that process, storing ledger entries in MongoDB and providing an API for all banking operations.

---

## ⚙️ How It Works

```
Client Request
     │
     ▼
Express Router
     │
     ▼
Auth Middleware (JWT verification)
     │
     ▼
Controller (Business Logic)
     │
     ├──▶ MongoDB (via Mongoose)
     │         └── Ledger Entries, Accounts, Users
     │
     └──▶ Nodemailer (Gmail SMTP)
               └── Transaction Alerts, Registration Emails
```

### Transaction Flow

1. **User authenticates** via JWT token
2. **Transaction is validated** (sufficient balance, valid account, etc.)
3. **Ledger entries are created** — both sides of the transaction are recorded atomically
4. **Account balances are updated** in real time
5. **Email notification is sent** to the user confirming the transaction
6. **Response is returned** with the updated balance and transaction ID

---

## ✨ Features

- 🔐 **JWT Authentication** — secure login and session management
- 👤 **User Registration & Profiles** — with welcome email on signup
- 💳 **Account Management** — create and manage bank accounts
- 💸 **Transactions** — deposits, withdrawals, and transfers
- 📒 **Ledger History** — full immutable transaction history per account
- 📧 **Email Notifications** — automated emails via Gmail SMTP (App Password)
- 🔒 **Password Hashing** — bcrypt-based secure password storage
- 🍪 **Cookie-based Sessions** — HTTP-only cookies for secure auth
- 📁 **File Uploads** — Multer integration for document handling
- 🌐 **CORS Enabled** — cross-origin support for frontend integration

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express v5 |
| Database | MongoDB (Atlas) + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Email | Nodemailer + Gmail SMTP |
| Password Security | bcryptjs |
| File Uploads | Multer |
| Environment Config | dotenv |
| Dev Server | Nodemon |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account
- A Gmail account with **2FA enabled** and an **App Password** generated

### Installation

```bash
# Clone the repository
git clone https://github.com/Rawat890/Bank-transaction-system-backend.git
cd Bank-transaction-system-backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Fill in your values (see Environment Variables below)

# Start the development server
npm start
```

The server will start at `http://localhost:3400`.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Server
PORT=3400

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/banking-ledger

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
APP_PASSWORD=your16charapppassword

# Cookie
COOKIE_SECRET=your_cookie_secret
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

### Setting Up Gmail App Password

1. Enable **2-Step Verification** on your Google account at [myaccount.google.com/security](https://myaccount.google.com/security)
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create a new app password (name it `Nodemailer`)
4. Copy the 16-character password **without spaces** into `APP_PASSWORD`

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/auth/logout` | Logout and clear cookie |

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/accounts` | Create a new bank account |
| `GET` | `/api/accounts/:id` | Get account details |
| `GET` | `/api/accounts/:id/balance` | Get current balance |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions/deposit` | Deposit funds |
| `POST` | `/api/transactions/withdraw` | Withdraw funds |
| `POST` | `/api/transactions/transfer` | Transfer between accounts |
| `GET` | `/api/transactions/:accountId` | Get transaction history (ledger) |

---

## 📁 Project Structure

```
Bank-transaction-system-backend/
├── .env                    # Environment variables (not committed)
├── .env.example            # Example env template
├── server.js               # Entry point
├── package.json
└── src/
    ├── config/
    │   ├── db.js           # MongoDB connection
    │   └── emailConfig.js  # Nodemailer transporter
    ├── controllers/
    │   ├── authController.js
    │   ├── accountController.js
    │   └── transactionController.js
    ├── middleware/
    │   └── authMiddleware.js  # JWT verification
    ├── models/
    │   ├── User.js
    │   ├── Account.js
    │   └── Transaction.js     # Ledger entries
    └── routes/
        ├── authRoutes.js
        ├── accountRoutes.js
        └── transactionRoutes.js
```

---

## 📧 Email Notifications

This system sends automated emails for:

- ✅ **Welcome email** on user registration
- 💸 **Transaction confirmation** on deposit/withdrawal/transfer
- 🔔 **Low balance alert** (if configured)

Emails are sent using **Nodemailer** with Gmail SMTP over port 465 (SSL).

```javascript
// Example: Nodemailer transporter config
nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,  // Gmail App Password
  },
});
```

---

## 🔒 Security

- Passwords are hashed with **bcryptjs** (never stored in plain text)
- Auth tokens are **HTTP-only cookies** (not accessible via JavaScript)
- **JWT** tokens expire and must be refreshed
- **CORS** is configured to allow only trusted origins
- Environment secrets are stored in `.env` and never committed to Git
- MongoDB connection uses **Atlas** with IP whitelisting

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/Rawat890">Rawat890</a></p>
