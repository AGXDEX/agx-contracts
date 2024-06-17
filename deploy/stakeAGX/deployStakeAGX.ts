import {deployContract, getWallet, loadPreviousDeployment, sendTxn, saveDeployment} from "../utils";
import * as config from "../../config";
import "ethers";
import {Contract, ethers} from "ethers";
import  price from "../../pricefeed.json";
import fs from "fs";
import * as hre from "hardhat";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as ContractAddresses from "../../DeploymentOutput.json";
import {zkUpgrades} from "hardhat";
import * as EmissionAdd from "../../Emission.json";
import {STAKE_INIT_TRANSFER, STAKE_WEEKLY_SCHEDULE} from "../../config";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    let deploymentState: any = loadPreviousDeployment();

    const agxArtifact = await deployer.loadArtifact("AGX");

    const agx = new Contract(
        ContractAddresses.AGX.address,
        agxArtifact.abi,
        getWallet()
    )

    const stakeAGXArtifact = await deployer.loadArtifact("StakeAGX");

    const stakeAGX = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        stakeAGXArtifact,
        [ContractAddresses.AGX.address, ContractAddresses.AGX.address], { initializer: "initialize" });


    deploymentState["StakeAGX"] = {
        "name": "StakeAGX",
        "address": await stakeAGX.getAddress()
    }


    const emissionScheduleArtifact = await deployer.loadArtifact("EmissionSchedule");

    const emissionSchedule = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        emissionScheduleArtifact,
        [await stakeAGX.getAddress(), await agx.getAddress()], { initializer: "initialize" });



    deploymentState["StakeAGXEmissionSchedule"] = {
        "name": "StakeAGXEmissionSchedule",
        "address": await stakeAGX.getAddress()
    }

    await sendTxn(stakeAGX.setEmissionSchedule(await emissionSchedule.getAddress()), "yield emission set emission schedule");
    await sendTxn(emissionSchedule.setWeeklySchedule(config.STAKE_WEEKLY_SCHEDULE), "emissionSchedule set weeklySchedule");


    if(Number(await agx.balanceOf(await emissionSchedule.getAddress())) == 0 ){
        await sendTxn(agx.transfer(await emissionSchedule.getAddress(), config.STAKE_INIT_TRANSFER), "agx transfer");
    }

    await sendTxn(stakeAGX.notify(), "yieldEmission notify");

    //set multipliers
    const day_seconds = 86400;
    await sendTxn(stakeAGX.setLockupRewardMultipliers(
        [day_seconds * 30, day_seconds * 60, day_seconds * 90, day_seconds * 180, day_seconds * 360],
        [1, 2, 3, 4, 5]
    ), "yieldEmission notify");


    const yieldEmissionArtifact = await deployer.loadArtifact("YieldEmission");

    const yieldEmission = new Contract(
        ContractAddresses.YieldEmission.address,
        yieldEmissionArtifact.abi,
        getWallet()
    )
    await sendTxn(yieldEmission.setStakeAgxContract(await stakeAGX.getAddress()), "yieldEmission setStakeAgxContract");


    saveDeployment(deploymentState);



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

