import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import ContractAddresses from "../DeploymentOutput.json";
import nftManagerArtifact from "../externalABI/NFTPositionsManager.json";
async function main() {

    const deployer = new Deployer(hre, getWallet());
    const wallet = getWallet();
    const stakeAgxArtifact = await deployer.loadArtifact("StakeAGX");
    const stakeAGX = new ethers.Contract(
        ContractAddresses.StakeAGX.address,
        stakeAgxArtifact.abi,
        getWallet()
    );

    console.log(await stakeAGX.rewardRate());
    console.log(await stakeAGX.periodFinish());

    const yieldEmissionArtifact = await deployer.loadArtifact("YieldEmission");
    const yieldEmission = new ethers.Contract(
        ContractAddresses.YieldEmission.address,
        yieldEmissionArtifact.abi,
        getWallet()
    );
   

    const  daySeconds = 86400;
    const claimableAmount = await yieldEmission.claimable(wallet.address);
    console.log(`Claimable amount for wallet ${wallet.address}: ${claimableAmount}`);
    const claimWithPeriod = await yieldEmission.claimWithPeriod(
        0
    );
    await claimWithPeriod.wait();
    console.log(claimWithPeriod.hash);


    console.log(await stakeAGX.rewardRate());
    console.log(await stakeAGX.periodFinish());


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

