import {deployContract, getWallet, loadPreviousDeployment, sendTxn} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from "../pricefeed.json";
import * as readline from "readline";
import {Deployer} from "@matterlabs/hardhat-zksync";
import * as hre from "hardhat";
import {MARGIN_FEE_BASIS_POINTS, MAX_STRICT_PRICE_DEVIATION, PRICE_SAMPLE_SPACE} from "../config";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {

  let deploymentState: any = loadPreviousDeployment();

  const signer = getWallet();
  const vault = await deployContract("Vault", deploymentState);
  console.log(await vault.getAddress());
  //usdg
  const usdg = await deployContract("USDG",deploymentState, [await vault.getAddress()]);

  //router
  const router = await deployContract("Router", deploymentState,[await vault.getAddress(), await usdg.getAddress(), config.WETH] );

  //pricefeed
  const vaultPriceFeed = await deployContract("VaultPriceFeed",deploymentState);

    if(await vaultPriceFeed.maxStrictPriceDeviation() ==  0 ){
        const setMaxStrictPriceDeviation = await vaultPriceFeed.setMaxStrictPriceDeviation( config.MAX_STRICT_PRICE_DEVIATION);
        await setMaxStrictPriceDeviation.wait();
    }



    const setPriceSampleSpace = await vaultPriceFeed.setPriceSampleSpace(config.PRICE_SAMPLE_SPACE);
    await setPriceSampleSpace.wait();


    const setIsAmmEnabled = await vaultPriceFeed.setIsAmmEnabled(false);
    await setIsAmmEnabled.wait();

    const glp = await deployContract("ALP", deploymentState) ;


    const setInPrivateTransferMode = await glp.setInPrivateTransferMode(true);
    await setInPrivateTransferMode.wait();

    const shortsTracker = await deployContract("ShortsTracker", deploymentState,[await vault.getAddress()] );

    const setIsGlobalShortDataReady = await shortsTracker.setIsGlobalShortDataReady(true);
    await setIsGlobalShortDataReady.wait();



    const glpManager = await deployContract("GlpManager", deploymentState,[
      await vault.getAddress(),
      await usdg.getAddress(),
      await glp.getAddress(),
      await shortsTracker.getAddress(),
      config.COOL_DOWN_DURATION
    ])



    //setin private

    const glpSetMinter = await glp.setMinter(await glpManager.getAddress(), true);
    await glpSetMinter.wait();

    const usdgAddVault = await usdg.addVault(await glpManager.getAddress());
    await usdgAddVault.wait();


    if(await vault.isInitialized() != true){
        const vaultInit = await vault.initialize(
            await router.getAddress(),
            await usdg.getAddress(),
            await vaultPriceFeed.getAddress(),
            (2n * 10n ** 10n) * (10n ** 20n),
            100,// fundingRateFactor
            100// stableFundingRateFactor
        )
        await vaultInit.wait();
    }


    if(await vault.fundingRateFactor() == 0 ){
        const setFundingRate = await vault.setFundingRate(config.FUNDING_INTERVAL, config.FUNDING_RATE_FACTOR, config.STABLE_FUNDING_RATE_FACTOR);
        await setFundingRate.wait();
    }

    const setLiquidator = await vault.setLiquidator(config.LIQUIDATOR, true);
    await setLiquidator.wait();

    const setInManagerMode = await vault.setInManagerMode(true);
    await setInManagerMode.wait();

    const vaultSetManager = await vault.setManager(await glpManager.getAddress(), true);
    await vaultSetManager.wait();

    const setFees = await vault.setFees(
        config.TAX_BASIS_POINTS,
        config.STABLE_TAX_BASIS_POINTS,
        config.MINT_BURN_FEE_BASIS_POINTS,
        config.SWAP_FEE_BASIS_POINTS,
        config.STABLE_SWAP_FEE_BASIS_POINTS,
        config.MARGIN_FEE_BASIS_POINTS,
        config.LIQUIDATION_FEE_USD,
        config.MIN_PROFIT_TIME,
        config.HAS_DYNAMIC_FEES
    )
    await setFees.wait();

    const vaultErrorController = await deployContract("VaultErrorController", deploymentState);


    await sendTxn(vault.setErrorController(await vaultErrorController.getAddress()), "vault setErrorController");
    await sendTxn(vaultErrorController.setErrors(await vault.getAddress(), config.ERRORS), "vaultErrorController setErrors");

    const vaultUtils = await deployContract("VaultUtils", deploymentState, [await vault.getAddress()]);


    if(await vault.vaultUtils() == ethers.ZeroAddress){
        const setVaultUtils = await vault.setVaultUtils(await vaultUtils.getAddress());
        await setVaultUtils.wait();
    }




     const gmx = await deployContract("AGX", deploymentState) ;

     const setMinter = await gmx.setMinter(signer.address, true);
     await setMinter.wait();

    if(Number(await gmx.balanceOf(signer.address)) == 0 ){
     const gmxmint = await gmx.mint(signer.address, config.AGX_TOTAL_SUPPLY);
     await gmxmint.wait();
     console.log("mint gmx")
    }

    const rewardRouter = await deployContract("RewardRouter", deploymentState);
    const rewardRouterInit = await rewardRouter.initialize(
        config.WETH,
        await gmx.getAddress(),
        await glp.getAddress(),
        await glpManager.getAddress()
    );
    await rewardRouterInit.wait();



    const vaultSetHandler = await glpManager.setHandler(await rewardRouter.getAddress(), true);
    await vaultSetHandler.wait();


    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    const dexReaderArtifact =   await deployer.loadArtifact("DexReader");

    const dexReader = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        dexReaderArtifact,
        [deploymentState["NonfungibleManager"].address, deploymentState["V3Factory"].address, deploymentState["V3Staker"].address], { initializer: "initialize" });
    deploymentState["DexReader"] = {
        "name": "DexReader",
        "address": await dexReader.getAddress()
    }

    console.log("dex reader deployed");

    const yieldEmissionArtifact = await deployer.loadArtifact("YieldEmission");

    const yieldEmission = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        yieldEmissionArtifact,
        [await glp.getAddress(), await gmx.getAddress()], { initializer: "initialize" });

    deploymentState["YieldEmission"] = {
        "name": "YieldEmission",
        "address": await yieldEmission.getAddress()
    }
    console.log("YieldEmission  deployed");


    const emissionScheduleArtifact = await deployer.loadArtifact("EmissionSchedule");

    const emissionSchedule = await hre.zkUpgrades.deployProxy(
        deployer.zkWallet,
        emissionScheduleArtifact,
        [await yieldEmission.getAddress(), await gmx.getAddress()], { initializer: "initialize" });

    deploymentState["EmissionSchedule"] = {
        "name": "EmissionSchedule",
        "address": await emissionSchedule.getAddress()
    }

    console.log("EmissionSchedule  deployed");

    await sendTxn(yieldEmission.setEmissionSchedule(await emissionSchedule.getAddress()), "yield emission set emission schedule");
    await sendTxn(glp.setYieldTrackers([await yieldEmission.getAddress()]), "alp set yield tracker");

    await sendTxn(emissionSchedule.setWeeklySchedule(config.WEEKLY_SCHEDULE), "emissionSchedule set weeklySchedule");


    if(Number(await gmx.balanceOf(await emissionSchedule.getAddress())) == 0 ){
        await sendTxn(gmx.transfer(await emissionSchedule.getAddress(), config.INIT_TRANSFER), "agx transfer");
    }

    await sendTxn(yieldEmission.notify(), "yieldEmission notify");







    const reader = await  deployContract("Reader", deploymentState);
    const vaultReader = await  deployContract("VaultReader", deploymentState);








}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

