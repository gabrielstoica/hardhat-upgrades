import { ethers, hardhatArguments, upgrades } from "hardhat";
import { Box__factory } from "../typechain-types";
import { addDeployment, delay, verify } from "../utils";
import { networksConfig } from "../config";

async function main() {
  const [deployer] = await ethers.getSigners();
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  // Deploy the Box proxy contract
  const boxFactory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");
  const boxContract = await upgrades.deployProxy(boxFactory, [deployer.address], { initializer: "initialize" });
  await boxContract.waitForDeployment();

  // Retrieve the Box proxy contract address
  const boxProxyAddress = await boxContract.getAddress();
  const boxImplementationAddress = await upgrades.erc1967.getImplementationAddress(boxProxyAddress);
  console.log("Box proxy contract deployed at: ", boxProxyAddress);
  console.log("Box contract implementation deployed at: ", boxImplementationAddress);

  // Store the Box proxy contract address so we can use it later on
  addDeployment(network!, boxProxyAddress);

  // wait x seconds for transaction to be confirmed
  // before submitting for verification
  const ms = 20 * 1000; // milliseconds
  console.log(`Waiting ${ms / 1000} seconds before sending for verification...`);
  await delay(ms);

  // Programmatically verify the Box proxy contract
  // this will verify the implementation contract
  // and link the proxy contract with it
  if (networksConfig[network!].verifyContracts) {
    console.log(`Sent for verification...`);
    await verify(boxProxyAddress);
    console.log(`Successfully verified!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
