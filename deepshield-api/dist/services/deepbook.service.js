"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepBookService = void 0;
const client_1 = require("@mysten/sui/client");
const client = new client_1.SuiClient({ url: process.env.DEEPBOOK_RPC_URL || (0, client_1.getFullnodeUrl)('mainnet') });
class DeepBookService {
    static async getMarkets() {
        // Mocked DeepBook pools for Hackathon Demo
        return [
            { pair: 'SUI/USDC', poolId: '0x123...abc', baseAsset: 'SUI', quoteAsset: 'USDC' },
            { pair: 'DEEP/SUI', poolId: '0x456...def', baseAsset: 'DEEP', quoteAsset: 'SUI' },
            { pair: 'CETUS/SUI', poolId: '0x789...ghi', baseAsset: 'CETUS', quoteAsset: 'SUI' },
        ];
    }
    static async getOrderBook(poolId) {
        // Simulate fetching order book from DeepBook contract
        return {
            bids: [{ price: 1.05, size: 1000 }, { price: 1.04, size: 2500 }],
            asks: [{ price: 1.06, size: 500 }, { price: 1.07, size: 1500 }]
        };
    }
    static async getLiquidity(poolId) {
        return {
            totalLiquidityUSD: 15000000,
            baseLiquidity: 5000000,
            quoteLiquidity: 10000000
        };
    }
    static async getMarketDepth(poolId) {
        return {
            plus2Percent: 1200000,
            minus2Percent: 1500000
        };
    }
    static async getRecentTrades(poolId) {
        return [
            { price: 1.055, size: 100, side: 'buy', timestamp: Date.now() },
            { price: 1.054, size: 500, side: 'sell', timestamp: Date.now() - 1000 }
        ];
    }
    static async getSpread(poolId) {
        return {
            spreadPercent: 0.05,
            spreadValue: 0.005
        };
    }
    static async getVolume(poolId) {
        return {
            volume24h: 5000000,
            trades24h: 15000
        };
    }
}
exports.DeepBookService = DeepBookService;
