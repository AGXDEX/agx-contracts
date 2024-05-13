import * as hre from "hardhat";
import { getWallet } from "../utils";
import { ethers } from "ethers";
import   Staker from "../../externalABI/UniV3Staker.json"
import price from "../../pricefeed.json";
import ContractAddresses from "../../DeploymentOutput.json";

async function main() {
    const stakerAddress = "0xa4e383E582581DEAac4020363De0a741bEfDF3Ad";
    const agxArtifact = await hre.artifacts.readArtifact("AGX");
    const agx = new ethers.Contract(
        ContractAddresses.AGX.address,
        agxArtifact.abi,
        getWallet()
    );
 /*   const mint = await agx.mint(getWallet().address, ethers.parseEther('1000000'));
    await mint.wait();

    const approve = await agx.approve(stakerAddress, ethers.parseEther('10000'));
    await approve.wait()*/;
    const v3Staker = new ethers.Contract(
        stakerAddress,
        Staker,
        getWallet() //
    );
    const timestamp = Math.floor(Date.now() / 1000);
    const args = {
        rewardToken: '0x2AAde57a0d52950535996E8d26eCaCb32342AeAe',
        pool: '0x4471e21e7CC6436437f19576F8571186F164ea0F',
        startTime: 1715588374,
        endTime: 1716588364,
        refundee: '0x330BD48140Cf1796e3795A6b374a673D7a4461d0'
    };

    console.log(args);

    const createIncentive = await v3Staker.stakeToken(
       args, 16);

    await createIncentive.wait();
    console.log(createIncentive.hash);




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
