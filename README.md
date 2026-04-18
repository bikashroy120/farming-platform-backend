<div align="center">

# 🌿 Urban Farming Platform — Backend API

**A scalable, production-ready backend for managing urban farms, organic markets, and plant communities.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Docker Setup](#-docker-setup)
- [API Overview](#-api-overview)
- [Useful Commands](#-useful-commands)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based login with Role-Based Access Control (RBAC) |
| 🌾 **Farm Rental System** | Location-based farm discovery and rental management |
| 🛒 **Organic Marketplace** | Buy and sell organic produce with ease |
| 🌱 **Real-time Plant Tracking** | Live plant growth updates via Socket.io |
| 💬 **Community Forum** | Discussion board for urban farming enthusiasts |
| 🧾 **Sustainability Certification** | Track and issue sustainability badges |
| ⚡ **Rate Limiting & Pagination** | Secure and performant API responses |

---

## 🛠 Tech Stack

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** Socket.io
- **Auth:** JWT (Access + Refresh Tokens)
- **Containerization:** Docker & Docker Compose

---

## 📁 Project Structure

```
urban-farming-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration history
├── src/
│   ├── config/             # App configuration
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Auth, rate limiting, error handling
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── sockets/            # Socket.io event handlers
│   ├── utils/              # Helper functions
│   └── server.ts           # App entry point
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org) `v18+`
- [npm](https://www.npmjs.com) `v9+`
- [PostgreSQL](https://www.postgresql.org) (or use Docker)
- [Docker](https://www.docker.com) *(optional, for containerized setup)*

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/urban-farming-backend.git

# 2. Navigate into the project directory
cd urban-farming-backend

# 3. Install all dependencies
npm install
```

---

### Environment Variables

Create a `.env` file in the project root and fill in the following values:

```env
# App
NODE_ENV="development"
PORT=5000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/urban_farming_db"

# JWT Secrets
ACCESS_TOKEN_SECRET=your_strong_access_secret_here
REFRESH_TOKEN_SECRET=your_strong_refresh_secret_here
```

> **💡 Tip:** Never use weak secrets in production. Always use a strong, randomly generated string.

---

### Database Setup

After setting the correct `DATABASE_URL` in your `.env` file, run the following command to apply database migrations:

```bash
npx prisma migrate dev --name init
```

---

### Running the App

**Development Mode** *(with hot-reload)*:

```bash
npm run dev
```

**Production Mode** *(build then start)*:

```bash
# Step 1: Compile TypeScript
npm run build

# Step 2: Start the server
npm start
```

Once running successfully, you should see:

```
🚀 Server is running on http://localhost:5000
🔌 Socket.io is ready
📦 Connected to PostgreSQL via Prisma
```

---

## 🐳 Docker Setup

Run the entire environment (App + Database) with a single command using Docker:

```bash
docker-compose up --build
```

To stop all running services:

```bash
docker-compose down
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive tokens |
| `GET` | `/api/farms` | Get a list of all farms |
| `POST` | `/api/farms/:id/rent` | Rent a specific farm |
| `GET` | `/api/marketplace` | Browse all marketplace listings |
| `POST` | `/api/marketplace` | Create a new product listing |
| `GET` | `/api/forum/posts` | Fetch all forum posts |
| `GET` | `/api/plants/:id/track` | Track a plant in real-time |

> For the full API reference, see the [Postman Collection](#).

---

## 🧰 Useful Commands

```bash
# Regenerate Prisma Client after schema changes
npx prisma generate

# Open Prisma Studio to visually browse the database
npx prisma studio

# Compile TypeScript
npm run build

# Run linting checks
npm run lint
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ for Urban Farmers
</div>

