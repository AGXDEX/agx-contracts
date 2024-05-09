import * as hre from "hardhat";
import { getWallet } from "../utils";
import { ethers } from "ethers";
import   Staker from "../../externalABI/UniV3Staker.json"
import price from "../../pricefeed.json";
import ContractAddresses from "../../DeploymentOutput.json";

async function main() {
    const stakerAddress = "0x947248452C8227032b2B8c4a341F819C2d68f681";
    const agxArtifact = await hre.artifacts.readArtifact("AGX");
    const agx = new ethers.Contract(
        ContractAddresses.AGX.address,
        agxArtifact.abi,
        getWallet()
    );
    const mint = await agx.mint(getWallet().address, ethers.parseEther('1000000'));
    await mint.wait();

    const approve = await agx.approve(stakerAddress, ethers.parseEther('10000'));
    await approve.wait();
    const v3Staker = new ethers.Contract(
        stakerAddress,
        Staker,
        getWallet() //
    );
    const timestamp = Math.floor(Date.now() / 1000);
    const args = {
        rewardToken: ContractAddresses.AGX.address,
        pool: "0x5f54797FDaA58c118Eb1EbdAbA79Ac4bFD975efA",
        startTime: timestamp + 10  ,
        endTime: timestamp + 1000000,
        refundee: getWallet().address
    };

    console.log(args);

    const createIncentive = await v3Staker.createIncentive(
       args, ethers.parseEther('1000'));

    await createIncentive.wait();
    console.log(createIncentive.hash);




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
