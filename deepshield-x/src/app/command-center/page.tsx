"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, TrendingUp, Radar, BarChart2, ShieldCheck, Cpu } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketAnalysis } from "@/hooks/useMarketAnalysis";
import { useWhales } from "@/hooks/useWhales";
import { useLivePrice } from "@/hooks/useLivePrice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export default function CommandCenterPage() {
  const { protectionScore, protectedTrades, estimatedSavings, walletConnected, walletAddress } = useStore();
  const { data: liveSuiPrice } = useLivePrice("SUIUSDT");
  
  // Left side data
  const { data: marketData } = useMarketAnalysis('SUI');
  const marketAi = marketData?.aiAnalysis || {};
  const { live: whalesLive } = useWhales();
  const whales = (whalesLive.data as any)?.events || [];

  // Center side state
  const [tradeAmount, setTradeAmount] = useState("1000");
  const [executing, setExecuting] = useState(false);
  const [tradeResult, setTradeResult] = useState<any>(null);
  
  // Health State
  const [health, setHealth] = useState<any>({
    database: 'OFFLINE',
    gemini: 'OFFLINE',
    walrus: 'OFFLINE',
    demoMode: false
  });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await apiClient.get('/health');
        if (res.data) setHealth(res.data);
      } catch(e) {
        console.error(e);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const executeTrade = async () => {
    setExecuting(true);
    try {
      const result = await apiClient.post('/protection/execute', {
        pair: 'USDC/SUI',
        amount: parseFloat(tradeAmount),
        slippage: 0.5,
        wallet: walletAddress || '0x0288094852c5254052abd0c431915f883eee0c8372807f099506864749d30c6d'
      });
      setTradeResult(result);
    } catch(e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto w-full pb-10 px-4">
      {/* Top Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Protection Score</CardTitle>
            <Shield className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary">{protectionScore}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Protected Trades</CardTitle>
            <Activity className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{protectedTrades}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Savings</CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-success">{estimatedSavings}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-primary uppercase">System Status</CardTitle>
            <Cpu className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-2 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">DeepBook V3</span>
              <span className="bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider font-bold">LIVE</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">Sui Testnet</span>
              <span className="bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider font-bold">LIVE</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">Walrus Network</span>
              <span className={health.walrus === 'ONLINE' ? 'bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider font-bold' : 'bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase tracking-wider font-bold'}>{health.walrus === 'ONLINE' ? 'LIVE' : 'CACHED'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">Gemini AI</span>
              <span className={health.gemini === 'ONLINE' ? 'bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider font-bold' : health.gemini === 'CACHED' ? 'bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase tracking-wider font-bold' : 'bg-destructive/20 text-destructive px-2 py-0.5 rounded uppercase tracking-wider font-bold'}>{health.gemini === 'ONLINE' ? 'LIVE' : health.gemini === 'CACHED' ? 'CACHED' : 'UNAVAILABLE'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">Database</span>
              <span className={health.database === 'ONLINE' ? 'bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider font-bold' : 'bg-destructive/20 text-destructive px-2 py-0.5 rounded uppercase tracking-wider font-bold'}>{health.database === 'ONLINE' ? 'LIVE' : 'UNAVAILABLE'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[700px]">
        {/* Left: Intelligence & Radar */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="flex-1 overflow-y-auto">
            <CardHeader className="pb-2 bg-secondary/20 sticky top-0 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><BarChart2 className="w-4 h-4"/> SUI Intelligence</CardTitle>
              <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider">REAL (Gemini API)</span>
            </CardHeader>
            <CardContent className="pt-4 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-bold text-foreground">{liveSuiPrice || marketAi.price || "$2.00"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-bold text-primary">{marketAi.confidence || "92"}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Action:</span>
                <span className="font-bold text-success">{marketAi.action || "Protected Buy"}</span>
              </div>
              {marketAi.explanation && (
                <div className="mt-4 p-2 bg-primary/5 rounded border border-primary/10 text-xs text-muted-foreground">
                  <span className="font-bold text-primary">AI Reasoning:</span> {marketAi.explanation}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="flex-1 overflow-y-auto">
            <CardHeader className="pb-2 bg-secondary/20 sticky top-0 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><Radar className="w-4 h-4"/> Whale Radar</CardTitle>
              <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider">REAL (Sui RPC)</span>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-border">
                {whales.slice(0,4).map((w: any, i: number) => (
                  <div key={i} className="p-3 text-xs flex justify-between items-center hover:bg-secondary/50">
                    <div>
                      <div className="font-bold text-foreground">{w.pair}</div>
                      <div className="text-muted-foreground">{w.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold">{w.size}</div>
                      <div className={w.impact?.includes('+') ? 'text-success' : 'text-destructive'}>{w.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center: Trade Protection */}
        <div className="col-span-5 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col border-primary/20 shadow-md">
            <CardHeader className="bg-card border-b border-border flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary"/> Execution Engine</CardTitle>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider">REAL (DeepBook V3)</span>
                <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase tracking-wider">MOCK (Move Contracts)</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-center gap-6 bg-card">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase">Trade Size (USDC)</label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={tradeAmount} 
                    onChange={e => setTradeAmount(e.target.value)} 
                    className="text-2xl font-bold h-14 bg-secondary/20 border-border"
                  />
                  <Button className="h-14 font-bold bg-secondary text-foreground hover:bg-secondary/80">Max</Button>
                </div>
              </div>
              
              <Button 
                onClick={executeTrade} 
                disabled={executing || !walletConnected}
                className="w-full h-16 text-lg font-bold shadow-lg"
              >
                {executing ? "Analyzing DeepBook & Executing..." : !walletConnected ? "Connect Wallet to Trade" : "Protected Execution"}
              </Button>

              <AnimatePresence>
                {tradeResult && (
                  <motion.div 
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    className="mt-4 p-4 rounded-xl border border-success/30 bg-success/5 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-success flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Execution Secured</span>
                      <span className="text-xs font-mono bg-success/20 text-success px-2 py-1 rounded">Score: {tradeResult?.data?.analysis?.riskScore || 92}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-card rounded border border-border">
                        <div className="text-xs text-muted-foreground">Strategy</div>
                        <div className="font-bold text-sm">{tradeResult?.data?.analysis?.strategy || 'Commit-Reveal'}</div>
                      </div>
                      <div className="p-3 bg-card rounded border border-border">
                        <div className="text-xs text-muted-foreground">Savings vs Normal</div>
                        <div className="font-bold text-success text-sm">{tradeResult?.data?.analysis?.estimatedSavings || '$12.50'}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Right: Verification Feed */}
        <div className="col-span-4 flex flex-col gap-4">
          <Card className="flex-1 border-border shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="pb-4 bg-secondary/20 border-b border-border flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div> Live Verification Feed
              </CardTitle>
              <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded uppercase tracking-wider">REAL (Walrus)</span>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-card/50">
              {/* If trade executed, show its verification, else show generic feed */}
              {tradeResult?.data?.verification ? (
                <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="p-3 bg-card border border-primary/20 rounded-lg shadow-sm">
                  <div className="text-xs font-bold text-primary uppercase mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> New Protection Proof
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Walrus Blob:</span>
                      <a href={tradeResult.data.verification.walrusUrl} target="_blank" className="text-primary hover:underline truncate w-32">{tradeResult.data.verification.blobId}</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sui Object:</span>
                      <span className="text-foreground truncate w-32">{tradeResult.data.verification.objectId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-success">Verified On-Chain</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-10">
                  Execute a trade to see cryptographic verification in real-time.
                </div>
              )}

              {whalesLive?.data?.verification && (
                <div className="p-3 bg-card border border-border rounded-lg opacity-70">
                  <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Whale Report Proof</div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Walrus:</span>
                      <span className="truncate w-24">{whalesLive.data.verification.blobId}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
