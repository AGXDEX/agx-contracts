import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import  ContractAddresses from  "../DeploymentOutput.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import  price from  "../pricefeed.json";

async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
/*
    const priceFeedArtifact = await deployer.loadArtifact('StakeAGX');
        await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, ContractAddresses.StakeAGX.address, priceFeedArtifact);
        console.log("upgrade success");*/


        //proxy admin upgrad
    const proxyAdminArtifact = await deployer.loadArtifact('ProxyAdmin');
    const proxyAdmin = new ethers.Contract("0xDb0fC2f238d594f7D0183337D30a4DAe15cC08D3", proxyAdminArtifact.abi, getWallet());
    const yieldEmission = await testDeployContract("YieldEmission", []);
    
    const upgrade =  await proxyAdmin.upgrade(ContractAddresses.YieldEmission.address, await yieldEmission.getAddress());
    // console.log("upgrade success");
    await upgrade.wait()
    console.log(upgrade.hash);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

