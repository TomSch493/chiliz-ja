# 🚨 IMPORTANT: Testnet Configuration Required

## Your Current Issue

You're getting this error:
```
"Insufficient CHZ balance"
```

**Reason:** The contract was deployed on **Chiliz Mainnet** but you're trying to use it without the proper CHZ tokens.

---

## ✅ Solution: Use Chiliz Spicy Testnet

I've already configured the app for testnet. Now you need to:

### 1️⃣ Add Chiliz Spicy Testnet to MetaMask

**Network Configuration:**
```
Network Name: Chiliz Spicy Testnet
RPC URL: https://spicy-rpc.chiliz.com
Chain ID: 88882
Currency Symbol: CHZ
Block Explorer: https://testnet.chiliscan.com
```

**Steps:**
1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network"
4. Enter details above
5. Save

### 2️⃣ Get FREE Testnet CHZ

👉 **https://spicy-faucet.chiliz.com**

1. Go to faucet
2. Connect wallet
3. Request CHZ
4. Get 10 free testnet CHZ

### 3️⃣ Deploy Mock CHZ Token (For Testing)

Since your contract needs **CHZ tokens (ERC20)**, not native CHZ, you need to deploy a mock token:

**Option A: Quick Deploy with Remix**

1. Go to https://remix.ethereum.org/
2. Create new file: `MockCHZ.sol`
3. Copy code from: `/contracts/MockCHZ.sol`
4. Compile with Solidity 0.8.20
5. Deploy:
   - Environment: "Injected Provider - MetaMask"
   - Make sure MetaMask is on **Chiliz Spicy Testnet**
   - Click "Deploy"
   - Confirm in MetaMask
6. **Copy the deployed MockCHZ address**

**Option B: Use Hardhat**

\`\`\`bash
# Deploy mock CHZ token
npx hardhat run scripts/deploy-mock.ts --network spicy
\`\`\`

### 4️⃣ Mint Test Tokens to Yourself

After deploying MockCHZ:

1. In Remix, find the deployed contract
2. Call `gimme()` function
3. This gives you 1000 test tokens
4. Or call `mint(1000000000000000000000)` for 1000 tokens

### 5️⃣ Deploy Payment Contract on Testnet

1. Go to Remix
2. Open `ChzPaymentSplitter.sol`
3. Deploy with these parameters:
   ```
   _chzToken: [YOUR_MOCK_CHZ_ADDRESS]
   _wallet1: 0x133e676148b785ebf67351ff806162803e3a042e
   _wallet2: 0x133e676148b785ebf67351ff806162803e3a042f
   _fixedAmount: 1000000000000000000
   ```
4. **Copy the deployed payment contract address**

### 6️⃣ Update Environment Variables

Update `.env.local`:

\`\`\`bash
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=[YOUR_MOCK_CHZ_ADDRESS]
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=[YOUR_PAYMENT_CONTRACT_ADDRESS]
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
\`\`\`

Update `.env`:

\`\`\`bash
CHAIN_RPC_URL="https://spicy-rpc.chiliz.com"
CHZ_TOKEN_ADDRESS="[YOUR_MOCK_CHZ_ADDRESS]"
PAYMENT_CONTRACT_ADDRESS="[YOUR_PAYMENT_CONTRACT_ADDRESS]"
\`\`\`

### 7️⃣ Restart the App

\`\`\`bash
# Stop current server (Ctrl+C in terminal)
# Restart
pnpm dev
\`\`\`

### 8️⃣ Test the Payment Flow

1. Open http://localhost:3000
2. **Make sure MetaMask is on Chiliz Spicy Testnet**
3. Connect wallet
4. Click "Pay 1 CHZ"
5. Approve + Pay

---

## ✅ Checklist Before Testing

- [ ] MetaMask has Chiliz Spicy Testnet added
- [ ] MetaMask is switched to Chiliz Spicy Testnet (Chain ID: 88882)
- [ ] You have native CHZ for gas (from faucet)
- [ ] MockCHZ contract deployed on testnet
- [ ] You have MockCHZ tokens (called `gimme()`)
- [ ] Payment contract deployed on testnet with MockCHZ address
- [ ] `.env.local` updated with new addresses
- [ ] `.env` updated with new addresses
- [ ] App restarted

---

## 🎯 Quick Start (TL;DR)

\`\`\`bash
# 1. Add network to MetaMask (manually)
# 2. Get testnet CHZ from faucet
# 3. Deploy contracts on Remix:

1. Deploy MockCHZ.sol
2. Call MockCHZ.gimme()
3. Deploy ChzPaymentSplitter.sol with MockCHZ address
4. Update .env.local with both addresses
5. Restart: pnpm dev
6. Test payment!
\`\`\`

---

## 🔍 Verify Setup

Check in browser console after connecting:

\`\`\`javascript
// Should be 88882 (testnet)
await window.ethereum.request({ method: 'eth_chainId' })

// Check you have mock CHZ tokens
const mockChz = new ethers.Contract(
  'YOUR_MOCK_CHZ_ADDRESS',
  ['function balanceOf(address) view returns (uint256)'],
  provider
)
const balance = await mockChz.balanceOf(yourAddress)
console.log('Balance:', ethers.formatEther(balance))
// Should show > 1 CHZ
\`\`\`

---

## 💡 Why Testnet?

| Testnet | Mainnet |
|---------|---------|
| ✅ Free tokens | ❌ Must buy CHZ |
| ✅ Safe testing | ❌ Real money risk |
| ✅ Unlimited tests | ❌ Costs gas fees |
| ✅ Perfect for dev | ❌ Only for production |

---

## 🆘 Still Having Issues?

1. Check MetaMask network is **Chiliz Spicy Testnet** (88882)
2. Check you have **native CHZ** for gas
3. Check you have **MockCHZ tokens** (not just native CHZ)
4. Check contract addresses in `.env.local` match deployed contracts
5. Check browser console for errors
6. Make sure app was restarted after updating .env

---

## 📚 Documentation

- Full testnet guide: `TESTNET_DEPLOYMENT.md`
- MockCHZ contract: `contracts/MockCHZ.sol`
- Payment contract: `contracts/ChzPaymentSplitter.sol`

---

**Ready to test? Follow the steps above and you'll be up and running in 10 minutes!** 🚀
