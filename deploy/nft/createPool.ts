import * as hre from "hardhat";
import { getWallet } from "../utils";
import { BigNumberish, ethers} from "ethers";
import   NFTPositionsManagerArtifact from "../../externalABI/NFTPositionsManager.json"
import price from "../../pricefeed.json";
import ContractAddresses from "../../DeploymentOutput.json";
import {BigNumber} from "@ethersproject/bignumber";
import bn from 'bignumber.js'

async function main() {


    const nft = new ethers.Contract(
        "0x45f84cf9620cecEDaf6742d38F480A5683030fe8",
        NFTPositionsManagerArtifact,
        getWallet()
    );
    const tx = await nft.createAndInitializePoolIfNecessary(
        ContractAddresses.AGX.address,
        ContractAddresses.ALP.address,
        300,
        1
    );
    await tx.wait();
    console.log(tx.hash);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
 function encodePriceSqrt(reserve1: BigNumberish, reserve0: BigNumberish): BigNumber {
    return BigNumber.from(
        new bn(reserve1.toString())
            .div(reserve0.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
    )
}