import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "../utils";
import "ethers";
import {ethers} from "ethers";
import fs from "fs";
import * as hre from "hardhat";
import {Deployer} from "@matterlabs/hardhat-zksync";
import EmissionContract from "../../Emission.json";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {

    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);


    const emissionScheduleArtifact = await hre.artifacts.readArtifact("EmissionSchedule");
    const yieldEmissionArtifact = await hre.artifacts.readArtifact("YieldEmission");
    const alpArtifact = await hre.artifacts.readArtifact("ALP");
    const agxArtifact = await hre.artifacts.readArtifact("AGX");
    const yieldEmission = new ethers.Contract(
        EmissionContract.yieldEmission.address,
        yieldEmissionArtifact.abi,
        getWallet()
    )
    const emissionSchedule = new ethers.Contract(
        EmissionContract.emissionSchedule.address,
        emissionScheduleArtifact.abi,
        getWallet()
    )
    const alp = new ethers.Contract(
        EmissionContract.ALP.address,
        alpArtifact.abi,
        getWallet()
    )
    const agx = new ethers.Contract(
        EmissionContract.AGX.address,
        agxArtifact.abi,
        getWallet()
    )


    console.log(await yieldEmission.getWeek())
    console.log(await yieldEmission.periodFinish())
    console.log(await yieldEmission.startTime())
    console.log(await emissionSchedule.yieldEmission())
    console.log(await yieldEmission.rewardRate())
    const claim = await alp.claim(wallet.address);
    await claim.wait();
    console.log(claim.hash);





}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

