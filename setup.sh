#!/bin/bash

# 🚀 Backend Setup Script
# This script automates the initial setup of the Web3 backend

set -e  # Exit on error

echo "🎯 Starting Web3 Pay-to-Play Backend Setup..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from template..."
  cp .env.example .env
  echo "✅ .env file created"
  echo "⚠️  IMPORTANT: Please edit .env and fill in all TODO values!"
  echo ""
else
  echo "✅ .env file already exists"
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Check if database is accessible
echo "🔍 Checking database connection..."
if npx prisma db push --accept-data-loss 2>/dev/null; then
  echo "✅ Database connected successfully"
else
  echo "⚠️  Could not connect to database"
  echo "    Please check your DATABASE_URL in .env"
fi
echo ""

echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Edit .env file and fill in all TODO values:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - JWT_SECRET (generate a secure random string)"
echo "   - CHAIN_RPC_URL (Chiliz RPC endpoint)"
echo "   - CHZ_TOKEN_ADDRESS"
echo "   - STAKING_CONTRACT_ADDRESS"
echo "   - WALLET_1 and WALLET_2"
echo "   - FIXED_CHZ_AMOUNT (100 USD worth of CHZ in smallest unit)"
echo "   - MIN_STAKED_AMOUNT_CHZ (50 USD worth of CHZ in smallest unit)"
echo ""
echo "2. Run database migrations:"
echo "   npx prisma migrate dev --name init"
echo ""
echo "3. Deploy the smart contract:"
echo "   - Option A: Use Remix IDE with contracts/ChzPaymentSplitter.sol"
echo "   - Option B: Use Hardhat (see BACKEND_SETUP.md)"
echo ""
echo "4. Update PAYMENT_CONTRACT_ADDRESS in .env with deployed address"
echo ""
echo "5. Start the development server:"
echo "   pnpm dev"
echo ""
echo "📚 For detailed instructions, see BACKEND_SETUP.md"
