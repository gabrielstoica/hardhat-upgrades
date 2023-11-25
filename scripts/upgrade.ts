import { ethers, hardhatArguments, upgrades } from "hardhat";
import { BoxV2__factory } from "../typechain-types";
import { verify } from "../utils";
import { deployments } from "../config/deployments";
import { networksConfig } from "../config";

async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  // Upgrade the Box proxy contract to use the BoxV2 implementation contract
  const boxV2Factory: BoxV2__factory = <BoxV2__factory>await ethers.getContractFactory("BoxV2");
  const boxV2Contract = await upgrades.upgradeProxy(deployments[network!], boxV2Factory);

  // Retrieve the BoxV2 proxy contract address
  const boxV2ProxyAddress = await boxV2Contract.getAddress();
  const boxV2ImplementationAddress = await upgrades.erc1967.getImplementationAddress(boxV2ProxyAddress);
  console.log("BoxV2 contract implementation deployed at: ", boxV2ImplementationAddress);

  // Programmatically verify only the Box V2 contract implementation
  // since the proxy contract is already verified and linked with the old implementation
  if (networksConfig[network!].verifyContracts) {
    console.log(`Sent for verification...`);
    await verify(boxV2ImplementationAddress);
    console.log(`Successfully verified!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
