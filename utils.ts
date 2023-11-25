import { writeFileSync } from "fs";
import { run } from "hardhat";
import { deployments } from "./config/deployments";

export const verify = async (contractAddress: string) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
    });
  } catch (e) {
    console.log(`Error while verifying: ${e}`);
  }
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const addDeployment = (network: string, proxyAddress: string) => {
  deployments[network] = proxyAddress;

  // Convert the updated deployments object back to a string
  const deploymentsContent = `export const deployments: Record<string, string> = ${JSON.stringify(
    deployments,
    null,
    2
  )};`;

  writeFileSync("./config/deployments.ts", deploymentsContent, "utf-8");
};
