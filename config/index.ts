import {ethers} from "ethers";

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

export const WETH = "0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7";
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
    ethers.parseEther('50000'),
    ethers.parseEther('50000')
]

export const INIT_TRANSFER =  ethers.parseEther('100000');

export const NFT_REWARD_AMOUNT = ethers.parseEther('100000');

export const INCENTIVE_DURATION = 15552000;
