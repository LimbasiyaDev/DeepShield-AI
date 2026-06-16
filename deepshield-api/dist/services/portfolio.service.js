"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const sui_service_1 = require("./sui.service");
class PortfolioService {
    static async analyze(walletAddress) {
        try {
            const assets = await sui_service_1.SuiService.getWalletAssets(walletAddress);
            let portfolioScore = 85;
            let riskLevel = 'Low';
            // Mock analysis logic for Hackathon
            if (assets.length < 2) {
                portfolioScore = 50;
                riskLevel = 'High';
            }
            return {
                walletAddress,
                portfolioScore,
                riskLevel,
                recommendation: "Diversify holdings to mitigate single-asset volatility.",
                assetsAnalyzed: assets.length
            };
        }
        catch (error) {
            return {
                walletAddress,
                portfolioScore: 70,
                riskLevel: 'Medium',
                recommendation: "Unable to complete full on-chain analysis at this time.",
                assetsAnalyzed: 0
            };
        }
    }
}
exports.PortfolioService = PortfolioService;
