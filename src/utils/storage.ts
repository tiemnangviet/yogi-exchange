import { AssetMetadata } from '@/config';
import { Transaction } from '@/store/modules/account';

const PREFERENCES = 'preferences';
const TRANSACTIONS = 'transactions';
const ASSETS = 'assets';

interface Preferences {
    connector: string | null;
    slippage: number;
    pairs: Record<number, Pair>;
    list: string;
    darkmode: boolean;
}

interface Pair {
    inputAsset: string;
    outputAsset: string;
}

type Transactions = Record<string, Record<number, Record<string, Transaction>>>;
type Assets = Record<number, Record<string, AssetMetadata>>;

export default class Storage {
    static getConnector(): string | null {
        const preferences = getPreferences();
        return preferences.connector;
    }

    static getSlippage(): number {
        const preferences = getPreferences();
        return preferences.slippage;
    }

    static getPair(chainId: number): Pair {
        const preferences = getPreferences();
        return preferences.pairs[chainId];
    }

    static getList(): string {
        const preferences = getPreferences();
        return preferences.list;
    }

    static getTransactions(account: string, chainId: number): Record<string, Transaction> {
        const transactionString = localStorage.getItem(TRANSACTIONS);
        const transactions: Transactions = transactionString
            ? JSON.parse(transactionString)
            : {};
        if (!transactions ||
            !transactions[account] ||
            !transactions[account][chainId]
        ) {
            return {};
        }
        return transactions[account][chainId];
    }

    static getAssets(chainId: number): Record<string, AssetMetadata> {
        const assetString = localStorage.getItem(ASSETS);
        const assets: Assets = assetString
            ? JSON.parse(assetString)
            : {};
        if (!assets[chainId]) {
            return {};
        }
        return assets[chainId];
    }

    static isDarkmode(): boolean {
        const preferences = getPreferences();
        return preferences.darkmode;
    }

    static saveConnector(connector: string): void {
        const preferences = getPreferences();
        preferences.connector = connector;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
    }

    static saveSlippage(slippage: number): void {
        const preferences = getPreferences();
        preferences.slippage = slippage;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
    }

    static saveInputAsset(chainId: number, asset: string): void {
        const preferences = getPreferences();
        preferences.pairs[chainId].inputAsset = asset;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
    }

    static saveOutputAsset(chainId: number, asset: string): void {
        const preferences = getPreferences();
        preferences.pairs[chainId].outputAsset = asset;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
    }

    static saveList(list: string): void {
        const preferences = getPreferences();
        preferences.list = list;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
    }

    static saveTransaction(account: string, chainId: number, transaction: Transaction): void {
        const transactionString = localStorage.getItem(TRANSACTIONS);
        const transactions: Transactions = transactionString
            ? JSON.parse(transactionString)
            : {};
        if (!transactions[account]) {
            transactions[account] = {};
        }
        if (!transactions[account][chainId]) {
            transactions[account][chainId] = {};
        }
        transactions[account][chainId][transaction.hash] = transaction;
        localStorage.setItem(TRANSACTIONS, JSON.stringify(transactions));
    }

    static saveAssets(chainId: number, assets: Record<string, AssetMetadata>): void {
        const assetString = localStorage.getItem(ASSETS);
        const assetList: Assets = assetString
            ? JSON.parse(assetString)
            : {};
        if (!assetList[chainId]) {
            assetList[chainId] = {};
        }
        for (const address in assets) {
            assetList[chainId][address] = assets[address];
        }
        localStorage.setItem(ASSETS, JSON.stringify(assetList));
    }

    static toggleMode(): boolean {
        const preferences = getPreferences();
        preferences.darkmode = !preferences.darkmode;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
        return preferences.darkmode;
    }

    static clearConnector(): void {
        const preferences = getPreferences();
        preferences.connector = null;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
    }

    static clearTransactions(): void {
        localStorage.removeItem(TRANSACTIONS);
    }

    static clearAssets(): void {
        localStorage.removeItem(ASSETS);
    }
}

function getPreferences(): Preferences {
    const defaultPreferences: Preferences = {
        connector: null,
        slippage: 0.01,
        pairs: {
            56: {
                inputAsset: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                outputAsset: '0xa20FFbd8c1541E31145a9C8d34833fd4b2BC90e5',
            }
        },
        list: 'yogi',
        darkmode: true,
    };
    const preferenceString = localStorage.getItem(PREFERENCES);
    const preferences = JSON.parse(preferenceString || '{}');
    return {
        ...defaultPreferences,
        ...preferences,
    };
}
