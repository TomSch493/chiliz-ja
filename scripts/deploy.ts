/**
 * Deployment script for ChzPaymentSplitter contract
 * Run: npx hardhat run scripts/deploy.ts --network chiliz
 */

import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying ChzPaymentSplitter contract...\n");

  // TODO: Configure these values
  const CHZ_TOKEN_ADDRESS = process.env.CHZ_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000";
  const WALLET_1 = process.env.WALLET_1 || "0x0000000000000000000000000000000000000000";
  const WALLET_2 = process.env.WALLET_2 || "0x0000000000000000000000000000000000000000";
  const FIXED_CHZ_AMOUNT = process.env.FIXED_CHZ_AMOUNT || "1000000000000000000000"; // 1000 CHZ with 18 decimals

  console.log("Configuration:");
  console.log("- CHZ Token:", CHZ_TOKEN_ADDRESS);
  console.log("- Wallet 1 (80%):", WALLET_1);
  console.log("- Wallet 2 (20%):", WALLET_2);
  console.log("- Fixed Amount:", FIXED_CHZ_AMOUNT);
  console.log();

  // Validate addresses
  if (
    CHZ_TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000" ||
    WALLET_1 === "0x0000000000000000000000000000000000000000" ||
    WALLET_2 === "0x0000000000000000000000000000000000000000"
  ) {
    throw new Error("⚠️  Please configure all addresses in .env file");
  }

  // Deploy contract
  const ChzPaymentSplitter = await ethers.getContractFactory("ChzPaymentSplitter");
  const contract = await ChzPaymentSplitter.deploy(
    CHZ_TOKEN_ADDRESS,
    WALLET_1,
    WALLET_2,
    FIXED_CHZ_AMOUNT
  );

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ ChzPaymentSplitter deployed to:", contractAddress);
  console.log();
  console.log("📝 Next steps:");
  console.log("1. Update your .env file:");
  console.log(`   PAYMENT_CONTRACT_ADDRESS="${contractAddress}"`);
  console.log();
  console.log("2. Verify contract on block explorer (if needed):");
  console.log(`   npx hardhat verify --network chiliz ${contractAddress} ${CHZ_TOKEN_ADDRESS} ${WALLET_1} ${WALLET_2} ${FIXED_CHZ_AMOUNT}`);
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
