import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import ContractAddresses from "../DeploymentOutput.json";
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

        const mockTokenArtifact = await hre.artifacts.readArtifact("MockToken");
        const mockToken = new ethers.Contract(
            "0xe7983094d8865bBCc891ECe5d28a584A3bE6C601",
            mockTokenArtifact.abi,
            getWallet()
        )
        const approve = await mockToken.approve(ContractAddresses.GlpManager.address, ethers.parseEther('1000000'));
        await approve.wait();
        const glpManagerArtifact = await hre.artifacts.readArtifact("GlpManager");
        const glpManager = new ethers.Contract(
        ContractAddresses.GlpManager.address,
        glpManagerArtifact.abi,
        getWallet()
    );

    const  addLiquidity = await glpManager.addLiquidity("0xe7983094d8865bBCc891ECe5d28a584A3bE6C601", ethers.parseEther('1000'), 0, 0);
    await addLiquidity.wait();
    console.log(addLiquidity.hash);

   /*     const mint = await mockToken.mint(wallet.address, ethers.parseEther('1000000'));
        await mint.wait();
        console.log("mint success: ", mint.hash);*/



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

