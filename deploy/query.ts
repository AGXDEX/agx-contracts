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

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    const nftManager = new ethers.Contract(
        "0x45f84cf9620cecEDaf6742d38F480A5683030fe8",
        nftManagerArtifact,
        getWallet()
    );
    console.log(await nftManager.positions(9));






}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

