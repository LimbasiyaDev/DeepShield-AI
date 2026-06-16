export const volumeData = [
  { name: "Jan", volume: 4000, unprotected: 2400 },
  { name: "Feb", volume: 3000, unprotected: 1398 },
  { name: "Mar", volume: 2000, unprotected: 9800 },
  { name: "Apr", volume: 2780, unprotected: 3908 },
  { name: "May", volume: 1890, unprotected: 4800 },
  { name: "Jun", volume: 2390, unprotected: 3800 },
  { name: "Jul", volume: 3490, unprotected: 4300 },
];

export const riskDistribution = [
  { name: "Low Risk", value: 85, color: "var(--success)" },
  { name: "Medium Risk", value: 12, color: "var(--warning)" },
  { name: "High Risk", value: 3, color: "var(--destructive)" },
];

export const recentTrades = [
  { id: "0x1a...b9f", pair: "SUI/USDC", value: "$45,200", risk: 12, savings: "$142.50", status: "Protected", mode: "Commit-Reveal" },
  { id: "0x2c...e4a", pair: "CETUS/SUI", value: "$12,450", risk: 85, savings: "$310.20", status: "Protected", mode: "Split Order" },
  { id: "0x3d...f1b", pair: "WETH/USDC", value: "$105,000", risk: 45, savings: "$85.00", status: "Protected", mode: "Delayed" },
  { id: "0x4e...a2c", pair: "DEEP/USDT", value: "$8,900", risk: 5, savings: "$12.40", status: "Protected", mode: "Normal" },
  { id: "0x5f...d3e", pair: "WAL/SUI", value: "$34,100", risk: 92, savings: "$450.80", status: "Protected", mode: "AI Selected" },
];

export const whaleEvents = [
  { id: 1, type: "Buy Wall", pair: "SUI/USDC", size: "$2.5M", impact: "+4.2%", time: "2 mins ago", risk: "High", action: "Accumulation" },
  { id: 2, type: "Large Sell", pair: "CETUS/SUI", size: "$1.8M", impact: "-3.1%", time: "15 mins ago", risk: "Critical", action: "Dump Risk" },
  { id: 3, type: "Liquidity Shift", pair: "DEEP/USDC", size: "$5.0M", impact: "0%", time: "1 hour ago", risk: "Medium", action: "Pool Drain" },
  { id: 4, type: "Flash Loan", pair: "WAL/SUI", size: "$10.2M", impact: "High Volatility", time: "2 hours ago", risk: "Critical", action: "Manipulation" },
];

export const replayTrades = [
  { 
    id: "0x88...a12", 
    pair: "SUI/USDC", 
    originalRisk: 94, 
    predictedLoss: "$420.50", 
    actualExecution: "Protected Split", 
    moneySaved: "$415.00", 
    aiRecommendation: "Split Order",
    timestamp: "10:45 AM today"
  },
  { 
    id: "0x99...b34", 
    pair: "DEEP/USDC", 
    originalRisk: 72, 
    predictedLoss: "$1,250.00", 
    actualExecution: "Commit-Reveal", 
    moneySaved: "$1,245.00", 
    aiRecommendation: "Protected Execution",
    timestamp: "09:12 AM today"
  },
  { 
    id: "0xaa...c56", 
    pair: "CETUS/SUI", 
    originalRisk: 45, 
    predictedLoss: "$85.00", 
    actualExecution: "Delayed Batch", 
    moneySaved: "$80.00", 
    aiRecommendation: "Delay Trade",
    timestamp: "Yesterday"
  }
];

export const leaderboardData = [
  { rank: 1, wallet: "0x7a...4d2", score: 998, saved: "$145,200", trades: 1420, reduction: "94%" },
  { rank: 2, wallet: "0x3b...9e1", score: 985, saved: "$112,450", trades: 890, reduction: "91%" },
  { rank: 3, wallet: "0x9c...2f4", score: 972, saved: "$89,100", trades: 650, reduction: "88%" },
  { rank: 4, wallet: "0x1a...b9f (You)", score: 945, saved: "$45,200", trades: 312, reduction: "85%" },
  { rank: 5, wallet: "0x5d...8c3", score: 910, saved: "$34,500", trades: 420, reduction: "82%" },
];

export const portfolioAssets = [
  { symbol: "SUI", balance: "12,450.00", value: "$24,900.00", risk: "Medium", exposure: "34%" },
  { symbol: "DEEP", balance: "45,000.00", value: "$4,500.00", risk: "Low", exposure: "12%" },
  { symbol: "CETUS", balance: "8,900.00", value: "$8,900.00", risk: "High", exposure: "42%" },
  { symbol: "WAL", balance: "1,200.00", value: "$3,600.00", risk: "Low", exposure: "12%" },
];

export const intelligenceData = {
  SUI: { price: "$2.00", trend: "Bullish", move: "+4.2%", confidence: 92, action: "Protected Buy" },
  DEEP: { price: "$0.10", trend: "Neutral", move: "+1.1%", confidence: 75, action: "Hold" },
  CETUS: { price: "$1.00", trend: "Bearish", move: "-3.5%", confidence: 88, action: "Wait" },
  WAL: { price: "$3.00", trend: "Bullish", move: "+8.4%", confidence: 95, action: "Protected Buy" }
};
