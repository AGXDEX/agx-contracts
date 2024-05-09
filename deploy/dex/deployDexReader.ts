import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "../utils";
import "ethers";
import {ethers} from "ethers";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import price from "../../pricefeed.json";
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);



    const contract = await deployer.loadArtifact("DexReader");

    const dexReader = await  await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        contract,
        ["0x45f84cf9620cecEDaf6742d38F480A5683030fe8"], { initializer: "initialize" });
    console.log(await dexReader.getAddress());
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

