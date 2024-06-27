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
    const positionRouterArtifact = await deployer.loadArtifact("PositionRouter");
    const positionRouter = new ethers.Contract(
        ContractAddresses.PositionRouter.address,
        positionRouterArtifact.abi,
        getWallet()
    );
    const vaultArtifact = await deployer.loadArtifact("Vault");
    const vault = new ethers.Contract(
        ContractAddresses.Vault.address,
        vaultArtifact.abi,
        getWallet()
    );
    let acceptablePrice = BigNumber.from(acceptablePrice.toString()).mul(11000).div(10000);



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

