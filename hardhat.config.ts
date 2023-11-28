import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { FORKING_BLOCK_NUMMBER, apiKeys, getNetworkConfig, networksConfig } from "./config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // https://hardhat.org/hardhat-network/docs/guides/forking-other-networks
      forking: {
        url: networksConfig["goerli"].rpcUrl,
        blockNumber: FORKING_BLOCK_NUMMBER,
        enabled: false,
      },
    },
    mainnet: getNetworkConfig("mainnet"),
    polygon: getNetworkConfig("polygon"),
    sepolia: getNetworkConfig("sepolia"),
    goerli: getNetworkConfig("goerli"),
    mumbai: getNetworkConfig("mumbai"),
  },
  etherscan: {
    apiKey: {
      mainnet: apiKeys.mainnet,
      sepolia: apiKeys.sepolia,
      goerli: apiKeys.goerli,
      polygon: apiKeys.polygon,
      polygonMumbai: apiKeys.polygonMumbai,
    },
  },
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
    },
  },
};

export default config;
