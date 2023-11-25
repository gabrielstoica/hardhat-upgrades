import { ethers, hardhatArguments, upgrades } from "hardhat";
import { Box__factory } from "../typechain-types";
import { delay, verify } from "../utils";

async function main() {
  const [deployer] = await ethers.getSigners();
  const { network } = hardhatArguments;

  // Deploy the Box proxy contract
  const boxFactory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");
  const boxContract = await upgrades.deployProxy(boxFactory, [deployer.address], { initializer: "initialize" });
  await boxContract.waitForDeployment();

  // Retrieve the Box proxy contract address
  const boxProxyAddress = await boxContract.getAddress();
  const boxImplementationAddress = await upgrades.erc1967.getImplementationAddress(boxProxyAddress);
  console.log("Box proxy contract deployed at: ", boxProxyAddress);
  console.log("Box contract implementation deployed at: ", boxImplementationAddress);

  // wait for transaction to be confirmed
  // before submitting for verification
  await delay(10000);

  // Programmatically verify the Box proxy contract
  // this will verify the implementation contract
  // and link the proxy contract with it
  if (network !== "localhost" && network !== undefined) {
    console.log(`Sent for verification...`);
    await verify(boxProxyAddress);
    console.log(`Successfully verified!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
