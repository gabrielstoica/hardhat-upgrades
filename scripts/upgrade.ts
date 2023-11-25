import { ethers, hardhatArguments, upgrades } from "hardhat";
import { BoxV2__factory } from "../typechain-types";
import { delay, verify } from "../utils";
import { deployments } from "../config/deployments";

async function main() {
  const { network } = hardhatArguments;

  // Upgrade the Box proxy contract to use the BoxV2 implementation contract
  const boxV2Factory: BoxV2__factory = <BoxV2__factory>await ethers.getContractFactory("BoxV2");
  const boxV2Contract = await upgrades.upgradeProxy(deployments[network!], boxV2Factory);

  // Retrieve the BoxV2 proxy contract address
  const boxV2ProxyAddress = await boxV2Contract.getAddress();
  const boxV2ImplementationAddress = await upgrades.erc1967.getImplementationAddress(boxV2ProxyAddress);
  console.log("BoxV2 contract implementation deployed at: ", boxV2ImplementationAddress);

  // wait for transaction to be confirmed
  // before submitting for verification
  await delay(10000);
  
  // Programmatically verify only the Box V2 contract implementation
  // since the proxy contract is already verified and linked with the old implementation
  if (network !== "localhost" && network !== undefined) {
    console.log(`Sent for verification...`);
    await verify(boxV2ImplementationAddress);
    console.log(`Successfully verified!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
