<div align="center">

# 🌿 Urban Farming Platform — Backend API

**A scalable, production-ready backend for managing urban farms, organic markets, and plant communities.**

</div>

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

---


## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org) `v22+`
- [npm](https://www.npmjs.com) `v9+`
- [PostgreSQL](https://www.postgresql.org) (or use Docker)

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
DATABASE_URL="your_database_url"

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

```bash
npx prisma generate
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

## 🧰 Useful Commands

```bash
# Regenerate Prisma Client after schema changes
npx prisma generate

# add seed data
npx prisma db seed

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

<div align="center">
  Made with ❤️ for Bikash Chandra
</div>

