import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  price from  "../pricefeed.json";
import fs from "fs";
import * as hre from "hardhat";
import ContractAddresses from "../DeploymentOutput.json";
import tokenConfig from "../pricefeed.json";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {
    const vaultArtifact = await hre.artifacts.readArtifact("Vault");
    const vaultPriceFeedArtifact = await hre.artifacts.readArtifact("VaultPriceFeed");
    const vault = new ethers.Contract(
        ContractAddresses.Vault.address,
        vaultArtifact.abi,
        getWallet()
    )
    const vaultPricefeed = new ethers.Contract(
        ContractAddresses.VaultPriceFeed.address,
        vaultPriceFeedArtifact.abi,
        getWallet()
    )


    for (const key in price) {
        const vaultPriceFeedSetConfig = await await vaultPricefeed.setTokenConfig(
            price[key].tokenAddress,
            price[key].priceFeed,
            8,
            price[key].isStrictStable
        );
        await vaultPriceFeedSetConfig.wait();
        console.log(key ,'vaultPricefeed config')
        const vaultSetConfig = await vault.setTokenConfig(
            price[key].tokenAddress,
            price[key].decimals,
            price[key].tokenWeight,
            0,
            ethers.parseEther(`${price[key].maxUsdgAmount}`),
            price[key].isStrictStable,
            price[key].isShortable,
        );
        await vaultSetConfig.wait();
        console.log(key, 'vault config')
    }

    const deploymentStateJSON = JSON.stringify(price, null, 2);
    fs.writeFileSync("./pricefeed.json", deploymentStateJSON);

    const ezETH = "0x3FDB1939daB8e2d4F7a04212F142469Cd52d6402"
    const disableEzToken = await vault.clearTokenConfig(ezETH);
    await disableEzToken.wait();

    console.log(disableEzToken.hash);





}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
