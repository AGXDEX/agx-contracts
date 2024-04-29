import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import ContractAddresses from "../DeploymentOutput.json";
import price from "../pricefeed.json";

async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);


    for (const key in price) {
        const priceFeedArtifact = await hre.artifacts.readArtifact("PriceFeed");
        const priceFeed = new ethers.Contract(
            price[key].priceFeed,
            priceFeedArtifact.abi,
            getWallet()
        );
/*
        const setAdmin = await priceFeed.setAdmin("0xd14653F6fA807107084e5d8a18bB5Ce3C5BbFB90", true);
        await setAdmin.wait();
        console.log("set admin success");*/

        console.log(await priceFeed.latestAnswer());
    }




}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

