import BigNumber from 'bignumber.js';
import { getAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';

import provider from '@/utils/provider';
import config from '@/config';

export function formatAddress(address: string, length = 8): string {
    const ellipsizedAddress = `${address.substr(0, 2 + length / 2)}…${address.substr(42 - length / 2)}`;
    return ellipsizedAddress;
}

export function formatTxHash(txHash: string, length = 16): string {
    const ellipsizedHash = `${txHash.substr(0, 2 + length / 2)}…${txHash.substr(66 - length / 2)}`;
    return ellipsizedHash;
}

export function formatDate(timestamp: number): string {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', options);
}

export function isAddress(value: string): boolean {
    try {
        getAddress(value);
    } catch(e) {
        return false;
    }
    return true;
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
    const scalePow = new BigNumber(decimalPlaces.toString());
    const scaleMul = new BigNumber(10).pow(scalePow);
    return input.times(scaleMul);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function getExplorerLink(txHash: string, type: string = 'address'): string {
    return `${config.explorer}/${type}/${txHash}`;
}

export function getPoolLink(pool: string): string {
    return `${config.poolsUrl}/#/pool/${pool}`;
}

export function getAssetLogo(address: string): string {
    return `https://raw.githubusercontent.com/yogi-fi/yogi-assets/master/assets/${config.chainId}/${address}.png`;
}

export function logRevertedTx(
    sender: string,
    contract: Contract,
    action: string,
    params: any,
    overrides: any,
): void {
    overrides.gasPrice = sender;
    const dummyPrivateKey = '0x651bd555534625dc2fd85e13369dc61547b2e3f2cfc8b98cee868b449c17a4d6';
    const dummyWallet = new Wallet(dummyPrivateKey).connect(provider);
    const loggingContract = contract.connect(dummyWallet);
    loggingContract[action](...params, overrides);
}
