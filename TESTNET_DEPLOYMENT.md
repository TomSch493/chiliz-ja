# 🧪 Testnet Deployment Guide - Chiliz Spicy

## ⚠️ Important: You MUST redeploy the contract on Testnet

Your current contract `0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD` is deployed on **Chiliz Mainnet**.

To use the testnet, you need to:
1. Get testnet CHZ tokens
2. Deploy the contract on Chiliz Spicy Testnet
3. Update environment variables with new contract address

---

## Step 1: Configure MetaMask for Chiliz Spicy Testnet

### Network Details:
```
Network Name: Chiliz Spicy Testnet
RPC URL: https://spicy-rpc.chiliz.com
Chain ID: 88882
Currency Symbol: CHZ
Block Explorer: https://testnet.chiliscan.com
```

### Add to MetaMask:
1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Add Network" or "Add a network manually"
4. Enter the details above
5. Save

---

## Step 2: Get Testnet CHZ Tokens

### Faucet:
👉 **https://spicy-faucet.chiliz.com/**

1. Go to the faucet
2. Connect your wallet (MetaMask)
3. Request CHZ tokens
4. Wait for confirmation (~10 seconds)
5. You'll receive **10 CHZ** on testnet

**Note:** Testnet CHZ has NO real value - it's free!

---

## Step 3: Deploy Contract on Testnet

### Option A: Deploy with Remix (Recommended for testing)

1. **Open Remix**: https://remix.ethereum.org/

2. **Create new file**: `ChzPaymentSplitter.sol`

3. **Paste the contract code** (already in your `contracts/` folder)

4. **Compile:**
   - Click "Solidity Compiler" tab
   - Select compiler: `0.8.20`
   - Click "Compile"

5. **Deploy:**
   - Click "Deploy & Run Transactions" tab
   - Environment: **"Injected Provider - MetaMask"**
   - Make sure MetaMask is on **Chiliz Spicy Testnet**
   - Constructor parameters:
     ```
     _chzToken: 0x677F7e16C7Dd57be1D4C8aD1244883214953DC47
     _wallet1: 0x133e676148b785ebf67351ff806162803e3a042e
     _wallet2: 0x133e676148b785ebf67351ff806162803e3a042f
     _fixedAmount: 1000000000000000000
     ```
   - Click **"Deploy"**
   - Confirm in MetaMask

6. **Copy deployed address** and update your `.env` files

### Option B: Deploy with Hardhat

**Update `hardhat.config.ts`:**

\`\`\`typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    spicy: {
      url: "https://spicy-rpc.chiliz.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 88882,
    }
  }
};

export default config;
\`\`\`

**Create `.env` for Hardhat:**

\`\`\`bash
PRIVATE_KEY=your_metamask_private_key_here
\`\`\`

**Deploy:**

\`\`\`bash
npx hardhat run scripts/deploy.ts --network spicy
\`\`\`

---

## Step 4: Update Environment Variables

After deploying, update these files with your NEW testnet contract address:

### `.env`
\`\`\`bash
CHAIN_RPC_URL="https://spicy-rpc.chiliz.com"
CHZ_TOKEN_ADDRESS="0x677F7e16C7Dd57be1D4C8aD1244883214953DC47"
PAYMENT_CONTRACT_ADDRESS="YOUR_NEW_TESTNET_CONTRACT_ADDRESS"
\`\`\`

### `.env.local`
\`\`\`bash
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x677F7e16C7Dd57be1D4C8aD1244883214953DC47
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=YOUR_NEW_TESTNET_CONTRACT_ADDRESS
\`\`\`

### `.env.example`
Update for others to know testnet configuration.

---

## Step 5: Get Test CHZ Tokens (ERC20)

⚠️ **IMPORTANT:** The contract uses **wrapped CHZ tokens** (ERC20), not native CHZ!

You need to:

### Option A: Use WCHZ on Testnet
The testnet might have a wrapped CHZ token at: `0x677F7e16C7Dd57be1D4C8aD1244883214953DC47`

### Option B: Deploy a Mock ERC20 Token for Testing

Create `MockCHZ.sol`:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockCHZ is ERC20 {
    constructor() ERC20("Mock CHZ", "MCHZ") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1M tokens
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
\`\`\`

Deploy this mock token and use its address as `CHZ_TOKEN_ADDRESS`.

Then call `mint()` to give yourself test tokens:
\`\`\`javascript
mockChz.mint(yourAddress, ethers.parseEther("1000"))
\`\`\`

---

## Step 6: Restart Your App

\`\`\`bash
# Stop the current server (Ctrl+C)
# Restart with new environment variables
pnpm dev
\`\`\`

---

## Step 7: Test Payment Flow

1. **Open app**: http://localhost:3000
2. **Make sure MetaMask is on Chiliz Spicy Testnet** (Chain ID: 88882)
3. **Connect wallet**
4. **Get test tokens** (from faucet or mock contract)
5. **Try payment**

---

## Verification Checklist

Before testing payment:

- [ ] MetaMask is on **Chiliz Spicy Testnet** (Chain ID: 88882)
- [ ] You have **native CHZ** for gas fees (from faucet)
- [ ] You have **CHZ tokens (ERC20)** for payment (from mock contract or wrapped CHZ)
- [ ] Contract is deployed on **Spicy Testnet**
- [ ] `.env.local` has `NEXT_PUBLIC_CHAIN_ID=88882`
- [ ] App is restarted with new environment variables

---

## Testnet vs Mainnet Comparison

| | Testnet (Spicy) | Mainnet |
|---|---|---|
| **Chain ID** | 88882 | 88888 |
| **RPC** | https://spicy-rpc.chiliz.com | https://rpc.ankr.com/chiliz |
| **Explorer** | https://testnet.chiliscan.com | https://scan.chiliz.com |
| **Faucet** | ✅ Free CHZ | ❌ Must buy |
| **CHZ Value** | $0 (test only) | Real value |
| **For Testing** | ✅ Perfect | ❌ Use real money |

---

## Troubleshooting

### "Insufficient CHZ balance"

**Cause:** You don't have enough **CHZ tokens (ERC20)** in your wallet.

**Solution:**
1. Make sure you're on the correct network (Spicy Testnet)
2. Check your CHZ token balance (not native CHZ)
3. Get test tokens from mock contract or faucet

### "Wrong network"

**Cause:** MetaMask is on wrong network.

**Solution:**
1. Click MetaMask network dropdown
2. Select "Chiliz Spicy Testnet"
3. Refresh page

### "Contract not found"

**Cause:** Contract not deployed on current network.

**Solution:**
1. Deploy contract on Spicy Testnet
2. Update `.env.local` with new address
3. Restart app

---

## Quick Commands

\`\`\`bash
# Check current network in MetaMask console
window.ethereum.request({ method: 'eth_chainId' })
# Should return: 0x15b32 (88882 in hex)

# Check CHZ token balance
# In browser console after connecting
const balance = await chzToken.balanceOf(userAddress)
console.log(ethers.formatEther(balance))

# Check contract deployment
curl https://testnet.chiliscan.com/api/v1/addresses/YOUR_CONTRACT_ADDRESS
\`\`\`

---

## Summary

🎯 **To use testnet:**

1. ✅ Add Chiliz Spicy to MetaMask (Chain ID: 88882)
2. ✅ Get free CHZ from faucet
3. ✅ Deploy contract on Spicy Testnet (or deploy mock CHZ token)
4. ✅ Update `.env.local` with testnet config
5. ✅ Restart app
6. ✅ Test payment flow

**The contract MUST be on the same network as your MetaMask!**
