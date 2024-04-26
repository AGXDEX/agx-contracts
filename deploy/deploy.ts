import * as hre from "hardhat";
import { getWallet } from "./utils";
import { ethers } from "ethers";
import {Deployer} from "@matterlabs/hardhat-zksync-deploy";

// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {

  /*const wallet =  getWallet();
  const deployer = new Deployer(hre, wallet);
  const contractArtifact = await hre.artifacts.readArtifact("GMX") as any;

  const contract = await deployer.deploy(contractArtifact, []);
  await contract.waitForDeployment()

*/

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

