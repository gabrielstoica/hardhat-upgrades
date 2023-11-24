import { ethers, hardhatArguments, upgrades } from "hardhat";
import { Box__factory } from "../typechain-types";
import { verify } from "../utils";

async function main() {
  const [deployer] = await ethers.getSigners();
  const { network } = hardhatArguments;

  // Deploy the Box contract
  const boxFactory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");
  const boxContract = await upgrades.deployProxy(boxFactory, [deployer.address], { initializer: "initialize" });
  await boxContract.waitForDeployment();

  // Retrieve the Box contract address
  const boxContractAddress = await boxContract.getAddress();
  console.log("Box contract deployed to: ", boxContractAddress);

  // Verify the Box contract implementation
  if (network !== "localhost" && network !== undefined) {
    console.log(`Sent for verification...`);
    await verify(boxContractAddress, [deployer.address]);
    console.log(`Successfully verified!`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
