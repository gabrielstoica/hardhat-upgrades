import { deployments } from "config/deployments";
import { ethers, hardhatArguments, upgrades } from "hardhat";
import { Box__factory } from "typechain-types";

/**
 * Use this script if the network file (.openzeppelin/<network>.json) with your deployment is lost
 * and you can no longer create proposals within your UUPS upgradeable smart contract (i.e. Box)
 *
 * Forces the import of an existing proxy, beacon or implementation contract
 * deployment to be used with the @openzeppelin/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#force-import
 */
async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  // Configuration
  // Get the contract address to create the proposal on
  const contractAddress = deployments[network];

  console.log(`Importing proxy contract on ${network} network...`);
  const factory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");

  const forceImport = await upgrades.forceImport(contractAddress, factory, {
    kind: "uups",
  });

  if (forceImport) console.log("Proxy contract imported successfully!");
  else console.log("Error! Import failed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
