import { deployments } from "config/deployments";
import { ethers, hardhatArguments, upgrades } from "hardhat";
import { BoxV2__factory } from "typechain-types";

/**
 * Use this script to validate a new implementation contract without deploying/upgrading it (i.e. Box)
 *
 * Compares the current implementation contract to the new implementation contract to 
 * check for storage layout compatibility errors.
 * https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-upgrade
 */
async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  // Configuration
  // Get the contract address of the proxy contract 
  const contractAddress = deployments[network];
  // or retrieve the current implementation factory
  //const currentFactory: Box__factory = <Box__factory> await ethers.getContractFactory('Box');

  console.log(`Validating the new implementation on the ${network} network...`);

  // Create the factory of the new contract 
  const newFactory: BoxV2__factory = <BoxV2__factory>await ethers.getContractFactory("BoxV2");

  await upgrades.validateUpgrade(contractAddress, newFactory, { kind: "uups" });
  // or validate based on the current implementation factory
  //await upgrades.validateUpgrade(currentFactory, newFactory, { kind: "uups" });

  console.log("New implementation validated successfully!")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
