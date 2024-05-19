import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-foundry";

import "@matterlabs/hardhat-zksync";
import "@matterlabs/hardhat-zksync-upgradable";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "nova",
  networks: {
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    zkSyncGoerliTestnet: { // deprecated network
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
      verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
    },
    dockerizedNode: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
    inMemoryNode: {
      url: "http://127.0.0.1:8011",
      ethNetwork: "localhost", // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    novaSepolia:{
      url: "https://sepolia.rpc.zklink.io",
      ethNetwork: "sepolia",
      zksync: true,
      accounts:[PRIVATE_KEY],
    verifyURL:"https://sepolia.explorer.zklink.io/contract_verification"
    },
    nova:{
      url: "https://rpc.zklink.io",
      ethNetwork: "mainnet",
      zksync: true,
      accounts:[PRIVATE_KEY],
      verifyURL:"https://explorer.zklink.io/contract_verification"
    },
    hardhat: {
      zksync: true,

    },
  },
  zksolc: {
    version: '1.3.13',
    settings: {
      // find all available options in the official documentation
      // https://era.zksync.io/docs/tools/hardhat/hardhat-zksync-solc.html#configuration
        libraries: {
              "contracts/core/PositionUtils.sol": {
                "PositionUtils": "0x9F8809Ce384aB7C14105CD8B12FD9c086F2b9196"
              }
            }
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10,
          },
        },
      },
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10,
          },
        },
      },
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10,
          },
        },
      },
      {
        version: '0.8.8',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 150,
          },
        },
      },

    ]
  },
};

export default config;
