import { ethers, hardhatArguments, upgrades } from "hardhat";
import { Box__factory } from "typechain-types";

/**
 * Use this script to validate a contract implementation without deploying it (i.e. Box)
 *
 * https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-implementation
 */
async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  console.log(`Validating the implementation on the ${network} network...`);

  // Create the factory of the contract implementation
  const factory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");

  await upgrades.validateImplementation(factory, { kind: "uups" });

  console.log("Implementation validated successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
