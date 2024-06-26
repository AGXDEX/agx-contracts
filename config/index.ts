import {ethers} from "ethers";
import  priceFeedConfig from "../pricefeed.json";

export const ERRORS = [
    "Vault: zero error",
    "Vault: already initialized",
    "Vault: invalid _maxLeverage",
    "Vault: invalid _taxBasisPoints",
    "Vault: invalid _stableTaxBasisPoints",
    "Vault: invalid _mintBurnFeeBasisPoints",
    "Vault: invalid _swapFeeBasisPoints",
    "Vault: invalid _stableSwapFeeBasisPoints",
    "Vault: invalid _marginFeeBasisPoints",
    "Vault: invalid _liquidationFeeUsd",
    "Vault: invalid _fundingInterval",
    "Vault: invalid _fundingRateFactor",
    "Vault: invalid _stableFundingRateFactor",
    "Vault: token not whitelisted",
    "Vault: _token not whitelisted",
    "Vault: invalid tokenAmount",
    "Vault: _token not whitelisted",
    "Vault: invalid tokenAmount",
    "Vault: invalid usdgAmount",
    "Vault: _token not whitelisted",
    "Vault: invalid usdgAmount",
    "Vault: invalid redemptionAmount",
    "Vault: invalid amountOut",
    "Vault: swaps not enabled",
    "Vault: _tokenIn not whitelisted",
    "Vault: _tokenOut not whitelisted",
    "Vault: invalid tokens",
    "Vault: invalid amountIn",
    "Vault: leverage not enabled",
    "Vault: insufficient collateral for fees",
    "Vault: invalid position.size",
    "Vault: empty position",
    "Vault: position size exceeded",
    "Vault: position collateral exceeded",
    "Vault: invalid liquidator",
    "Vault: empty position",
    "Vault: position cannot be liquidated",
    "Vault: invalid position",
    "Vault: invalid _averagePrice",
    "Vault: collateral should be withdrawn",
    "Vault: _size must be more than _collateral",
    "Vault: invalid msg.sender",
    "Vault: mismatched tokens",
    "Vault: _collateralToken not whitelisted",
    "Vault: _collateralToken must not be a stableToken",
    "Vault: _collateralToken not whitelisted",
    "Vault: _collateralToken must be a stableToken",
    "Vault: _indexToken must not be a stableToken",
    "Vault: _indexToken not shortable",
    "Vault: invalid increase",
    "Vault: reserve exceeds pool",
    "Vault: max USDG exceeded",
    "Vault: reserve exceeds pool",
    "Vault: forbidden",
    "Vault: forbidden",
    "Vault: maxGasPrice exceeded"
]

export const WETH = priceFeedConfig.WETH.tokenAddress;
export const COOL_DOWN_DURATION = 0;

export const MAX_STRICT_PRICE_DEVIATION = ethers.parseEther('5000000000')

export const PRICE_SAMPLE_SPACE = 1;
export const FUNDING_INTERVAL = 3600;
export const FUNDING_RATE_FACTOR = 100;

export const STABLE_FUNDING_RATE_FACTOR = 100;

export const TAX_BASIS_POINTS = 60;

export const STABLE_TAX_BASIS_POINTS = 5;
export const MINT_BURN_FEE_BASIS_POINTS = 25;
export const SWAP_FEE_BASIS_POINTS = 25;

export const STABLE_SWAP_FEE_BASIS_POINTS = 1;

export const MARGIN_FEE_BASIS_POINTS = 40;
export const LIQUIDATION_FEE_USD = ethers.parseEther('5000000000000');

export const MIN_PROFIT_TIME = 10800;

export const HAS_DYNAMIC_FEES = true;

export const AGX_TOTAL_SUPPLY = ethers.parseEther('100000000')
export const WEEKLY_SCHEDULE = [
    0,
    ethers.parseEther('300000.00'),
    ethers.parseEther('297000.00'),
    ethers.parseEther('294030.00'),
    ethers.parseEther('291089.70'),
    ethers.parseEther('288178.80'),
    ethers.parseEther('285297.01'),
    ethers.parseEther('282444.04'),
    ethers.parseEther('279619.60'),
    ethers.parseEther('276823.41'),
    ethers.parseEther('274055.17'),
    ethers.parseEther('271314.62'),
    ethers.parseEther('268601.48'),
    ethers.parseEther('265915.46'),
    ethers.parseEther('263256.31'),
    ethers.parseEther('260623.74'),
    ethers.parseEther('258017.51'),
    ethers.parseEther('255437.33'),
    ethers.parseEther('252882.96'),
    ethers.parseEther('250354.13'),
    ethers.parseEther('247850.59'),
    ethers.parseEther('245372.08'),
    ethers.parseEther('242918.36'),
    ethers.parseEther('240489.18'),
    ethers.parseEther('238084.29'),
    ethers.parseEther('235703.44'),
    ethers.parseEther('233346.41'),
    ethers.parseEther('231012.94'),
    ethers.parseEther('228702.81'),
    ethers.parseEther('226415.79'),
    ethers.parseEther('224151.63'),
    ethers.parseEther('221910.11'),
    ethers.parseEther('219691.01'),
    ethers.parseEther('217494.10'),
    ethers.parseEther('215319.16'),
    ethers.parseEther('213165.97'),
    ethers.parseEther('211034.31'),
    ethers.parseEther('208923.97'),
    ethers.parseEther('206834.73'),
    ethers.parseEther('204766.38'),
    ethers.parseEther('202718.71'),
    ethers.parseEther('200691.53'),
    ethers.parseEther('198684.61'),
    ethers.parseEther('196697.77'),
    ethers.parseEther('194730.79'),
    ethers.parseEther('192783.48'),
    ethers.parseEther('190855.65'),
    ethers.parseEther('188947.09'),
    ethers.parseEther('187057.62'),
    ethers.parseEther('185187.04'),
    ethers.parseEther('183335.17'),
    ethers.parseEther('181501.82')
]

export const INIT_TRANSFER =  ethers.parseEther('5000000');

export const NFT_REWARD_AMOUNT = ethers.parseEther('2500000');

export const INCENTIVE_DURATION = 15552000;

export const STAKE_WEEKLY_SCHEDULE = [
    0,
    ethers.parseEther('200000.00'),
    ethers.parseEther('198000.00'),
    ethers.parseEther('196020.00'),
    ethers.parseEther('194059.80'),
    ethers.parseEther('192119.20'),
    ethers.parseEther('190198.01'),
    ethers.parseEther('188296.03'),
    ethers.parseEther('186413.07'),
    ethers.parseEther('184548.94'),
    ethers.parseEther('182703.45'),
    ethers.parseEther('180876.42'),
    ethers.parseEther('179067.65'),
    ethers.parseEther('177276.97'),
    ethers.parseEther('175504.20'),
    ethers.parseEther('173749.16'),
    ethers.parseEther('172011.67'),
    ethers.parseEther('170291.55'),
    ethers.parseEther('168588.64'),
    ethers.parseEther('166902.75'),
    ethers.parseEther('165233.72'),
    ethers.parseEther('163581.39'),
    ethers.parseEther('161945.57'),
    ethers.parseEther('160326.12'),
    ethers.parseEther('158722.86'),
    ethers.parseEther('157135.63'),
    ethers.parseEther('155564.27'),
    ethers.parseEther('154008.63')
]

export const  STAKE_INIT_TRANSFER =  ethers.parseEther('5000000');

export const EXECUTE_INCREASE_ADMIN = "0xb8086c99edd4a93591ab29daf111701f2796f939";
export const EXECUTE_DECREASE_ADMIN = "0x79f3ec0ded49398ded051571fdc640815e59df36"
export const FEED_ADMIN = "0x9e86780be7ec04a76da633614b4c820cfd964b85"

export const POSITION_UTILS = "0x1842614D09d6EA4Ca9E57AF69355AaE26745Ba9d"

export const LIQUIDATOR = "0xa011db48998520e7ebe47032ec21cbaa7d37391d";

export const FEE_ADMIN = "0x0207f5a8152d853a900d23d066bcd55eff238730"


