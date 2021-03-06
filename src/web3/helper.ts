import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { ErrorCode } from '@ethersproject/logger';
import { Web3Provider } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';

import { logRevertedTx } from '@/utils/helpers';
import config from '@/config';

import ERC20Abi from '../abi/ERC20.json';
import WNativeAbi from '../abi/WNative.json';

export default class Helper {
    static async unlock(
        provider: Web3Provider,
        asset: string,
        spender: string,
    ): Promise<any> {
        const assetContract = new Contract(asset, ERC20Abi, provider.getSigner());
        try {
            return await assetContract.approve(spender, MaxUint256);
        } catch(e) {
            if (e.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
                const sender = await provider.getSigner().getAddress();
                logRevertedTx(sender, assetContract, 'approve', [spender, MaxUint256], {});
            }
            return e;
        }
    }

    static async wrap(
        provider: Web3Provider,
        amount: BigNumber,
    ): Promise<any> {
        const wnativeContract = new Contract(config.addresses.wnative, WNativeAbi, provider.getSigner());
        const overrides = {
            value: `0x${amount.toString(16)}`,
        };
        try {
            return await wnativeContract.deposit(overrides);
        } catch(e) {
            if (e.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
                const sender = await provider.getSigner().getAddress();
                logRevertedTx(sender, wnativeContract, 'deposit', [], overrides);
            }
            return e;
        }
    }

    static async unwrap(
        provider: Web3Provider,
        amount: BigNumber,
    ): Promise<any> {
        const wnativeContract = new Contract(config.addresses.wnative, WNativeAbi, provider.getSigner());
        try {
            return await wnativeContract.withdraw(amount.toString(), {});
        } catch(e) {
            if (e.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
                const sender = await provider.getSigner().getAddress();
                logRevertedTx(sender, wnativeContract, 'withdraw', [amount.toString()], {});
            }
            return e;
        }
    }

    static async getGasPrice(
        provider: Web3Provider,
    ): Promise<any> {
        const gasPrice = await provider.getGasPrice();
        return gasPrice.toString();
    }
}
