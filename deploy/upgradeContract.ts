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
    const priceFeedArtifact = await deployer.loadArtifact('DexReader');
        await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, "0xCb33c510e98510Ab047e2f182c4164b2Df46cFeC", priceFeedArtifact);
        console.log("upgrade success");

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

