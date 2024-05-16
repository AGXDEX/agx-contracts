import {sendTxn, getWallet, deployContract, loadPreviousDeployment} from "./utils";
import {Contract, ethers} from "ethers";
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
  const vaultPriceFeedArtifact = await hre.artifacts.readArtifact("VaultPriceFeed");
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
  const vaultPriceFeed = new Contract(
      ContractAddresses.VaultPriceFeed.address,
      vaultPriceFeedArtifact.abi,
      getWallet()
  )
  const depositFee = "30" // 0.3%
  const minExecutionFee = "100000000000000" // 0.0001 ETH


  const positionRouterArgs = [vaultAddr, routerAddr, priceFeed.WETH.tokenAddress, ContractAddresses.ShortsTracker.address, depositFee, minExecutionFee]
  const positionRouter = await deployContract("PositionRouter", deploymentState, positionRouterArgs)
  const positionRouterAddr = await positionRouter.getAddress()
  const timeLockArgs = [walletAddr, 3600, walletAddr, walletAddr, ContractAddresses.GlpManager.address,ContractAddresses.GlpManager.address, ethers.ZeroAddress, 10000, 0 ,0];
  const timeLock = await deployContract("Timelock", deploymentState, timeLockArgs)
  const shortTrackerTimeLockArgs = [walletAddr, 0, 0,0,];
  const shortsTrackerTimeLock = await deployContract("ShortsTrackerTimelock", deploymentState, shortTrackerTimeLockArgs);



  //await sendTxn(shortsTrackerTimeLock.signalSetHandler(positionRouter.address, true), "shortsTrackerTimelock.signalSetHandler(positionRouter)")

  await sendTxn(router.addPlugin(positionRouterAddr), "router.addPlugin")

  await sendTxn(positionRouter.setDelayValues(0, 180, 30 * 60), "positionRouter.setDelayValues")

  await  sendTxn(timeLock.setContractHandler(await positionRouter.getAddress(), true), "timelock.setContractHandler(positionRouter)")

  await sendTxn(positionRouter.setGov(await vault.gov()), "positionRouter.setGov")

  await sendTxn(positionRouter.setAdmin(walletAddr), "positionRouter.setAdmin")

  await sendTxn(positionRouter.setPositionKeeper(walletAddr, true), "positionRouter.setPositionKeeper")

  await sendTxn(positionRouter.setCallbackGasLimit("2200000"), "positionRouter.setCallbackGasLimit")
 const fastPriceEvents = await deployContract("FastPriceEvents", deploymentState, []);
  const secondaryPriceFeed = await deployContract("FastPriceFeed", deploymentState, [
    5 * 60, // _priceDuration
    60 * 60, // _maxPriceUpdateDelay
    1, // _minBlockInterval
    250, // _maxDeviationBasisPoints
    await fastPriceEvents.getAddress(), // _fastPriceEvents
    walletAddr // _tokenManager
  ])

  await sendTxn(vaultPriceFeed.setSecondaryPriceFeed(secondaryPriceFeed.address), "vaultPriceFeed.setSecondaryPriceFeed")

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
