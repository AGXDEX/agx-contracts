import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { PriceFeed__factory, PriceFeed } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import dotenv from 'dotenv';
// Load env file
dotenv.config();

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

type PriceConfig = {
    symbal: string;
    priceFeed: string;
    adminPK: string;
    threshold: number;
    heartbeat: number;
    lastPrice?: BigNumber;
    lastUpdate?: number;
};

const priceFeedConfigs = new Map<string, PriceConfig>();
const provider = new ethers.JsonRpcProvider(process.env.NOVA_RPC);

async function initConfig() {
    console.log('Init config');

    const supportTokenIds = !process.env.SUPPORT_TOKEN_IDS
        ? []
        : process.env.SUPPORT_TOKEN_IDS.split(',').map((c) => Number(c));

    for (const tokenId of supportTokenIds) {
        const symbal = process.env[`TOKEN_${tokenId}_SYMBAL`];
        const priceFeed = process.env[`TOKEN_${tokenId}_PRICEFEED`];
        const threshold = Number(process.env[`TOKEN_${tokenId}_THRESHOLD`]);
        const heartbeat = Number(process.env[`TOKEN_${tokenId}_HEARTBEAT`]);
        const adminPK = process.env[`TOKEN_${tokenId}_ADMIN_PK`];
        const priceFeedId = process.env[`TOKEN_${tokenId}_PRICEFEED_ID`];

        if (!symbal || !priceFeed || !adminPK || !threshold || !heartbeat || !priceFeedId) {
            console.error(`Invalid config for token ${tokenId}`);
            continue;
        }

        const _id = await removeHexPrefix(priceFeedId);
        priceFeedConfigs.set(_id, {
            symbal,
            priceFeed,
            adminPK,
            threshold,
            heartbeat,
        });
    }
}

async function updatePrice() {
    console.log('Update price');

    const denominator = process.env.THRESHOLD_DENOMINATOR;
    if (!denominator) {
        throw new Error('THRESHOLD_DENOMINATOR is required');
    }

    const pyth_endpoint = process.env.PYTH_RPC;
    if (!pyth_endpoint) {
        throw new Error('PYTH_RPC is required');
    }
    const priceServiceConnection = new PriceServiceConnection(
        pyth_endpoint,
        { priceFeedRequestConfig: { binary: true } }
    );

    // Hermes provides other methods for retrieving price updates. See
    // https://hermes.pyth.network/docs for more information.
    const priceFeeds = await priceServiceConnection.getLatestPriceFeeds([...priceFeedConfigs.keys()]);
    if (!priceFeeds) {
        throw new Error('Invalid price feeds');
    }
    for (const priceFeed of priceFeeds) {
        const price = priceFeed.getPriceUnchecked();
        const priceConfig = priceFeedConfigs.get(priceFeed.id);
        if (!price || !priceConfig) {
            throw new Error('Invalid price feed');
        }

        const promptPrice = price.price;
        const promptUpdate = price.publishTime;

        console.log(
            `Price for ${priceConfig.symbal} is ${promptPrice} at ${new Date(
                promptUpdate * 1000
            ).toISOString()}`
        );

        let isShouldUpdate: boolean = false;
        if (priceConfig.lastPrice && priceConfig.lastUpdate) {
            const timeElapsed = promptUpdate - priceConfig.lastUpdate;
            if (timeElapsed >= priceConfig.heartbeat) {
                isShouldUpdate = true;
            }

            const priceDiff = BigNumber.from(promptPrice).sub(priceConfig.lastPrice).abs();
            const priceDiffPercentage = priceDiff.mul(denominator).div(priceConfig.lastPrice);
            if (priceDiffPercentage.gt(priceConfig.threshold)) {
                isShouldUpdate = true;
            }
        } else {
            isShouldUpdate = true;
        }

        if (isShouldUpdate) {

            await setLatestAnswer(priceConfig.adminPK, priceConfig.priceFeed, promptPrice);

            // Update the last price and last update
            priceConfig.lastPrice = BigNumber.from(promptPrice);
            priceConfig.lastUpdate = promptUpdate;
            priceFeedConfigs.set(priceFeed.id, priceConfig);
        }

    }
}

async function setLatestAnswer(walletPK: string, priceFeedAddress: string, promptPrice: string) {
    const wallet = new ethers.Wallet(walletPK, provider);
    const priceFeedContract: PriceFeed = PriceFeed__factory.connect(priceFeedAddress, wallet);
    const tx = await priceFeedContract.setLatestAnswer(promptPrice);
    console.log(`Set latest answer for ${priceFeedAddress} to ${promptPrice}, and tx hash: ${tx.hash}`);

    const receipt = await provider.waitForTransaction(tx.hash);
    if (!!receipt) {
        console.log('The tx status is :>> ', receipt.status === 1);
        console.log('Set the latest answer successfully');
    } else {
        console.log('Set the latest answer failed');

    }
}

async function main() {

    await initConfig();

    while (true) {
        await updatePrice()
        await sleep(2000);
    }
}

async function removeHexPrefix(hexWithPrefix: string) {
    hexWithPrefix = hexWithPrefix.toLowerCase();
    if (hexWithPrefix.startsWith('0x')) {
        return hexWithPrefix.slice(2);
    } else {
        return hexWithPrefix;
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });