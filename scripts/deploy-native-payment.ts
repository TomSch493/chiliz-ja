async function main() {
  // Dynamic import for Hardhat ethers
  const hre = await import('hardhat');
  const ethers = (hre as any).ethers;

  console.log('🚀 Deploying NativeChzPaymentSplitter on Chiliz Spicy Testnet...\n');

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying with account:', deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'CHZ\n');

  if (balance === BigInt(0)) {
    console.error('❌ Error: No CHZ balance on testnet');
    console.log('Get testnet CHZ from faucet: https://spicy-faucet.chiliz.com');
    process.exit(1);
  }

  // Configuration
  const wallet1 = process.env.WALLET_1 || '0x133e676148b785ebf67351ff806162803e3a042e';
  const wallet2 = process.env.WALLET_2 || '0x133e676148b785ebf67351ff806162803e3a042f';
  const fixedAmount = process.env.FIXED_CHZ_AMOUNT || '1000000000000000000'; // 1 CHZ

  console.log('⚙️  Configuration:');
  console.log('   Wallet 1 (80%):', wallet1);
  console.log('   Wallet 2 (20%):', wallet2);
  console.log('   Fixed Amount:', ethers.formatEther(fixedAmount), 'CHZ\n');

  // Deploy NativeChzPaymentSplitter
  console.log('⏳ Deploying NativeChzPaymentSplitter...');
  const NativeChzPaymentSplitter = await ethers.getContractFactory('NativeChzPaymentSplitter');
  const paymentSplitter = await NativeChzPaymentSplitter.deploy(
    wallet1,
    wallet2,
    fixedAmount
  );
  
  await paymentSplitter.waitForDeployment();
  
  const paymentSplitterAddress = await paymentSplitter.getAddress();
  console.log('✅ NativeChzPaymentSplitter deployed to:', paymentSplitterAddress);

  console.log('\n' + '='.repeat(70));
  console.log('📋 DEPLOYMENT SUMMARY');
  console.log('='.repeat(70));
  console.log('\n✅ Payment Contract:', paymentSplitterAddress);
  console.log('\n📝 NEXT STEPS:\n');
  console.log('1️⃣  Update your .env.local file:');
  console.log(`   NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=${paymentSplitterAddress}\n`);
  console.log('2️⃣  Remove the old token address (not needed anymore):');
  console.log('   # NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=... ← Not needed for native CHZ!\n');
  console.log('3️⃣  Restart your dev server:');
  console.log('   pnpm dev\n');
  console.log('4️⃣  Test the payment:');
  console.log('   - Connect your wallet (you have', ethers.formatEther(balance), 'CHZ)');
  console.log('   - Pay 1 CHZ directly (no tokens, no approval!)');
  console.log('   - Done! ✅\n');
  console.log('='.repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
