const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Deploying MockCHZ on Chiliz Spicy Testnet...\n');

  // Get private key from environment
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ Error: PRIVATE_KEY not found in .env');
    console.log('Please add your private key to .env file:');
    console.log('PRIVATE_KEY=your_private_key_here');
    process.exit(1);
  }

  // Connect to Chiliz Spicy Testnet
  const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('📝 Deploying with account:', wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'CHZ\n');

  if (balance === 0n) {
    console.error('❌ Error: No CHZ balance on testnet');
    console.log('Get testnet CHZ from faucet: https://faucet.chiliz.com');
    process.exit(1);
  }

  // Read and compile MockCHZ contract
  console.log('⏳ Reading MockCHZ contract...');
  const contractPath = path.join(__dirname, '../contracts/MockCHZ.sol');
  
  // MockCHZ bytecode and ABI (you need to compile this first)
  // For now, let's use a simple approach
  const MockCHZ_ABI = [
    "constructor()",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function mint(uint256 amount)",
    "function mintTo(address to, uint256 amount)"
  ];

  // You need to compile the contract first
  console.log('❌ Please compile the MockCHZ contract first using Hardhat');
  console.log('Run: npx hardhat compile');
  
  // Check if artifacts exist
  const artifactPath = path.join(__dirname, '../artifacts/contracts/MockCHZ.sol/MockCHZ.json');
  if (!fs.existsSync(artifactPath)) {
    console.log('\n📝 Artifact not found. Compiling contract...');
    const { execSync } = require('child_process');
    execSync('npx hardhat compile', { stdio: 'inherit' });
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  console.log('⏳ Deploying MockCHZ...');
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const mockChz = await factory.deploy();
  await mockChz.waitForDeployment();
  
  const mockChzAddress = await mockChz.getAddress();
  console.log('✅ MockCHZ deployed to:', mockChzAddress);

  // Check deployer balance
  const deployerBalance = await mockChz.balanceOf(wallet.address);
  console.log('💵 Deployer token balance:', ethers.formatEther(deployerBalance), 'MCHZ\n');

  console.log('='.repeat(70));
  console.log('📋 DEPLOYMENT SUMMARY');
  console.log('='.repeat(70));
  console.log('\n✅ MockCHZ Token Contract:', mockChzAddress);
  console.log('\n📝 NEXT STEPS:\n');
  console.log('1️⃣  Update your .env.local file:');
  console.log(`   NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=${mockChzAddress}\n`);
  console.log('2️⃣  Mint tokens to your wallet:');
  console.log(`   node scripts/mint-tokens.js ${wallet.address}\n`);
  console.log('3️⃣  Restart your dev server:');
  console.log('   pnpm dev\n');
  console.log('='.repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
