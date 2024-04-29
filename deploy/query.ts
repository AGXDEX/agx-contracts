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
    const priceFeedArtifact = await hre.artifacts.readArtifact("VaultReader");
    const priceFeed = new ethers.Contract(
        ContractAddresses.VaultReader.address,
        priceFeedArtifact.abi,
        getWallet()
    );

    const res = await priceFeed.getVaultTokenInfoV4(
        ContractAddresses.Vault.address,
        ethers.ZeroAddress,
        "0xd7Da924AB56b87e7C1B1933c84992053FD824eA1",
        ethers.parseEther('1'),
        [
            '0x0000000000000000000000000000000000000000',
            '0xd7Da924AB56b87e7C1B1933c84992053FD824eA1',
            '0xE64F021d74D8803D4315696dD60E9C4213E75394',
            '0xbEC6Aa5DB3E6A2Ff9865cea3f6f4CF0D9c434Da6',
            '0x751Da73C410A0A0f64C143057bC5B36cfC8Ebd30',
            '0xD8824ca60F391aeFD38252968B67048FE8B91623'
        ]
        )
    console.log(res)



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

