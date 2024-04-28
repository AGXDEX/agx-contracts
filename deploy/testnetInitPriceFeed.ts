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
            const mockTokenArtifact = await hre.artifacts.readArtifact("MockToken");
            const mockToken = new ethers.Contract(
                tokenConfig[key].tokenAddress,
                mockTokenArtifact.abi,
                getWallet()
            )
            const mint = await mockToken.mint(wallet.address, ethers.parseEther('10000000'));
            await mint.wait();

            const priceFeedArtifact = await hre.artifacts.readArtifact("PriceFeed");
            const priceFeed = new ethers.Contract(
                tokenConfig[key].priceFeed,
                priceFeedArtifact.abi,
                getWallet()
            )
            let answer = key === "usdt"??'usdc' ?  10 ** 8: 3000 * 10 ** 8;
            const setAnswer = await priceFeed.setLatestAnswer(answer);
            await setAnswer.wait();
        console.log("set answer success");
    }

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

