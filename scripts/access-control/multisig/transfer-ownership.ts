import { deployments } from "config/deployments";
import { multisigs } from "config/multisigs";
import { ROLES } from "config/roles";
import { ethers, hardhatArguments } from "hardhat";

/**
 * To facilitate the transfer of ownership for an AccessControl-based contract,
 * it is necessary to perform the following steps:
 * - Grant the DEFAULT_ADMIN_ROLE role to a multisig contract;
 * - Revoke the DEFAULT_ADMIN_ROLE from the wallet address that initially deployed the contract;
 */
async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }

  // Configuration
  const [deployer] = await ethers.getSigners();
  // Do not change the role:
  // The role to be granted to our multisig and revoked
  // from the deployer address MUST BE the DEFAULT_ADMIN_ROLE
  const role = ROLES.DEFAULT_ADMIN_ROLE;
  const multisigAddress = multisigs[network].DEFAULT_ADMIN_ROLE;

  // Create the contract instance based on the deployment address
  const contract = await ethers.getContractAt("MyToken", deployments[network]);

  // Grant the DEFAULT_ADMIN_ROLE role to a multisig contract address
  console.log(`Granting the DEFAULT_ADMIN_ROLE to ${multisigAddress}...`);
  let tx = await contract.grantRole(role, multisigAddress);
  await tx.wait();
  console.log(`DEFAULT_ADMIN_ROLE successfully granted to ${multisigAddress}!`);

  // Revoke the DEFAULT_ADMIN_ROLE role from the wallet address that deployed the contract
  console.log(`Revoking the DEFAULT_ADMIN_ROLE from ${deployer.address}...`);
  tx = await contract.revokeRole(ROLES.DEFAULT_ADMIN_ROLE, deployer.address);
  await tx.wait();
  console.log(`DEFAULT_ADMIN_ROLE successfully revoked from ${deployer.address}!`);

  console.log("Ownership successfully transferred!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
