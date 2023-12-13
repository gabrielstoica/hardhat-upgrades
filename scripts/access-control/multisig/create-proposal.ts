import { AdminClient } from "@openzeppelin/defender-admin-client";
import { DEFENDER_API_KEY, DEFENDER_SECRET_KEY, networksConfig } from "config";
import { deployments } from "config/deployments";
import { multisigs } from "config/multisigs";
import { ethers, hardhatArguments } from "hardhat";

/**
 * To invoke a method protected by an onlyRole guard using multisig contract, a proposal
 * must be created through the relevant multisig contract having the appropiate role
 *
 * Example:
 * - The mint method is exclusively executable by a multisig contract with the MINTER_ROLE role
 */
async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("Please specify the target network. Aborting...");
  }
  const [deployer] = await ethers.getSigners();

  // Configuration
  // Get the multisig contract address that must approve this proposal
  const multisigAddress = multisigs[network].MINTER_ROLE;
  // Get the contract address to create the proposal on
  const contractAddress = deployments[network];
  // Get the defender ID associated with the current network
  const defenderNetwork = networksConfig[network].defenderId;

  // Create the Defender Admin Client instance
  const client = new AdminClient({ apiKey: DEFENDER_API_KEY, apiSecret: DEFENDER_SECRET_KEY });

  // Create the proposal through the Defender Admin Client
  const proposal = await client.createProposal({
    contract: { address: contractAddress, network: defenderNetwork as any }, // Target contract
    title: "Mint 50 MT tokens", // Title of the proposal
    description: "Mint 50 MT tokens to the deployer address", // Description of the proposal
    type: "custom", // Use 'custom' for custom admin actions
    functionInterface: {
      name: "mint",
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
    }, // Function ABI
    functionInputs: [deployer.address, "50"], // Arguments to the function;
    via: multisigAddress, // Address to execute proposal
    viaType: "Safe", // 'Gnosis Multisig', 'Safe' or 'EOA'
  });

  console.log("Proposal successfully created at: ", proposal.url);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
