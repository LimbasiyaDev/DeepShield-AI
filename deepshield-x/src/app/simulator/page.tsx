"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ShieldOff, Shield, Activity, Settings2, ArrowDown, ArrowUp, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { useSimulation } from "@/hooks/useSimulation";

export default function SimulatorPage() {
  const { mutate: runSimulation, isPending: isRunning } = useSimulation();
  const [hasRun, setHasRun] = useState(false);
  
  const [tradeSize, setTradeSize] = useState([50]);
  const [volatility, setVolatility] = useState([80]);
  const [density, setDensity] = useState([90]);
  const [apiResult, setApiResult] = useState<any>(null);

  // Formulas for demo calculations
  const lossAmount = ((tradeSize[0] * 2.74) * (volatility[0] / 100) * (density[0] / 100)).toFixed(2);
  const slippageAmount = (tradeSize[0] * 0.08).toFixed(2);
  const savedAmount = (parseFloat(lossAmount) - parseFloat(slippageAmount)).toFixed(2);

  const handleRunSimulation = () => {
    setHasRun(false);
    runSimulation({
      pair: "SUI",
      liquidity: density[0],
      volume: tradeSize[0],
      whalePresence: volatility[0]
    }, {
      onSuccess: (data) => {
        setHasRun(true);
        setApiResult(data);
      },
      onError: () => {
        setHasRun(true);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <div className="mb-2">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">MEV Threat Simulator</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Visualize the impact of predatory MEV strategies in real-time. Adjust market conditions below to see how DeepShield AI protects your transactions from sandwich attacks and front-running.
        </p>
      </div>

      {/* Simulator Inputs */}
      <Card className="shadow-sm border-border rounded-xl bg-card">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" /> Simulation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Trade Size (ETH)</Label>
              <span className="text-sm font-bold text-primary">{tradeSize[0].toFixed(1)}</span>
            </div>
            <Slider value={tradeSize} onValueChange={(val) => setTradeSize(val as number[])} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 ETH</span>
              <span>100 ETH</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Network Volatility</Label>
              <span className="text-sm font-bold text-primary">{volatility[0] > 70 ? 'High' : volatility[0] > 30 ? 'Medium' : 'Low'}</span>
            </div>
            <Slider value={volatility} onValueChange={(val) => setVolatility(val as number[])} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">MEV Bot Density</Label>
              <span className="text-sm font-bold text-destructive">{density[0] > 70 ? 'Aggressive' : density[0] > 30 ? 'Active' : 'Quiet'}</span>
            </div>
            <Slider value={density} onValueChange={(val) => setDensity(val as number[])} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Quiet</span>
              <span>Swarm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* VS Badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border items-center justify-center font-bold text-xs text-muted-foreground shadow-sm">
          VS
        </div>

        {/* Left Panel: Without DeepShield */}
        <Card className="shadow-sm border-border rounded-xl bg-red-50/30 overflow-hidden relative">
          <CardHeader className="pb-4 border-b border-border bg-card">
            <CardTitle className="text-xl text-foreground font-bold flex items-center gap-2">
              <ShieldOff className="w-5 h-5 text-destructive" /> Standard Execution
            </CardTitle>
            <p className="text-xs text-muted-foreground">Public Mempool Routing</p>
          </CardHeader>
          <CardContent className="pt-8 pb-12 flex flex-col items-center justify-center min-h-[300px] relative">
            
            <div className="absolute inset-0 flex justify-center">
              <div className="w-px h-full bg-destructive/20"></div>
            </div>

            <div className="z-10 flex flex-col items-center mb-8 bg-background p-4 rounded-xl border border-destructive/20 shadow-sm w-full max-w-[280px]">
              <span className="text-[10px] font-bold text-destructive tracking-widest uppercase mb-1">Value Lost</span>
              <span className="text-5xl font-extrabold text-destructive">-${lossAmount}</span>
            </div>

            <div className="w-full max-w-[320px] space-y-4 z-10">
              <div className="bg-destructive/20 border border-destructive/30 p-3 rounded-lg flex justify-between items-center text-sm text-destructive font-semibold">
                MEV Bot: Frontrun Buy <ArrowUp className="w-4 h-4" />
              </div>
              
              <div className="bg-card border border-border p-4 rounded-lg flex justify-between items-center text-sm shadow-sm">
                <span className="text-foreground">Your Transaction</span>
                <span className="text-muted-foreground text-xs">Pending...</span>
              </div>
              
              <div className="bg-destructive/20 border border-destructive/30 p-3 rounded-lg flex justify-between items-center text-sm text-destructive font-semibold">
                MEV Bot: Backrun Sell <ArrowDown className="w-4 h-4" />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Right Panel: With DeepShield */}
        <Card className="shadow-sm border-primary/20 rounded-xl bg-primary/5 overflow-hidden relative">
          <CardHeader className="pb-4 border-b border-primary/10 bg-primary/5">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-foreground font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> DeepShield Protected
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Private RPC Relay</p>
              </div>
              <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Active</div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-12 flex flex-col items-center justify-center min-h-[300px] relative">
            
            <div className="absolute inset-0 flex justify-center">
              <div className="w-px h-full bg-primary/20 border-l border-dashed border-primary/40"></div>
            </div>

            <div className="z-10 flex flex-col items-center mb-8">
              <span className="text-[10px] font-bold text-foreground tracking-widest uppercase mb-1">Standard Slippage</span>
              <span className="text-5xl font-extrabold text-foreground bg-white px-6 py-2 rounded-xl shadow-sm border border-border">-${slippageAmount}</span>
            </div>

            <div className="w-full max-w-[320px] z-10 mt-12">
              <div className="bg-white border border-primary/30 p-4 rounded-lg flex justify-between items-center text-sm shadow-sm relative">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">Your Transaction</span>
                </div>
                <span className="text-primary text-xs font-semibold">Executed</span>
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="text-xs font-semibold text-primary flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm border border-primary/20">
                  <Lock className="w-3 h-3" /> Bypassed Public Mempool
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      <div className="flex justify-center -my-2 relative z-20">
        <Button 
          size="lg" 
          onClick={handleRunSimulation} 
          disabled={isRunning}
          className="h-12 px-8 font-bold bg-foreground text-background hover:bg-foreground/90 shadow-md rounded-full"
        >
          {isRunning ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>

      {/* Result Card */}
      <AnimatePresence>
        {hasRun && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="bg-[#1E293B] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden text-white shadow-xl">
              {/* Subtle grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
              
              <div className="relative z-10">
                <div className="text-sm text-slate-400 mb-1">Simulation Result</div>
                <div className="text-4xl md:text-5xl font-extrabold text-white">Total Value Saved</div>
              </div>

              <div className="relative z-10 mt-6 md:mt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-extrabold text-white">${savedAmount.split('.')[0]}</span>
                  <span className="text-2xl text-slate-400 font-bold">.{savedAmount.split('.')[1]}</span>
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
