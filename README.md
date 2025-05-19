# Wallet Management API

A backend API for managing users and their cryptocurrency wallets built with **Express.js**, **TypeScript**, and **PostgreSQL**.

---

## ✨ Features

- User authentication (register, sign-in, sign-out)
- Wallet management (CRUD operations)
- JWT-based authentication
- PostgreSQL database storage
- TypeScript for type safety

---

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (see setup instructions below)

---

## 🐘 PostgreSQL Setup

### ✅ If You Already Have PostgreSQL Installed

1. Make sure PostgreSQL is running.
2. Create the database:

    ```bash
    createdb wallet_db
    ```

3. Update your `.env` file with the database credentials.

---

### ❌ If You Don't Have PostgreSQL Installed

#### macOS

Install PostgreSQL using Homebrew:

```bash
brew install postgresql
brew services start postgresql
createdb wallet_db
```

#### Windows

1. Download and install from:  
   [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Set a password during installation.
3. After installation:
    - Open **SQL Shell (psql)**.
    - Run:
      ```sql
      CREATE DATABASE wallet_db;
      ```

#### Ubuntu / Linux

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb wallet_db
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Princeby/wallet-backend.git
cd wallet-backend
```

### 2. Install dependencies

```bash
npm install
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/wallet_db
JWT_SECRET=your_jwt_secret
```

**Example:**

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/wallet_db
```

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

---

## 📁 Project Structure

```
wallet-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## 📡 API Endpoints

### 🔐 Authentication

- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/signin` – Sign in a user  
- `POST /api/auth/signout` – Sign out a user

---

### 👛 Wallets

- `GET /api/wallets` – Get all wallets  
- `POST /api/wallets` – Create a new wallet  
- `GET /api/wallets/:id` – Get a wallet by ID  
- `PUT /api/wallets/:id` – Update a wallet  
- `DELETE /api/wallets/:id` – Delete a wallet

---

## ⚠️ Error Handling

- `200` – Success  
- `201` – Created  
- `400` – Bad request  
- `401` – Unauthorized  
- `404` – Not found  
- `409` – Conflict  
- `500` – Server error  

---

## 🔐 Security

- Passwords hashed using **bcrypt**
- Authentication via **JWT tokens**
- Input validation and **Helmet** middleware for HTTP security

---

## 🧪 API Testing

Use **Postman** or any API testing tool.  
A sample Postman collection is included in the repository.

---

## 📄 License

MIT