import {deployContract, getWallet, loadPreviousDeployment, sendTxn, testDeployContract} from "../utils";
import * as config from "../../config";
import "ethers";
import {Contract, ethers} from "ethers";
import  price from "../../pricefeed.json";
import fs from "fs";
import * as hre from "hardhat";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as EmissionAdd from "../../Emission.json";
import * as ContractAddresses from "../../DeploymentOutput.json";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    const stakeAGXArtifact = await hre.artifacts.readArtifact("StakeAGX");
    const stakeAGX = new Contract(
        EmissionAdd.StakeAGX.address,
        stakeAGXArtifact.abi,
        getWallet()
    )
   console.log(ethers.formatEther(await stakeAGX.claimable(wallet.address)));
    const claim = await stakeAGX.claim();
    await claim.wait();
    console.log(claim.hash);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

