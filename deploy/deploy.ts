import {deployContract, getWallet, loadPreviousDeployment} from "./utils";
import * as config from "../config";
import "ethers";
import {ethers} from "ethers";
import  tokenConfig from "../pricefeed.json";
import * as readline from "readline";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {

  let deploymentState = loadPreviousDeployment();

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
        const setMaxStrictPriceDeviation = await vaultPriceFeed.setMaxStrictPriceDeviation( 10n ** 28n);
        await setMaxStrictPriceDeviation.wait();
    }



    const setPriceSampleSpace = await vaultPriceFeed.setPriceSampleSpace(1);
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
        const setFundingRate = await vault.setFundingRate(60 * 60, 100, 100);
        await setFundingRate.wait();
    }


    const setInManagerMode = await vault.setInManagerMode(true);
    await setInManagerMode.wait();

    const vaultSetManager = await vault.setManager(await glpManager.getAddress(), true);
    await vaultSetManager.wait();

    const setFees = await vault.setFees(
        10,
        5,
        20,
        20,
        1,
        10,
        (2n * 10n ** 10n) * (10n ** 20n),
        24 * 60 * 60,
        true
    )
    await setFees.wait();

    const vaultErrorController = await deployContract("VaultErrorController", deploymentState);

    const setErrorController = await vault.setErrorController(await vaultErrorController.getAddress());
    await setErrorController.wait();

    const setErrors = await vaultErrorController.setErrors(await vault.getAddress(), config.ERRORS);
    await setErrors.wait();

    const vaultUtils = await deployContract("VaultUtils", deploymentState, [await vault.getAddress()]);


    if(await vault.vaultUtils() == ethers.ZeroAddress){
        const setVaultUtils = await vault.setVaultUtils(await vaultUtils.getAddress());
        await setVaultUtils.wait();
    }




     const gmx = await deployContract("AGX", deploymentState) ;

     const setMinter = await gmx.setMinter(signer.address, true);
     await setMinter.wait();




     const yieldTracker = await deployContract("YieldTracker",deploymentState,[ await glp.getAddress()]) ;

     const glpSetTracker = await glp.setYieldTrackers([await yieldTracker.getAddress()]);
     await glpSetTracker.wait();

     const rewardDistributor = await deployContract("TimeDistributor", deploymentState)  ;


     const setRewardDistributor = await yieldTracker.setDistributor(await rewardDistributor.getAddress());
     await setRewardDistributor.wait();

     const setDistribution = await rewardDistributor.setDistribution([await yieldTracker.getAddress()], [0], [await gmx.getAddress()]);
     await setDistribution.wait();
     console.log("update last Distribution time success");
     const gmxmint = await gmx.mint(await rewardDistributor.getAddress(), ethers.parseEther('10000'));
     await gmxmint.wait();
     const setTokenPerInterval = await rewardDistributor.setTokensPerInterval(await yieldTracker.getAddress(), ethers.parseEther('1'));
     await setTokenPerInterval.wait();
     console.log("set Token interval success")
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

    const reader = await  deployContract("Reader", deploymentState);
    const vaultReader = await  deployContract("VaultReader", deploymentState);

/*


     const  addLiquidity = await glpManager.addLiquidity(await mockToken.getAddress(), ethers.parseEther('1000'), 0, 0);
     await addLiquidity.wait();

     console.log(await glp.balanceOf(signer.address));
     console.log( await glpManager.getAumInUsdg(true));
     console.log( await glpManager.getAumInUsdg(false));

     console.log(await yieldTracker.claimable(signer.address));


     const decreaseLiquidity = await glpManager.removeLiquidity(await mockToken.getAddress(), ethers.parseEther('10'), 0, signer.address);
     await decreaseLiquidity.wait();
     console.log("decrease Liquidity success");


     console.log(await glp.balanceOf(signer.address));
     console.log( await glpManager.getAumInUsdg(true));
     console.log( await glpManager.getAumInUsdg(false));

     console.log(await yieldTracker.claimable(signer.address));




*/



}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

