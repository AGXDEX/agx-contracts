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

            const weth = await testDeployContract("WrappedEther");
            console.log( await weth.getAddress());






}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

