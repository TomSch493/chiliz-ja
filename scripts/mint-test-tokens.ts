async function main() {
  // Dynamic import for Hardhat ethers
  const hre = await import('hardhat');
  const ethers = (hre as any).ethers;

  // Get the wallet address from command line or use default
  const recipientAddress = process.env.RECIPIENT_ADDRESS || process.argv[2];
  
  if (!recipientAddress) {
    console.error('❌ Error: Please provide a recipient address');
    console.log('Usage: RECIPIENT_ADDRESS=0x... npx hardhat run scripts/mint-test-tokens.ts --network chilizTestnet');
    process.exit(1);
  }

  console.log('🪙 Minting test tokens...');
  console.log('📍 Recipient:', recipientAddress);

  // MockCHZ token address from your deployment
  const mockChzAddress = process.env.NEXT_PUBLIC_CHZ_TOKEN_ADDRESS;
  
  if (!mockChzAddress) {
    console.error('❌ Error: NEXT_PUBLIC_CHZ_TOKEN_ADDRESS not set in .env');
    console.log('Please deploy MockCHZ first and add the address to .env');
    process.exit(1);
  }

  console.log('🎫 Token contract:', mockChzAddress);

  // Get the contract
  const MockCHZ = await ethers.getContractAt('MockCHZ', mockChzAddress);

  // Mint 100 CHZ tokens
  const amount = ethers.parseEther('100');
  console.log('💰 Minting amount:', ethers.formatEther(amount), 'CHZ');

  const tx = await MockCHZ.mint(recipientAddress, amount);
  console.log('⏳ Transaction sent:', tx.hash);
  
  await tx.wait();
  console.log('✅ Tokens minted successfully!');

  // Check balance
  const balance = await MockCHZ.balanceOf(recipientAddress);
  console.log('💵 New balance:', ethers.formatEther(balance), 'CHZ');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
