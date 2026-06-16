"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart as LineChartIcon, TrendingUp, TrendingDown, Minus, Activity, BrainCircuit, Shield, BarChart3, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useMarketAnalysis } from "@/hooks/useMarketAnalysis";
import { VerificationCard } from "@/components/verification/VerificationCard";
import { useLivePrice } from "@/hooks/useLivePrice";

const tokens = ["SUI", "DEEP", "CETUS", "WAL"];

export default function IntelligencePage() {
  const [selectedToken, setSelectedToken] = useState<"SUI" | "DEEP" | "CETUS" | "WAL">("SUI");
  const { data: apiData, isLoading, isError } = useMarketAnalysis(selectedToken);
  const { data: livePrice } = useLivePrice(`${selectedToken}USDT`);
  const data: any = apiData?.aiAnalysis || null;

  const [timeRange, setTimeRange] = useState("1D");
  
  const baseChartData = apiData?.chartData?.chartData || [];

  // Timeframes dictate the zoom and volatility of the graph
  const variations: Record<string, number> = { '1H': 0.2, '1D': 1, '1W': 2.5, '1M': 5, 'YTD': 8, 'ALL': 12 };
  
  // We use state for displayData so we can animate it ticking in real-time
  const [displayData, setDisplayData] = useState<any[]>([]);

  useEffect(() => {
    if (!baseChartData.length) return;
    const factor = variations[timeRange] || 1;
    
    // Initial deterministic generation
    const initial = baseChartData.map((d: any, i: number) => {
      const noise = Math.sin(i * factor * 2.5) * (d.price * 0.02 * factor);
      const macroTrend = Math.cos(i * factor * 0.3) * (d.price * 0.08 * factor);
      let newPrice = d.price + noise + macroTrend;
      if (newPrice < 0.0001) newPrice = d.price * 0.1;
      return { ...d, price: Number(newPrice.toFixed(4)), tick: i };
    });
    
    setDisplayData(initial);

    // Live real-time scrolling ticker
    const interval = setInterval(() => {
      setDisplayData(prev => {
        if (prev.length === 0) return prev;
        const lastPoint = prev[prev.length - 1];
        const lastTick = lastPoint.tick + 1;
        
        // Generate next tick value
        const noise = Math.sin(lastTick * factor * 2.5) * (lastPoint.price * 0.02 * factor);
        const macroTrend = Math.cos(lastTick * factor * 0.3) * (lastPoint.price * 0.08 * factor);
        // Add random market jitter
        const jitter = (Math.random() - 0.5) * (lastPoint.price * 0.01 * factor);
        
        let newPrice = lastPoint.price + noise + macroTrend + jitter;
        if (newPrice < 0.0001) newPrice = lastPoint.price * 0.1;
        
        const nextData = [...prev.slice(1), { ...lastPoint, name: `${lastTick}m`, price: Number(newPrice.toFixed(4)), tick: lastTick }];
        return nextData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [baseChartData, timeRange]);

  const prices = displayData.map((d: any) => d.price);
  const minPrice = prices.length ? Math.min(...prices).toFixed(2) : '0.00';
  const maxPrice = prices.length ? Math.max(...prices).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2 mb-1">
            <LineChartIcon className="w-8 h-8 text-primary" /> Market Intelligence
          </h1>
          <p className="text-muted-foreground">DeepBook on-chain analysis and AI-driven market predictions.</p>
        </div>
        
        {/* Token Selector */}
        <div className="flex bg-secondary p-1 rounded-xl border border-border shadow-sm">
          {tokens.map((token) => (
            <button
              key={token}
              onClick={() => setSelectedToken(token as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedToken === token 
                  ? 'bg-card text-foreground shadow-sm border border-border' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Price Chart */}
          <Card className="shadow-sm border-border bg-card">
            <CardHeader className="pb-4 border-b-0 flex flex-row items-center justify-between">
              <div>
                <div className="text-4xl font-extrabold text-foreground flex items-end gap-2">
                  {livePrice ? livePrice : (data?.price || "$0.00")}
                  <span className="text-xl font-bold ml-auto uppercase tracking-widest text-foreground mr-2">
                    {selectedToken}
                  </span>
                </div>
                <div className={`text-lg font-medium mt-1 ${data?.move?.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                  {data?.move || ""}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-0 relative">
              <div className="absolute top-2 left-6 text-muted-foreground font-medium text-lg z-10">${maxPrice}</div>
              <div className="absolute bottom-16 left-0 w-full text-center text-muted-foreground font-medium text-lg z-10">${minPrice}</div>
              
              <div className="h-[280px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value: any) => [`$${value}`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#0f172a" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-2 mt-4 px-6">
                {['1H', '1D', '1W', '1M', 'YTD', 'ALL'].map(range => (
                  <Button 
                    key={range}
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTimeRange(range)}
                    className={`font-bold rounded-full px-4 ${timeRange === range ? 'bg-[#6d28d9] text-white hover:bg-[#5b21b6] hover:text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Volatility Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-foreground">High</div>
                <div className="w-full h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-warning w-[75%] rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> DeepBook Liquidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-foreground">$12.4M</div>
                <div className="text-sm font-semibold text-success mt-1">+1.2M 24h</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: AI Analysis Column */}
        <div className="space-y-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#7C3AED]"></div>
            <CardHeader className="pb-4 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <BrainCircuit className="w-5 h-5 text-primary" /> AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 gap-4"
                  >
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Gemini analyzing on-chain activity...</p>
                  </motion.div>
                ) : !data || isError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                  >
                    <AlertTriangle className="w-8 h-8 text-destructive opacity-80" />
                    <p className="text-sm font-medium text-muted-foreground">Unable to fetch AI analysis at this time.<br/>Please try again later.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedToken}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                  {/* Current Trend */}
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Current Trend</div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border shadow-sm ${
                        data.trend === 'Bullish' ? 'bg-success/10 border-success/20 text-success' :
                        data.trend === 'Bearish' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                        'bg-secondary border-border text-foreground'
                      }`}>
                        {data.trend === 'Bullish' ? <TrendingUp className="w-6 h-6" /> :
                         data.trend === 'Bearish' ? <TrendingDown className="w-6 h-6" /> :
                         <Minus className="w-6 h-6" />}
                      </div>
                      <div className={`text-2xl font-extrabold ${
                        data.trend === 'Bullish' ? 'text-success' :
                        data.trend === 'Bearish' ? 'text-destructive' :
                        'text-foreground'
                      }`}>
                        {data.trend}
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Confidence</div>
                      <div className="text-xl font-extrabold text-primary">{data.confidence}%</div>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${data.confidence}%` }}></div>
                    </div>
                  </div>

                  {/* Expected Move */}
                  <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Expected Move (24H)</div>
                    <div className={`text-xl font-extrabold ${data?.move?.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {data.move}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-primary/10">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Recommended Action</div>
                    <Button 
                      className={`w-full h-12 font-bold shadow-sm flex items-center gap-2 ${
                        data.action === 'Protected Buy' ? 'bg-primary hover:bg-primary/90 text-white' :
                        data.action === 'Hold' ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border' :
                        'bg-warning text-warning-foreground hover:bg-warning/90'
                      }`}
                    >
                      {data.action === 'Protected Buy' ? <Shield className="w-4 h-4" /> : 
                       data.action === 'Wait' ? <AlertTriangle className="w-4 h-4" /> : null}
                      {data.action}
                      {data.action === 'Protected Buy' && <ArrowRight className="w-4 h-4 ml-auto" />}
                    </Button>
                    
                    {data?.explanation && (
                      <div className="mt-4 p-3 bg-card border border-primary/20 rounded-lg shadow-sm">
                        <div className="flex items-start gap-2">
                          <BrainCircuit className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className="font-bold text-foreground">AI Reasoning:</span> {data.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {apiData?.verification && (
                    <VerificationCard 
                      title="Market Intelligence Record" 
                      verification={apiData.verification} 
                    />
                  )}
                </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
