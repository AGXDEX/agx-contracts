## Prerequisite
- have deployed positionUtils, config in hardhat.config and  config/index.ts
    ```
  //hardhat config.ts
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
  }
  
  //config/index.ts
  export const POSITION_UTILS = "0x1842614D09d6EA4Ca9E57AF69355AaE26745Ba9d"
  ```
- have deployed uni staker and config in DeploymentOutput.json
- have complete pricefeed.json config

## Set config value
- prepare for 6 wallets
    - Deployer
    - EXECUTE_INCREASE_ADMIN
    - EXECUTE_DECREASE_ADMIN
    - FEED_ADMIN
    - LIQUIDATOR
    - FEE_ADMIN
- add .env file, set deployer private key
-  update admin address in config/index.ts
   (`It should be noted that these accounts need to have enough eth to pay gas`)
    - EXECUTE_INCREASE_ADMIN
    - EXECUTE_DECREASE_ADMIN
    - FEED_ADMIN
    - LIQUIDATOR
    - FEE_ADMIN

## Deploy Contracts
- yarn install
- yarn hardhat run deploy/deploy.ts
- yarn hardhat run deploy/configToken.ts
- yarn hardhat run deploy/stakeAGX/deployStakeAGX.ts
- yarn hardhat run deploy/staker/createIncentive.ts
- yarn hardhat run deploy/deployPositionRouter.ts

## Deploy Graph
https://github.com/AGXDEX/agx-graph
- gmx-arbitrum-raw
- gmx-liquidate-stat
- uniswap-v3-staker-subgraph
