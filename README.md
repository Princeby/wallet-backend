# Wallet Management API

A backend API for managing users and their cryptocurrency wallets built with **Express.js**, **TypeScript**, and **PostgreSQL**.

## Features

- User authentication (register, sign-in, sign-out)
- Wallet management (CRUD operations)
- JWT-based authentication
- PostgreSQL database storage
- TypeScript for type safety

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

### Clone the repository:

```bash
git clone https://github.com/Princeby/wallet-backend.git
cd wallet-backend
```

### Install dependencies:

```bash
npm install
```

### Create the PostgreSQL database:

```bash
createdb wallet_db
```

## Running the Application

### Development Mode

```bash
npm run dev
```


## Project Structure

```
wallet-api/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── walletController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── index.ts
│   │   ├── User.ts
│   │   ├── Wallet.ts
│   │   └── Chain.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── wallet.ts
│   │   └── index.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication

#### `POST /api/auth/register` – Register a new user

- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User object with JWT token

---

#### `POST /api/auth/signin` – Sign in a user

- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User object with JWT token

---

#### `POST /api/auth/signout` – Sign out a user

- **Request Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:** Success message

---

### Wallets

#### `GET /api/wallets` – Get all wallets for the authenticated user

- **Request Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:** Array of wallet objects

---

#### `POST /api/wallets` – Create a new wallet

- **Request Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:**
  ```json
  {
    "tag": "optional string",
    "chain": "string",
    "address": "string"
  }
  ```
- **Response:** Wallet object

---

#### `GET /api/wallets/:id` – Get a specific wallet by ID

- **Request Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:** Wallet object

---

#### `PUT /api/wallets/:id` – Update a wallet

- **Request Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:**
  ```json
  {
    "tag": "optional string",
    "chain": "optional string",
    "address": "optional string"
  }
  ```
- **Response:** Updated wallet object

---

#### `DELETE /api/wallets/:id` – Delete a wallet

- **Request Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:** Success message

---

## Error Handling

The API returns appropriate HTTP status codes:

- `200` – Success  
- `201` – Created successfully  
- `400` – Bad request (invalid input)  
- `401` – Unauthorized (invalid or missing token)  
- `404` – Resource not found  
- `409` – Conflict (resource already exists)  
- `500` – Server error  

## Security

- Passwords are hashed using **bcrypt**
- Authentication is handled with **JWT tokens**
- Input validation for all API endpoints
- Uses **Helmet** middleware for enhanced security headers

## API Testing

Use **Postman** or any API testing tool. A sample Postman collection is included in the repository.

## License

MIT
