import { NetworkUserConfig } from "hardhat/types";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "../.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

export const PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("Private key is missing from the .env file. Aborting...");
}

export const INFURA_API_KEY: string | undefined = process.env.INFURA_API_KEY;
if (!INFURA_API_KEY) {
  throw new Error("Infura API Key is missing from the .env file. Aborting...");
}

export const FORKING_BLOCK_NUMMBER: number = 42369566;
export const apiKeys: Record<string, string> = {
  // Your API key for Etherscan
  // Obtain one at https://etherscan.io/
  mainnet: process.env.ETHERSCAN_API_KEY || "",
  sepolia: process.env.ETHERSCAN_API_KEY || "",
  goerli: process.env.ETHERSCAN_API_KEY || "",
  polygon: process.env.POLYGONSCAN_API_KEY || "",
  polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
};

interface networkConfig {
  chainId: number;
  rpcUrl: string;
  verifyContracts: boolean;
  defenderId: string;
}

export const networksConfig: Record<string, networkConfig> = {
  mainnet: {
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    verifyContracts: true,
    defenderId: "mainnet",
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    verifyContracts: true,
    defenderId: "sepolia",
  },
  goerli: {
    chainId: 5,
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    verifyContracts: true,
    defenderId: "goerli",
  },
  polygon: {
    chainId: 137,
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    verifyContracts: true,
    defenderId: "matic",
  },
  mumbai: {
    chainId: 80001,
    rpcUrl: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
    verifyContracts: true,
    defenderId: "mumbai",
  },
  localhost: {
    chainId: 31337,
    rpcUrl: "",
    // keep it as false since contracts can't be verified
    // on Hardhat localhost network
    verifyContracts: false,
    defenderId: "",
  },
};

export const getNetworkConfig = (network: keyof typeof networksConfig): NetworkUserConfig => {
  const networkConfig = networksConfig[network];
  return {
    accounts: [PRIVATE_KEY],
    // uncomment this block to use the MNEMONIC phrase
    // of the wallet rather than the PRIVATE KEY
    /* accounts: {
        count: 10,
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
      }, */
    chainId: networkConfig.chainId,
    url: networkConfig.rpcUrl,
  };
};
