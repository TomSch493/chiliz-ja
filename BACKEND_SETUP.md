# Web3 Pay-to-Play Backend - Setup Guide

## 🎯 Overview

This is a complete backend implementation for a Web3 pay-to-play application using:
- **Next.js 16** (App Router)
- **TypeScript**
- **Prisma** + **PostgreSQL**
- **ethers.js v6** for blockchain interactions
- **MetaMask** wallet authentication
- **JWT sessions** stored in PostgreSQL

## 📋 Prerequisites

- Node.js 18+ and pnpm/npm
- PostgreSQL database
- MetaMask browser extension
- Access to Chiliz blockchain RPC

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

**IMPORTANT: Fill in all TODO values in `.env`:**

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Generate a secure random string
- `CHAIN_RPC_URL`: Chiliz RPC endpoint
- `CHZ_TOKEN_ADDRESS`: CHZ token contract address
- `PAYMENT_CONTRACT_ADDRESS`: Your deployed payment splitter contract (see deployment steps)
- `STAKING_CONTRACT_ADDRESS`: Staking contract address
- `FIXED_CHZ_AMOUNT`: 100 USD worth of CHZ in smallest unit (wei-like)
- `MIN_STAKED_AMOUNT_CHZ`: 50 USD worth of CHZ in smallest unit
- `WALLET_1`: Wallet receiving 80% of payments
- `WALLET_2`: Wallet receiving 20% of payments

### 3. Setup Database

Initialize Prisma and run migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Deploy Smart Contract

The Solidity contract is in `contracts/ChzPaymentSplitter.sol`.

**Manual Deployment Steps:**

1. Use Remix IDE, Hardhat, or Foundry to compile and deploy
2. Constructor parameters needed:
   - `_chzToken`: CHZ token address on Chiliz chain
   - `_wallet1`: Address to receive 80%
   - `_wallet2`: Address to receive 20%
   - `_fixedAmount`: Payment amount in CHZ smallest unit

3. After deployment, copy the contract address to `.env` as `PAYMENT_CONTRACT_ADDRESS`

**Example with Hardhat (optional setup):**

```bash
# Install Hardhat
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat (follow prompts)
npx hardhat init

# Compile contract
npx hardhat compile

# Deploy (you'll need to create a deployment script)
npx hardhat run scripts/deploy.ts --network chiliz
```

### 5. Start Development Server

```bash
pnpm dev
```

Your app will be running on `http://localhost:3000`

## 🏗️ Architecture

### Database Models

- **User**: Stores wallet addresses and auth nonces
- **Session**: JWT-based sessions with expiration
- **Payment**: Tracks on-chain payment transactions

### API Routes

#### Authentication
- `POST /api/auth/nonce` - Generate nonce for wallet signing
- `POST /api/auth/verify` - Verify signature and create session
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Destroy session

#### Payment
- `POST /api/payment/initiate` - Get contract config for payment
- `POST /api/payment/confirm` - Verify and record payment transaction
- `GET /api/payment/status` - Check if user has paid

#### Staking
- `GET /api/staking/status` - Check user's staking status

### React Hooks

- `useWalletAuth()` - MetaMask connection and authentication
- `useChzPayment()` - Payment flow (approve + pay)
- `useStakingStatus()` - Fetch staking status

## 🔐 Security Features

- **Nonce-based authentication**: Prevents replay attacks
- **Signature verification**: Ensures wallet ownership
- **HTTP-only cookies**: Protects against XSS
- **JWT with expiration**: 7-day sessions
- **On-chain verification**: Backend verifies all transactions

## 🔧 Development Tools

### Prisma Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Database Seeding (Optional)

Create `prisma/seed.ts` to add test data:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Add seed data here
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## 📝 Frontend Integration Example

### 1. Wallet Connection

```tsx
'use client'
import { useWalletAuth } from '@/hooks/useWalletAuth'

export function ConnectWalletButton() {
  const { isAuthenticated, address, connectWallet, disconnectWallet } = useWalletAuth()

  return (
    <button onClick={isAuthenticated ? disconnectWallet : connectWallet}>
      {isAuthenticated ? `Disconnect ${address}` : 'Connect Wallet'}
    </button>
  )
}
```

### 2. Payment Flow

```tsx
'use client'
import { useChzPayment } from '@/hooks/useChzPayment'
import { useRouter } from 'next/navigation'

export function PaymentButton() {
  const { isProcessing, step, executePayment } = useChzPayment()
  const router = useRouter()

  const handlePay = async () => {
    const result = await executePayment()
    if (result.success) {
      router.push('/memories')
    }
  }

  return (
    <button onClick={handlePay} disabled={isProcessing}>
      {isProcessing ? `${step}...` : 'Pay 100 USD in CHZ'}
    </button>
  )
}
```

### 3. Staking Status

```tsx
'use client'
import { useStakingStatus } from '@/hooks/useStakingStatus'
import { Badge } from '@/components/ui/badge'

export function StakingBadge() {
  const { status, hasStaked } = useStakingStatus()

  return (
    <Badge variant={hasStaked ? 'default' : 'secondary'}>
      {hasStaked ? 'Has staked' : 'Waiting for staking'}
    </Badge>
  )
}
```

## 🧪 Testing

### Test MetaMask Connection

1. Install MetaMask
2. Add Chiliz network to MetaMask
3. Get test CHZ tokens
4. Visit your app and click "Connect Wallet"

### Test Payment Flow

1. Ensure you have sufficient CHZ
2. Click "Pay" button
3. Approve token spending in MetaMask
4. Confirm payment transaction
5. Should redirect to `/memories` on success

### Test Staking Check

1. Stake CHZ in the staking contract
2. Refresh the page
3. Badge should show "Has staked"

## 📦 Production Deployment

### Environment Setup

1. Setup production PostgreSQL database
2. Update all environment variables
3. Set `NODE_ENV=production`
4. Use strong JWT_SECRET

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

Configure environment variables in Vercel dashboard.

## 🐛 Troubleshooting

### Prisma Client Error

If you see "PrismaClient is not configured", run:
```bash
npx prisma generate
```

### MetaMask Not Detected

Ensure MetaMask extension is installed and enabled.

### Transaction Verification Failed

Check that:
- `PAYMENT_CONTRACT_ADDRESS` is correct
- Transaction was sent to the correct contract
- Transaction succeeded on-chain

### Database Connection Error

Verify `DATABASE_URL` format:
```
postgresql://username:password@host:port/database?schema=public
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Chiliz Chain Documentation](https://docs.chiliz.com/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review environment variables
3. Check Prisma Studio for database state
4. Verify on-chain transactions on block explorer

---

**Ready to build!** Start by filling in the `.env` file, then follow the setup steps above.
