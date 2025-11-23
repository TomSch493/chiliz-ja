# 🎮 Chiliz Web3 Pay-to-Play App

A complete Web3 pay-to-play application built with Next.js, featuring MetaMask authentication, on-chain CHZ payments, and staking verification on the Chiliz blockchain.

## 🌟 Features

### ✅ Implemented Backend
- **Wallet Authentication**: MetaMask integration with signature-based login
- **Payment Processing**: Fixed 100 USD CHZ payments with 80/20 split
- **Staking Verification**: Check if users have staked minimum 50 USD worth of CHZ
- **Session Management**: JWT-based sessions with HTTP-only cookies
- **Database Persistence**: PostgreSQL with Prisma ORM
- **Smart Contract**: Solidity payment splitter contract

### 🎯 Frontend
- Next.js 16 with App Router
- React 19 with TypeScript
- Tailwind CSS + shadcn/ui components
- Responsive design
- Dark mode support

## 📁 Project Structure

```
chiliz-ja/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── payment/           # Payment endpoints
│   │   └── staking/           # Staking endpoints
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── wallet-connect-card.tsx
│   ├── payment-card.tsx
│   └── staking-status-card.tsx
├── contracts/
│   └── ChzPaymentSplitter.sol # Smart contract
├── hooks/
│   ├── useWalletAuth.ts       # Wallet connection hook
│   ├── useChzPayment.ts       # Payment flow hook
│   └── useStakingStatus.ts    # Staking status hook
├── lib/
│   ├── auth.ts                # Auth utilities
│   ├── ethers.ts              # Blockchain utilities
│   ├── prisma.ts              # Database client
│   └── utils.ts               # Helper functions
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── deploy.ts              # Contract deployment
├── .env.example               # Environment template
├── BACKEND_SETUP.md           # Setup guide
├── CHECKLIST.md               # Implementation checklist
├── DEPLOYMENT.md              # Deployment guide
└── API_REFERENCE.md           # API documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database
- MetaMask browser extension

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env and fill in all TODO values
```

**Required environment variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secure string
- `CHAIN_RPC_URL` - Chiliz RPC endpoint
- `CHZ_TOKEN_ADDRESS` - CHZ token contract
- `PAYMENT_CONTRACT_ADDRESS` - Your deployed contract
- `STAKING_CONTRACT_ADDRESS` - Staking contract
- `FIXED_CHZ_AMOUNT` - Payment amount (100 USD in CHZ)
- `MIN_STAKED_AMOUNT_CHZ` - Minimum stake (50 USD in CHZ)
- `WALLET_1` - Receives 80% of payments
- `WALLET_2` - Receives 20% of payments

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) View database
npx prisma studio
```

### 4. Deploy Smart Contract

See `BACKEND_SETUP.md` for detailed instructions.

**Quick option using Remix:**
1. Copy `contracts/ChzPaymentSplitter.sol` to Remix IDE
2. Compile and deploy with constructor parameters
3. Copy deployed address to `.env`

### 5. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## 📚 Documentation

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Complete setup guide
- **[CHECKLIST.md](./CHECKLIST.md)** - Implementation checklist
- **[API_REFERENCE.md](./API_REFERENCE.md)** - API endpoints reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Overview of what's been built

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/nonce` - Generate authentication nonce
- `POST /api/auth/verify` - Verify signature and create session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Payment
- `POST /api/payment/initiate` - Get payment configuration
- `POST /api/payment/confirm` - Confirm transaction
- `GET /api/payment/status` - Check payment status

### Staking
- `GET /api/staking/status` - Get staking status

See [API_REFERENCE.md](./API_REFERENCE.md) for detailed documentation.

## 🎨 Frontend Integration

### Connect Wallet

```tsx
import { WalletConnectCard } from '@/components/wallet-connect-card'

export default function Page() {
  return <WalletConnectCard />
}
```

### Payment Flow

```tsx
import { PaymentCard } from '@/components/payment-card'

export default function PaymentPage() {
  return <PaymentCard />
  // Automatically redirects to /memories on success
}
```

### Staking Status

```tsx
import { StakingStatusCard } from '@/components/staking-status-card'

export default function ProfilePage() {
  return <StakingStatusCard />
}
```

## 🔐 Security

- ✅ Signature-based authentication (no passwords)
- ✅ HTTP-only session cookies
- ✅ JWT with expiration
- ✅ On-chain transaction verification
- ✅ SQL injection protection (Prisma)
- ✅ Input validation (Zod)
- ✅ Nonce prevents replay attacks

## 🧪 Testing

### Test Wallet Connection
1. Install MetaMask
2. Add Chiliz network
3. Get test CHZ tokens
4. Connect wallet in app

### Test Payment
1. Ensure wallet has CHZ
2. Click "Pay" button
3. Approve token spending
4. Confirm payment
5. Should redirect to `/memories`

### Test Staking
1. Stake CHZ in staking contract
2. Refresh app
3. Should show "Has staked" badge

## 📦 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Blockchain**: ethers.js v6
- **Authentication**: JWT + MetaMask signatures
- **UI**: Tailwind CSS + shadcn/ui
- **Smart Contracts**: Solidity 0.8.20
- **Validation**: Zod

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

### Railway

```bash
railway up
```

### Self-hosted

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🛠️ Development

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# View database
npx prisma studio

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### Smart Contract Commands

```bash
# Compile
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.ts --network chiliz

# Verify
npx hardhat verify --network chiliz DEPLOYED_ADDRESS ...args
```

## 📝 Environment Setup

See `.env.example` for all required environment variables.

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check [CHECKLIST.md](./CHECKLIST.md) troubleshooting section
2. Review [BACKEND_SETUP.md](./BACKEND_SETUP.md)
3. Check environment variables
4. Verify smart contract deployment

## 🎉 What's Included

- ✅ Complete backend implementation
- ✅ Smart contract for payment splitting
- ✅ React hooks for Web3 interactions
- ✅ Example UI components
- ✅ Database schema and migrations
- ✅ API routes with authentication
- ✅ TypeScript types throughout
- ✅ Comprehensive documentation
- ✅ Deployment guides
- ✅ Setup automation scripts

## 🏗️ Built With

This project was scaffolded with [v0.dev](https://v0.dev) and enhanced with a complete Web3 backend.

---

**Status**: ✅ Backend complete and ready for configuration!

**Created**: November 22, 2025

For detailed setup instructions, see [BACKEND_SETUP.md](./BACKEND_SETUP.md)
