# 🚀 Chiliz Web3 Pay-to-Play App

A Next.js application with Web3 wallet authentication and CHZ token payment integration on the Chiliz blockchain.

## ✨ Features

- 🔐 **Wallet Authentication** - MetaMask integration with signature-based login
- 💳 **CHZ Payment** - One-time payment of 1 CHZ to unlock app access
- 🎯 **Smart Contract** - Automated 80/20 payment split to two wallets
- 🔒 **Protected Routes** - Access control based on payment status
- 📊 **Database Integration** - PostgreSQL with Prisma ORM
- 🎨 **Modern UI** - Beautiful gradient designs with smooth animations

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Web3:** ethers.js v6, MetaMask
- **Backend:** Next.js API Routes, JWT authentication
- **Database:** PostgreSQL, Prisma ORM
- **Blockchain:** Chiliz Chain (Chain ID: 88888)
- **Smart Contracts:** Solidity, Hardhat

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL
- MetaMask browser extension

### Installation

```bash
# Install dependencies
pnpm install

# Setup database
createdb chiliz_app

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Documentation

- **[ONBOARDING_IMPLEMENTATION.md](./ONBOARDING_IMPLEMENTATION.md)** - Complete onboarding flow guide
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Post-deployment checklist
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend setup guide
- **[CONTRACT_DEPLOYMENT.md](./CONTRACT_DEPLOYMENT.md)** - Smart contract deployment

## 🔐 Environment Variables

See `.env.example` for required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PAYMENT_CONTRACT_ADDRESS` - Deployed payment contract address
- `CHZ_TOKEN_ADDRESS` - CHZ token contract address

## 🎯 User Flow

1. **Connect Wallet** - User connects MetaMask
2. **Authenticate** - Sign message to prove ownership
3. **Pay 1 CHZ** - One-time payment to unlock access
4. **Access App** - Full access to protected features

## 📦 Smart Contract

Deployed on Chiliz Mainnet:
- **Address:** `0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD`
- **Payment:** 1 CHZ (fixed amount)
- **Split:** 80% to Wallet 1, 20% to Wallet 2

## 🧪 Testing

```bash
# Open Prisma Studio
pnpm prisma studio

# Run tests (if configured)
pnpm test
```

## 📝 License

MIT
