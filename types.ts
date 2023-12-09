import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

declare module "mocha" {
  export interface Context {
    signers: Signers;
  }
}

export interface Signers {
  deployer: SignerWithAddress;
}
