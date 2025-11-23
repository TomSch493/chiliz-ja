# Smart Contract Deployment Guide

Since Hardhat 3.0 requires ES modules which conflicts with Next.js, here are your deployment options:

## Option 1: Remix IDE (Recommended - Easiest) ⭐

1. **Open Remix IDE**: https://remix.ethereum.org

2. **Create new file**: `ChzPaymentSplitter.sol`

3. **Copy contract** from `contracts/ChzPaymentSplitter.sol`

4. **Compile**:
   - Select Solidity compiler 0.8.20
   - Click "Compile ChzPaymentSplitter.sol"

5. **Connect MetaMask**:
   - Go to "Deploy & Run Transactions" tab
   - Environment: Select "Injected Provider - MetaMask"
   - Ensure you're connected to Chiliz network

6. **Deploy with constructor parameters**:
   ```
   _chzToken: 0x... (CHZ token address on Chiliz)
   _wallet1: 0x133e676148b785ebf67351ff806162803e3a042e
   _wallet2: 0x133e676148b785ebf67351ff806162803e3a042f
   _fixedAmount: 1000000000000000000 (1 CHZ in wei)
   ```

7. **Copy deployed address** and add to `.env`:
   ```bash
   PAYMENT_CONTRACT_ADDRESS="0x_your_deployed_address"
   ```

## Option 2: Foundry (Alternative)

If you prefer command-line deployment:

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy
forge create contracts/ChzPaymentSplitter.sol:ChzPaymentSplitter \
  --rpc-url $CHAIN_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --constructor-args \
    $CHZ_TOKEN_ADDRESS \
    $WALLET_1 \
    $WALLET_2 \
    $FIXED_CHZ_AMOUNT
```

## Option 3: Hardhat in Separate Directory

Create a separate Hardhat project:

```bash
# Create new directory
mkdir contract-deployment
cd contract-deployment

# Initialize Node project with ES modules
npm init -y
npm pkg set type="module"

# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Copy contract
cp ../contracts/ChzPaymentSplitter.sol contracts/

# Deploy
npx hardhat run scripts/deploy.js --network chiliz
```

## Recommended Approach

**Use Remix IDE** - it's the fastest and doesn't require any additional setup!

### Chiliz Network Configuration for MetaMask

If you haven't added Chiliz to MetaMask:

**Chiliz Mainnet:**
- Network Name: Chiliz Chain
- RPC URL: https://rpc.ankr.com/chiliz
- Chain ID: 88888
- Currency Symbol: CHZ
- Block Explorer: https://scan.chiliz.com/

**Chiliz Testnet (Spicy):**
- Network Name: Chiliz Spicy Testnet
- RPC URL: https://spicy-rpc.chiliz.com
- Chain ID: 88882
- Currency Symbol: CHZ
- Block Explorer: https://testnet.chiliscan.com/

## After Deployment

Update your `.env` file:

```bash
# Copy from .env.example if needed
cp .env.example .env

# Update with your deployed contract address
PAYMENT_CONTRACT_ADDRESS="0x_your_deployed_address_here"
```

Then continue with the backend setup:

```bash
npx prisma generate
npx prisma migrate dev --name init
pnpm dev
```

## Verify Contract (Optional)

On Remix, you can verify directly or use:

```bash
npx hardhat verify --network chiliz DEPLOYED_ADDRESS \\
  CHZ_TOKEN_ADDRESS \\
  WALLET_1 \\
  WALLET_2 \\
  FIXED_CHZ_AMOUNT
```

---

**Tip**: Test on Chiliz Spicy testnet first before deploying to mainnet!
