import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting deployment to Base...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy FractionalAssets contract
  console.log("\nDeploying FractionalAssets...");
  const FractionalAssets = await ethers.getContractFactory("FractionalAssets");
  const baseURI = "https://api.flipflop.art/metadata/";
  const fractionalAssets = await FractionalAssets.deploy(baseURI);
  await fractionalAssets.waitForDeployment();
  const fractionalAssetsAddress = await fractionalAssets.getAddress();
  console.log("FractionalAssets deployed to:", fractionalAssetsAddress);

  // Deploy AssetGovernance contract
  console.log("\nDeploying AssetGovernance...");
  const AssetGovernance = await ethers.getContractFactory("AssetGovernance");
  const assetGovernance = await AssetGovernance.deploy(fractionalAssetsAddress);
  await assetGovernance.waitForDeployment();
  const assetGovernanceAddress = await assetGovernance.getAddress();
  console.log("AssetGovernance deployed to:", assetGovernanceAddress);

  // Create initial assets (only on testnet or with flag)
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
  
  if (chainId === 84532n) { // Base Sepolia
    console.log("\nCreating initial test assets...");
    
    // Create Manhattan Loft asset
    const tx1 = await fractionalAssets.createAsset(
      "Manhattan Loft #42",
      "Fractional ownership of a luxury apartment in NYC",
      10000,
      ethers.parseEther("0.001"), // 0.001 ETH per share
      0, // RealEstate category
      520, // 5.2% APY
      "https://api.flipflop.art/metadata/1"
    );
    await tx1.wait();
    console.log("Created Manhattan Loft asset");

    // Create Digital Art asset
    const tx2 = await fractionalAssets.createAsset(
      "Digital Genesis #001",
      "Tokenized ownership of famous digital art",
      500,
      ethers.parseEther("0.005"), // 0.005 ETH per share
      1, // Art category
      0, // No APY
      "https://api.flipflop.art/metadata/2"
    );
    await tx2.wait();
    console.log("Created Digital Art asset");

    // Create Music Royalties asset
    const tx3 = await fractionalAssets.createAsset(
      "Indie Album Royalties",
      "Streaming royalties from Electric Dreams album",
      1000,
      ethers.parseEther("0.0005"), // 0.0005 ETH per share
      2, // Music category
      850, // 8.5% APY
      "https://api.flipflop.art/metadata/3"
    );
    await tx3.wait();
    console.log("Created Music Royalties asset");
  }

  // Save deployment addresses
  const deploymentData = {
    network: chainId === 8453n ? "base-mainnet" : "base-sepolia",
    chainId: chainId.toString(),
    contracts: {
      FractionalAssets: fractionalAssetsAddress,
      AssetGovernance: assetGovernanceAddress
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const deploymentPath = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  const filename = `deployment-${chainId === 8453n ? "mainnet" : "sepolia"}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentPath, filename),
    JSON.stringify(deploymentData, null, 2)
  );

  // Also save as latest
  fs.writeFileSync(
    path.join(deploymentPath, `latest-${chainId === 8453n ? "mainnet" : "sepolia"}.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("\n✅ Deployment complete!");
  console.log("Deployment data saved to:", filename);
  
  // Verify contracts instructions
  console.log("\n📝 To verify contracts on Basescan:");
  console.log(`npx hardhat verify --network ${chainId === 8453n ? "base" : "baseSepolia"} ${fractionalAssetsAddress} "${baseURI}"`);
  console.log(`npx hardhat verify --network ${chainId === 8453n ? "base" : "baseSepolia"} ${assetGovernanceAddress} ${fractionalAssetsAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });