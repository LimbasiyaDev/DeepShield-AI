import { SuiService } from './sui.service.js';

export class PortfolioService {
  static async analyze(walletAddress: string) {
    try {
      const assets = await SuiService.getWalletAssets(walletAddress);
      
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
    } catch (error) {
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
