import * as hre from "hardhat";
import { getWallet } from "../utils";
import {Contract, ethers} from "ethers";
import * as config from "../../config";
import   Staker from "../../externalABI/UniV3Staker.json"
import price from "../../pricefeed.json";
import ContractAddresses from "../../DeploymentOutput.json";
import {NFT_REWARD_AMOUNT} from "../../config";
import factoryArtifact from "../../externalABI/UniswapV3Factory.json";
import fs from "fs";

async function main() {

    const agxArtifact = await hre.artifacts.readArtifact("AGX");
    const agx = new ethers.Contract(
        ContractAddresses.AGX.address,
        agxArtifact.abi,
        getWallet()
    );
    const factory = new ethers.Contract(
        ContractAddresses.V3Factory.address,
        factoryArtifact.abi,
        getWallet() // Interact with the contract on behalf of this wallet
    );
    const createPool = await factory.createPool(
        ContractAddresses.AGX.address,
        config.WETH,
        10000
    );
    await createPool.wait();

    console.log("Create pool success");


    const approve = await agx.approve(ContractAddresses.V3Staker.address, config.NFT_REWARD_AMOUNT);
    await approve.wait()

    const v3Staker = new ethers.Contract(
        ContractAddresses.V3Staker.address,
        Staker,
        getWallet() //
    );
    const timestamp = Math.floor(Date.now() / 1000) + 100;
    const args = {
        rewardToken: ContractAddresses.AGX.address,
        pool: await factory.getPool(ContractAddresses.AGX.address, config.WETH, 10000),
        startTime: timestamp,
        endTime: timestamp + config.INCENTIVE_DURATION,
        refundee: getWallet().address
    };

    console.log(args);
    const deploymentStateJSON = JSON.stringify(args, null, 2);
    fs.writeFileSync("../../Incentive.json", deploymentStateJSON);

    const createIncentive = await v3Staker.createIncentive(
       args, config.NFT_REWARD_AMOUNT);
    await createIncentive.wait();

    console.log(createIncentive.hash);




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
