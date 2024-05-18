import {deployContract, getWallet, loadPreviousDeployment, sendTxn, testDeployContract} from "../utils";
import "ethers";
import {ethers} from "ethers";
import fs from "fs";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import price from "../../pricefeed.json";
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

    const alp =await testDeployContract("ALP");
    console.log(await alp.getAddress());

    const agx =await testDeployContract("AGX");
    console.log(await agx.getAddress());


    //mint agx
    await sendTxn(agx.setMinter(wallet.address, true), "agx set minter");
    await sendTxn(agx.mint(wallet.address, ethers.parseEther("10000000")), "agx mint");




    //emission deploy
    const yieldEmissionArtifact = await deployer.loadArtifact("YieldEmission");

    const yieldEmission = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        yieldEmissionArtifact,
        [await alp.getAddress(), await agx.getAddress()], { initializer: "initialize" });
    console.log(await yieldEmission.getAddress());
    console.log("yieldEmission", await yieldEmission.getAddress());


    const emissionScheduleArtifact = await deployer.loadArtifact("EmissionSchedule");

    const emissionSchedule = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        emissionScheduleArtifact,
        [await yieldEmission.getAddress(), await agx.getAddress()], { initializer: "initialize" });
    console.log("emissionSchedule", await emissionSchedule.getAddress());


    // yield emission set emission schedule
    await sendTxn(yieldEmission.setEmissionSchedule(await emissionSchedule.getAddress()), "yield emission set emission schedule");



    //alp set yield tracker
    await sendTxn(alp.setYieldTrackers([await yieldEmission.getAddress()]), "alp set yield tracker");


    //TODO test delete
    await sendTxn(alp.setMinter(wallet.address, true), "alp set minter");

    const weeklySchedule = [0, ethers.parseEther('10000'), ethers.parseEther('10000')];
    await sendTxn(agx.transfer(await emissionSchedule.getAddress(), ethers.parseEther('1000000')), "agx transfer");
    await sendTxn(emissionSchedule.setWeeklySchedule(weeklySchedule), "emissionSchedule set weeklySchedule");
    
    //notify
    await sendTxn(yieldEmission.notify(), "yieldEmission notify");


    //set emission weekly and transfer token















}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

