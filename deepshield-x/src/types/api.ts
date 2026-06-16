export interface User {
  id: string;
  walletAddress: string;
  protectionScore: number;
  totalProtectedTrades: number;
  totalSavings: number;
  createdAt: string;
  updatedAt: string;
}

export interface RiskReport {
  id?: string;
  walletAddress: string;
  tokenPair: string;
  riskScore: number;
  riskLevel?: string;
  breakdown?: Record<string, any>;
  recommendation?: string;
  strategy?: string;
  estimatedSavings?: number;
}

export interface WhaleEvent {
  id: string;
  token: string;
  eventType: string;
  volume: number;
  impact: string;
  confidence: number;
  timestamp?: number;
}

export interface PortfolioAnalysis {
  walletAddress: string;
  portfolioScore: number;
  riskLevel: string;
  recommendation: string;
  assetsAnalyzed: number;
}

export interface GuardianResponse {
  answer: string;
  confidence: number;
  recommendation: string;
}
