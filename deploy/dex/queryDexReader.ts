import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "../utils";
import "ethers";
import {ethers} from "ethers";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import ContractAddresses from "../../DeploymentOutput.json"

async function main() {

    const wallet = getWallet();
    //const deployer = new Deployer(hre, wallet);

    const dexReaderArtifact = await hre.artifacts.readArtifact("DexReader");

    const dexReader = new ethers.Contract(
            ContractAddresses.DexReader.address,
            dexReaderArtifact.abi,
            getWallet()
        );
    //const set = await dexReader.setV3Factory("0x0c283f1a3C6981eE623cb4E8AcC4f450f39D0815");
    //await set.wait();
    console.log(await dexReader.getSpecificNftIds([ 24,32, 117], ContractAddresses.AGX.address,"0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7"));
    console.log(await dexReader.getTokenURIs([ 24,32, 117]));




}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

