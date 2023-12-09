import { expect } from "chai";
import { BaseContract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { Box, Box__factory } from "typechain-types";
import { Signers } from "types";

describe("Box", function () {
  let box: Box;
  let signers: Signers = {} as Signers;

  before(async function () {
    const _signers = await ethers.getSigners();
    signers.deployer = _signers[0];

    const boxFactory: Box__factory = <Box__factory>await ethers.getContractFactory("Box");
    box = (await upgrades.deployProxy(boxFactory, [signers.deployer.address], {
      kind: "uups",
      initializer: "initialize",
    })) as unknown as Box;
  });

  it("should set the correct owner", async function () {
    expect(await box.owner()).to.eq(signers.deployer.address);
  });

  it("should retrieve the current version", async function () {
    expect(await box.version()).to.eq("1.0.0");
  });
});
