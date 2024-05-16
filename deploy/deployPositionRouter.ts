import {sendTxn, getWallet, deployContract, loadPreviousDeployment} from "./utils";
import { Contract } from "ethers";
import * as hre from "hardhat";
import * as ContractAddresses from "../DeploymentOutput.json";
import * as priceFeed from "../pricefeed.json";


async function main() {

  const rpc = hre.network.config.url;
  console.log("rpc", rpc);
  let deploymentState: any = loadPreviousDeployment();

  const capKeeperWallet = getWallet();
  const walletAddr = await capKeeperWallet.getAddress();

  const vaultArtifact = await hre.artifacts.readArtifact("Vault");
  const routerArtifact = await hre.artifacts.readArtifact("Router");
  const vault = new Contract(
    ContractAddresses.Vault.address,
    vaultArtifact.abi,
    getWallet()
  )
  const vaultAddr = await vault.getAddress();
  const routerAddr = await vault.router();
  const router = new Contract(
    routerAddr,
    routerArtifact.abi,
    getWallet()
  )
  const depositFee = "30" // 0.3%
  const minExecutionFee = "100000000000000" // 0.0001 ETH


  const positionRouterArgs = [vaultAddr, routerAddr, priceFeed.WETH.tokenAddress, ContractAddresses.ShortsTracker.address, depositFee, minExecutionFee]
  const positionRouter = await deployContract("PositionRouter", deploymentState, positionRouterArgs)
  const positionRouterAddr = await positionRouter.getAddress()

  let tx = await router.addPlugin(positionRouterAddr);
  await tx.wait();
  tx = await positionRouter.setDelayValues(0, 180, 30 * 60)
  await tx.wait();

  tx = await positionRouter.setGov(await vault.gov())
  await tx.wait();
  tx = await positionRouter.setAdmin(walletAddr)
  await tx.wait();


}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
