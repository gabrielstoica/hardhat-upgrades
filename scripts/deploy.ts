import { ethers, hardhatArguments, upgrades } from "hardhat";
import { Box__factory } from "typechain-types";
import { addDeployment, delay, verify } from "utils";
import { networksConfig } from "config";

async function main() {
  const [deployer] = await ethers.getSigners();
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  // Deploy the proxy contract (i.e. Box)
  const factory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");
  const contract = await upgrades.deployProxy(factory, [deployer.address], { initializer: "initialize" });
  await contract.waitForDeployment();

  // Retrieve the proxy contract address
  const proxyAddress = await contract.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Box proxy contract deployed at: ", proxyAddress);
  console.log("Box contract implementation deployed at: ", implementationAddress);

  // Store the proxy contract address so we can use it later on
  addDeployment(network!, proxyAddress);

  // wait x seconds for transaction to be confirmed
  // before submitting for verification
  const ms = 20 * 1000; // milliseconds
  console.log(`Waiting ${ms / 1000} seconds before sending for verification...`);
  await delay(ms);

  // Programmatically verify the proxy contract
  // this will verify the implementation contract
  // and link the proxy contract with it
  if (networksConfig[network!].verifyContracts) {
    console.log(`Sent for verification...`);
    await verify(proxyAddress);
    console.log(`Successfully verified!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
