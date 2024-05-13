import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  price from  "../pricefeed.json";
import fs from "fs";
import * as hre from "hardhat";
import factoryArtifact from "../externalABI/UniswapV3Factory.json";
import poolArtifact from "../externalABI/UniswapV3Pool.json";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {



    // Initialize contract instance for interaction
    const factory = new ethers.Contract(
        "0x0c283f1a3C6981eE623cb4E8AcC4f450f39D0815",
        factoryArtifact.abi,
        getWallet() // Interact with the contract on behalf of this wallet
    );
    const weth = "0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7"

    const poolAddr = await factory.getPool(weth,"0x0F3aFfe0c0465F7965845123B8c23509De0b0154", 10000);
    console.log(poolAddr);
    const pool = new ethers.Contract(
        poolAddr,
        poolArtifact.abi,
        getWallet() // Interact with the contract on behalf of this wallet
    )
    console.log("0x4471e21e7CC6436437f19576F8571186F164ea0F".toLowerCase());
    const slot0 = await pool.slot0();
    const sqrtPriceX96 = Number(slot0[0]);
    console.log((sqrtPriceX96/ 2** 96) ** 2)
    console.log(await pool.fee());





}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

