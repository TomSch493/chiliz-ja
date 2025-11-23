import hre from 'hardhat';

async function main() {
  const ethers = (hre as any).ethers;
  
  console.log('🚀 Deploying MockCHZ on Chiliz Spicy Testnet...\n');

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying with account:', deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'CHZ\n');

  // Deploy MockCHZ
  console.log('⏳ Deploying MockCHZ...');
  const MockCHZ = await ethers.getContractFactory('MockCHZ');
  const mockChz = await MockCHZ.deploy();
  await mockChz.waitForDeployment();
  
  const mockChzAddress = await mockChz.getAddress();
  console.log('✅ MockCHZ deployed to:', mockChzAddress);

  // Check deployer balance
  const deployerBalance = await mockChz.balanceOf(deployer.address);
  console.log('💵 Deployer token balance:', ethers.formatEther(deployerBalance), 'MCHZ\n');

  console.log('='.repeat(70));
  console.log('📋 DEPLOYMENT SUMMARY');
  console.log('='.repeat(70));
  console.log('\n✅ MockCHZ Token Contract:', mockChzAddress);
  console.log('\n📝 NEXT STEPS:\n');
  console.log('1️⃣  Update your .env.local file:');
  console.log(`   NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=${mockChzAddress}\n`);
  console.log('2️⃣  Mint tokens to your wallet:');
  console.log(`   RECIPIENT_ADDRESS=YOUR_WALLET npx hardhat run scripts/mint-test-tokens.ts --network chilizTestnet\n`);
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
