import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "../utils";
import "ethers";
import {ethers} from "ethers";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";

async function main() {

    const wallet = getWallet();
    //const deployer = new Deployer(hre, wallet);
    console.log(11)

    const dexReaderArtifact = await hre.artifacts.readArtifact("DexReader");
    console.log(11)

    const dexReader = new ethers.Contract(
            "0xCb33c510e98510Ab047e2f182c4164b2Df46cFeC",
            dexReaderArtifact.abi,
            getWallet()
        );
    console.log(11)
    console.log(await dexReader.owner())
    console.log(await dexReader.getSpecificNftIds([1,4,5, 8], "0x0F3aFfe0c0465F7965845123B8c23509De0b0154","0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7"));
        //console.log(await priceFeed.latestAnswer());




}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

