import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import  price from  "../pricefeed.json";

async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    const priceFeedArtifact = await deployer.loadArtifact('PriceFeed');
    for (const key in price) {
        await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, price[key].priceFeed, priceFeedArtifact);
        console.log("upgrade success");

    }
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

