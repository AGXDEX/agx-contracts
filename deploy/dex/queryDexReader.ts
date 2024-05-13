import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "../utils";
import "ethers";
import {ethers} from "ethers";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";

async function main() {

    const wallet = getWallet();
    //const deployer = new Deployer(hre, wallet);

    const dexReaderArtifact = await hre.artifacts.readArtifact("DexReader");

    const dexReader = new ethers.Contract(
            "0xCb33c510e98510Ab047e2f182c4164b2Df46cFeC",
            dexReaderArtifact.abi,
            getWallet()
        );
    const set = await dexReader.setV3Factory("0x0c283f1a3C6981eE623cb4E8AcC4f450f39D0815");
    await set.wait();
    console.log(await dexReader.getSpecificNftIds([ 15,17, 22], "0x0F3aFfe0c0465F7965845123B8c23509De0b0154","0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7"));
        //console.log(await priceFeed.latestAnswer());




}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

