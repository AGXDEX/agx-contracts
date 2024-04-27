import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

        for (const key in tokenConfig) {
            const priceFeedArtifact = await hre.artifacts.readArtifact("PriceFeed");
            const priceFeed = new ethers.Contract(
                tokenConfig[key].priceFeed,
                priceFeedArtifact.abi,
                getWallet()
            )
            const setAnswer = await priceFeed.setLatestAnswer(ethers.parseEther('0.001'));
            await setAnswer.wait();
        console.log("set answer success");
    }

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

