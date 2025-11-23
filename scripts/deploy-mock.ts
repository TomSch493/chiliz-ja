import { ethers } from "ethers";

async function main() {
  console.log("🚀 Deploying MockCHZ Token on Chiliz Spicy Testnet...");

  // Deploy MockCHZ
  const MockCHZ = await ethers.getContractFactory("MockCHZ");
  const mockChz = await MockCHZ.deploy();
  await mockChz.waitForDeployment();
  
  const mockChzAddress = await mockChz.getAddress();
  console.log("✅ MockCHZ deployed to:", mockChzAddress);

  // Mint some tokens to deployer
  console.log("\n💰 Minting 10,000 test tokens to deployer...");
  const mintTx = await mockChz.mint(ethers.parseEther("10000"));
  await mintTx.wait();
  console.log("✅ Tokens minted!");

  // Check balance
  const [deployer] = await ethers.getSigners();
  const balance = await mockChz.balanceOf(deployer.address);
  console.log("\n📊 Your MockCHZ balance:", ethers.formatEther(balance), "MCHZ");

  console.log("\n" + "=".repeat(60));
  console.log("📝 Next Steps:");
  console.log("=".repeat(60));
  console.log("\n1️⃣  Update your .env.local:");
  console.log(`   NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=${mockChzAddress}`);
  
  console.log("\n2️⃣  Deploy the payment contract:");
  console.log(`   npx hardhat run scripts/deploy.ts --network spicy`);
  console.log(`   Use MockCHZ address: ${mockChzAddress}`);

  console.log("\n3️⃣  (Optional) Mint more tokens to yourself:");
  console.log(`   Call mockChz.gimme() or mockChz.mint(amount)`);

  console.log("\n4️⃣  Restart your app:");
  console.log(`   pnpm dev`);
  
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
