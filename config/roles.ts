import { ethers } from "ethers";

export const ROLES = {
  // 0x0000000000000000000000000000000000000000000000000000000000000000
  DEFAULT_ADMIN_ROLE: ethers.encodeBytes32String(""),
  // 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
  MINTER_ROLE: ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE")),
  // 0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3
  UPGRADER_ROLE: ethers.keccak256(ethers.toUtf8Bytes("UPGRADER_ROLE")),
  // 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a
  PAUSER_ROLE: ethers.keccak256(ethers.toUtf8Bytes("PAUSER_ROLE")),
};
