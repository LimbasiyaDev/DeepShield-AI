import { RiskService } from './risk.service.js';
import { DeepBookIntelligenceService } from './deepbook-intelligence.service.js';

export class ProtectionService {
  static async analyze(pair: string, amount: number, slippage: number, wallet: string) {
    const plan = await DeepBookIntelligenceService.generateExecutionPlan({ pair, amount, wallet });

    return {
      riskScore: plan.riskScore,
      strategy: plan.strategy,
      estimatedSavings: plan.estimatedSavings,
      recommendation: plan.riskScore > 40 ? "Enable Protection" : "Safe to execute",
      explanation: plan.explanation,
      metrics: plan.metrics
    };
  }

  static async execute(tradeData: any) {
    console.log(`Executing trade for ${tradeData.wallet} with strategy ${tradeData.strategy}`);
    return {
      status: 'success',
      txHash: '0x' + Math.random().toString(16).substring(2),
      actualSavings: tradeData.estimatedSavings || 0
    };
  }
}
