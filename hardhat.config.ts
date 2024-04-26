import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import '@matterlabs/hardhat-zksync-verify';
import '@matterlabs/hardhat-zksync-upgradable';
import "@matterlabs/hardhat-zksync-node";
import 'solidity-coverage';
import '@openzeppelin/hardhat-upgrades';
import * as dotenv from 'dotenv';
import { NetworksUserConfig, NetworkUserConfig } from 'hardhat/src/types/config';

dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {

  typechain: {
    outDir: 'typechain',
    target: 'ethers-v6',
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
      }
    ],
  },
  defaultNetwork: 'zklinkGoerli',
  networks: {
    hardhat: {
      zksync: false,
    },

    zklinkGoerli: {
      url: 'https://goerli.rpc.zklink.io',
      ethNetwork: 'goerli',
      verifyURL: 'https://goerli.explorer.zklink.io/contract_verification',
      zksync: true,
    },
    zklinkNova: {
      url: 'https://rpc.zklink.io',
      ethNetwork: 'mainnet',
      verifyURL: 'https://explorer.zklink.io/contract_verification',
      zksync: true,
    },
  },
  zksolc: {
    version: '1.3.22',
    settings: {},
  },
  mocha: {
    timeout: 600000,
  },
};



export default config;