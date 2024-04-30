import {deployContract, getWallet, loadPreviousDeployment,testDeployContract} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  price from  "../pricefeed.json";
import fs from "fs";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {

    for (const key in price) {
        if(price[key].tokenAddress == ''){
            //deploy mockToken
             const mockToken = await testDeployContract("MockToken", [key, key, price[key].decimals]);
            price[key].tokenAddress = await mockToken.getAddress();
        }
        if(price[key].priceFeed == ''){
            const priceFeed = await testDeployContract("PriceFeed");
            price[key].priceFeed = await priceFeed.getAddress();
        }
    }

    const deploymentStateJSON = JSON.stringify(price, null, 2);
    fs.writeFileSync("./pricefeed.json", deploymentStateJSON);






}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

