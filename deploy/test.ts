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
aa
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    const priceFeedArtifact = await hre.artifacts.readArtifact("PriceFeed");
    const pricefeed = new ethers.Contract(
        "0x06109AA8C78c58ca3E8D85a5847BEBecC0DBC732",
        priceFeedArtifact.abi,
        getWallet()
    );


    console.log(await pricefeed.heartBeat());
    console.log(await pricefeed.lastSetAnswerTime() );
    console.log(await pricefeed.latestAnswer());
    console.log(await pricefeed.getTimeStamp());



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
