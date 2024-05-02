import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import ContractAddresses from "../DeploymentOutput.json";
import {token} from "../typechain/contracts/libraries";
import {makeVerifyDeployWithUploadedArtifact} from "@openzeppelin/hardhat-upgrades/dist/defender-v1/verify-deployment";
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    const timeDistributionArtifact = await hre.artifacts.readArtifact("TimeDistributor");
    const timedistirbutor = new ethers.Contract(
        ContractAddresses.TimeDistributor.address,
        timeDistributionArtifact.abi,
        getWallet()
    );

    console.log(await timedistirbutor.totalEmission());
    const yieldTrackerArtifact = await hre.artifacts.readArtifact("YieldTracker");
    const yieldTracker = new ethers.Contract(
        ContractAddresses.YieldTracker.address,
        yieldTrackerArtifact.abi,
        getWallet()
    );

    console.log(await yieldTracker.totalClaim());
    console.log(await yieldTracker.getTokensPerInterval());
    console.log(await yieldTracker.claimable(wallet.address));
    const alpArtifact = await hre.artifacts.readArtifact("ALP");
    const alp = new ethers.Contract(
        ContractAddresses.ALP.address,
        alpArtifact.abi,
        getWallet()
    );
    const claim = await alp.claim(wallet.address);
    await claim.wait();
    console.log(claim.hash);


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
