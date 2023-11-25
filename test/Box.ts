import { ethers, upgrades } from "hardhat";

describe("Box", function () {
  it("deploys", async function () {
    const [deployer] = await ethers.getSigners();

    const box = await ethers.getContractFactory("Box");
    await upgrades.deployProxy(box, [deployer.address], { kind: "uups" });
  });
});
