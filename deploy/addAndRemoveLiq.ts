import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from  "../pricefeed.json";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import ContractAddresses from "../DeploymentOutput.json";
import {token} from "../typechain/contracts/libraries";
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);


        const mockTokenArtifact = await hre.artifacts.readArtifact("MockToken");
        const mockToken = new ethers.Contract(
            tokenConfig.usdt.tokenAddress,
            mockTokenArtifact.abi,
            getWallet()
        )
        const approve = await mockToken.approve(ContractAddresses.GlpManager.address, ethers.parseEther('1000000'));
        await approve.wait();



    const rewardRouterArtifact = await hre.artifacts.readArtifact("RewardRouter");
    const rewardRouter = new ethers.Contract(
        ContractAddresses.RewardRouter.address,
        rewardRouterArtifact.abi,
        getWallet()
    )
    const addLiq = await rewardRouter.mintAndStakeGlp(tokenConfig.usdt.tokenAddress, 100 * Math.pow(10, 6), 0, 0 );
    await addLiq.wait()
    console.log(addLiq.hash);
    /*    const glpManagerArtifact = await hre.artifacts.readArtifact("GlpManager");
        const glpManager = new ethers.Contract(
        ContractAddresses.GlpManager.address,
        glpManagerArtifact.abi,
        getWallet()
    );

    const  addLiquidity = await glpManager.addLiquidity(tokenConfig.usdt.tokenAddress, ethers.parseEther('1000'), 0, 0);
    await addLiquidity.wait();
    console.log(addLiquidity.hash);*/

   /*     const mint = await mockToken.mint(wallet.address, ethers.parseEther('1000000'));
        await mint.wait();
        console.log("mint success: ", mint.hash);*/



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

