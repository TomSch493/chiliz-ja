# 🚀 Quick Fix: Error "Insufficient CHZ balance"

## Problem

You're getting: `"Insufficient CHZ balance"` error when trying to pay.

## Root Cause

Your payment contract is looking for **CHZ tokens (ERC20)** but:
1. The contract is deployed on **mainnet** (Chain ID: 88888)
2. You don't have CHZ tokens in your wallet

## ✅ SOLUTION: Use Testnet

I've configured everything for **Chiliz Spicy Testnet**. Follow these simple steps:

---

## Step 1: Add Testnet to MetaMask (2 minutes)

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network" (at bottom)
4. Fill in:
   - **Network Name**: `Chiliz Spicy Testnet`
   - **RPC URL**: `https://spicy-rpc.chiliz.com`
   - **Chain ID**: `88882`
   - **Currency Symbol**: `CHZ`
   - **Block Explorer**: `https://testnet.chiliscan.com`
5. Click "Save"
6. **Switch to Chiliz Spicy Testnet**

---

## Step 2: Get FREE Test CHZ (1 minute)

1. Go to: https://spicy-faucet.chiliz.com
2. Connect your wallet
3. Click "Request CHZ"
4. Wait 10 seconds
5. You now have 10 free testnet CHZ for gas!

---

## Step 3: Deploy Mock CHZ Token (3 minutes)

We need to create a test ERC20 token:

### Using Remix (Easiest):

1. **Go to**: https://remix.ethereum.org

2. **Create new file**: Click "+" icon, name it `MockCHZ.sol`

3. **Paste this code**:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockCHZ {
    string public name = "Mock CHZ";
    string public symbol = "MCHZ";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function gimme() external {
        _mint(msg.sender, 1000 * 10**18);
    }
    
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
    
    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
\`\`\`

4. **Compile**:
   - Click "Solidity Compiler" tab (left sidebar)
   - Select compiler: `0.8.20+`
   - Click "Compile MockCHZ.sol"

5. **Deploy**:
   - Click "Deploy & Run Transactions" tab
   - **Environment**: Select "Injected Provider - MetaMask"
   - **IMPORTANT**: Make sure MetaMask shows "Chiliz Spicy Testnet"
   - Contract: `MockCHZ`
   - Click **"Deploy"**
   - Confirm in MetaMask

6. **Get tokens**:
   - In deployed contracts section, expand your MockCHZ contract
   - Find `gimme` button
   - Click it - this gives you 1000 test tokens
   - Confirm in MetaMask

7. **📝 COPY THE CONTRACT ADDRESS** - You'll need it!

---

## Step 4: Deploy Payment Contract (3 minutes)

1. **In Remix**, create new file: `ChzPaymentSplitter.sol`

2. **Copy from your project**: `contracts/ChzPaymentSplitter.sol`
   
   Or use this:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ChzPaymentSplitter {
    IERC20 public immutable chzToken;
    address public immutable wallet1;
    address public immutable wallet2;
    uint256 public immutable fixedAmount;
    
    event PaymentDone(address indexed payer, uint256 amount);
    event PaymentSplit(address indexed wallet1, uint256 amount1, address indexed wallet2, uint256 amount2);
    
    constructor(address _chzToken, address _wallet1, address _wallet2, uint256 _fixedAmount) {
        require(_chzToken != address(0), "Invalid CHZ token address");
        require(_wallet1 != address(0), "Invalid wallet1 address");
        require(_wallet2 != address(0), "Invalid wallet2 address");
        require(_fixedAmount > 0, "Fixed amount must be greater than 0");
        
        chzToken = IERC20(_chzToken);
        wallet1 = _wallet1;
        wallet2 = _wallet2;
        fixedAmount = _fixedAmount;
    }
    
    function pay() external {
        uint256 currentAllowance = chzToken.allowance(msg.sender, address(this));
        require(currentAllowance >= fixedAmount, "Insufficient allowance - please approve tokens first");
        
        uint256 balance = chzToken.balanceOf(msg.sender);
        require(balance >= fixedAmount, "Insufficient CHZ balance");
        
        uint256 toWallet1 = (fixedAmount * 80) / 100;
        uint256 toWallet2 = fixedAmount - toWallet1;
        
        bool success1 = chzToken.transferFrom(msg.sender, wallet1, toWallet1);
        require(success1, "Transfer to wallet1 failed");
        
        bool success2 = chzToken.transferFrom(msg.sender, wallet2, toWallet2);
        require(success2, "Transfer to wallet2 failed");
        
        emit PaymentDone(msg.sender, fixedAmount);
        emit PaymentSplit(wallet1, toWallet1, wallet2, toWallet2);
    }
}
\`\`\`

3. **Compile** it (Solidity 0.8.20)

4. **Deploy** with constructor parameters:
   - `_chzToken`: **[PASTE YOUR MOCK CHZ ADDRESS HERE]**
   - `_wallet1`: `0x133e676148b785ebf67351ff806162803e3a042e`
   - `_wallet2`: `0x133e676148b785ebf67351ff806162803e3a042f`
   - `_fixedAmount`: `1000000000000000000` (1 CHZ)

5. Click **"transact"** and confirm in MetaMask

6. **📝 COPY THIS CONTRACT ADDRESS TOO!**

---

## Step 5: Update Your App (2 minutes)

Update `.env.local` file:

\`\`\`bash
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=[YOUR_MOCK_CHZ_ADDRESS]
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=[YOUR_PAYMENT_CONTRACT_ADDRESS]
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
\`\`\`

**Replace the addresses** with the ones you copied!

---

## Step 6: Restart App (30 seconds)

\`\`\`bash
# In terminal where app is running, press Ctrl+C
# Then restart:
pnpm dev
\`\`\`

---

## Step 7: TEST! 🎉

1. Open http://localhost:3000
2. **Check MetaMask is on "Chiliz Spicy Testnet"**
3. Connect wallet
4. Click "Pay 1 CHZ"
5. Approve (first transaction)
6. Pay (second transaction)
7. SUCCESS! 🎉

---

## ✅ Pre-Flight Checklist

Before testing, verify:

- [ ] MetaMask network shows "Chiliz Spicy Testnet"
- [ ] You have native CHZ (for gas) - from faucet
- [ ] You have MockCHZ tokens - called `gimme()`
- [ ] `.env.local` has BOTH new contract addresses
- [ ] App was restarted after updating `.env.local`

---

## 🔍 Troubleshooting

### "Wrong network"
→ Switch MetaMask to Chiliz Spicy Testnet

### "Insufficient CHZ balance" 
→ Call `gimme()` on your MockCHZ contract in Remix

### "Insufficient allowance"
→ App will handle this automatically, just click "Pay 1 CHZ"

### "Transaction reverted"
→ Make sure you have MockCHZ tokens (not just native CHZ)

---

## 📊 Check Your Balances

In Remix, you can check:

**MockCHZ Balance:**
1. Go to deployed MockCHZ contract
2. Find `balanceOf` function
3. Enter your address
4. Click "call"
5. Should show > 1000000000000000000 (1 CHZ)

---

## 🎯 Summary

1. ✅ Add Chiliz Spicy Testnet to MetaMask
2. ✅ Get free testnet CHZ from faucet  
3. ✅ Deploy MockCHZ contract → Copy address
4. ✅ Call `gimme()` to get test tokens
5. ✅ Deploy Payment contract with MockCHZ address → Copy address
6. ✅ Update `.env.local` with BOTH addresses
7. ✅ Restart app
8. ✅ Test payment!

**Total time: ~10 minutes** ⏱️

---

**Ready? Let's go!** 🚀
