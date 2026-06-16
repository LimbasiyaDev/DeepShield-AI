"use client";

import { useEffect, useState, useMemo } from "react";

import { motion } from "framer-motion";
import { Shield, ShieldAlert, Wallet, PieChart, TrendingUp, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { usePortfolio } from "@/hooks/usePortfolio";
import { VerificationCard } from "@/components/verification/VerificationCard";

export default function PortfolioPage() {
  const { walletConnected, portfolioValue, walletAddress, setWalletModalOpen } = useStore();
  const { mutate, data: apiData, isPending: isLoading } = usePortfolio();
  const [isAutoSplitEnabled, setIsAutoSplitEnabled] = useState(false);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      mutate({ address: walletAddress });
    }
  }, [walletConnected, walletAddress, mutate]);

  const assets = (apiData as any)?.data?.assets || [];

  const actualTotalValue = useMemo(() => {
    if (assets.length === 0) return portfolioValue; // Fallback
    let sum = 0;
    assets.forEach((asset: any) => {
      const valStr = asset.value.replace(/[^0-9.-]+/g,"");
      sum += parseFloat(valStr) || 0;
    });
    return `$${sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [assets, portfolioValue]);

  const { protectedValue, vulnerableValue, highlyExposedCount } = useMemo(() => {
    let p = 0;
    let v = 0;
    let count = 0;
    assets.forEach((asset: any) => {
      const valStr = asset.value.replace(/[^0-9.-]+/g,"");
      const num = parseFloat(valStr) || 0;
      if (asset.risk === 'High') {
        v += num;
        count++;
      } else {
        p += num;
      }
    });
    return {
      protectedValue: `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      vulnerableValue: `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      highlyExposedCount: count
    };
  }, [assets]);

  if (!walletConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center gap-6">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border border-border shadow-sm">
          <Wallet className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">To view your portfolio protection status and AI risk analysis, please connect your wallet.</p>
        </div>
        <Button onClick={() => setWalletModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 shadow-sm">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2 mb-1">
            <Shield className="w-8 h-8 text-[#7C3AED]" /> Portfolio Protection
          </h1>
          <p className="text-muted-foreground">Continuous AI monitoring of your assets on DeepBook.</p>
        </div>
        <div className="flex items-center gap-4 bg-secondary p-3 rounded-xl border border-border shadow-sm">
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Value</div>
            <div className="text-lg font-extrabold text-foreground">{actualTotalValue}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Overall Security</div>
              <ShieldAlert className="w-5 h-5 text-warning" />
            </div>
            <div className="text-3xl font-extrabold text-warning">{highlyExposedCount > 0 ? "Medium Risk" : "Low Risk"}</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">{highlyExposedCount} asset{highlyExposedCount !== 1 ? 's' : ''} highly exposed to MEV.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protected Value</div>
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-extrabold text-foreground">{protectedValue}</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">Safely routed portfolio assets.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Vulnerable Value</div>
              <AlertOctagon className="w-5 h-5 text-destructive" />
            </div>
            <div className="text-3xl font-extrabold text-destructive">{vulnerableValue}</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">Assets at risk of sandwich attacks.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Asset Table */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border bg-card h-full">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg font-bold text-foreground">Asset Exposure</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Asset</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Balance</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Value</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Exposure</TableHead>
                    <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-widest">Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <Wallet className="h-8 w-8 text-muted-foreground/50 mb-2" />
                          <p className="font-semibold">No Assets Found</p>
                          <p className="text-xs">Your portfolio currently has no tracked assets.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map((asset: any, i: number) => (
                      <TableRow key={i} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-bold text-foreground">{asset.symbol}</TableCell>
                        <TableCell className="font-medium text-muted-foreground">{asset.balance}</TableCell>
                        <TableCell className="font-bold text-foreground">{asset.value}</TableCell>
                        <TableCell className="font-medium">{asset.exposure}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`font-bold border-none ${
                            asset.risk === 'High' ? 'bg-destructive/10 text-destructive' :
                            asset.risk === 'Medium' ? 'bg-warning/10 text-warning' :
                            'bg-success/10 text-success'
                          }`}>
                            {asset.risk} Risk
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right: AI Portfolio Analysis */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-[#7C3AED]/20 bg-[#7C3AED]/5 h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] to-primary"></div>
            <CardHeader className="pb-4 border-b border-[#7C3AED]/10">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <PieChart className="w-5 h-5 text-[#7C3AED]" /> AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Most Vulnerable Asset</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-destructive/20 shadow-sm">
                  <span className="font-extrabold text-foreground">{highlyExposedCount > 0 ? assets.find((a: any) => a.risk === 'High')?.symbol : 'None'}</span>
                  <span className="text-sm font-bold text-destructive flex items-center gap-1">
                    <AlertOctagon className="w-4 h-4" /> High Exposure
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground mt-2 leading-relaxed">
                  Low liquidity depth makes this position highly susceptible to slippage hunting bots.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Best Protected Asset</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-success/20 shadow-sm">
                  <span className="font-extrabold text-foreground">{assets.find((a: any) => a.risk !== 'High')?.symbol || 'SUI'}</span>
                  <span className="text-sm font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Secure
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#7C3AED]/10">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Recommended Action</div>
                <Button 
                  onClick={() => setIsAutoSplitEnabled(true)}
                  disabled={isAutoSplitEnabled}
                  className={`w-full h-12 font-bold shadow-sm transition-all ${isAutoSplitEnabled ? 'bg-success hover:bg-success/90 text-white' : 'bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white'}`}
                >
                  {isAutoSplitEnabled ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Auto-Split Enabled</>
                  ) : (
                    "Enable Auto-Split for CETUS"
                  )}
                </Button>
                <p className="text-xs font-medium text-muted-foreground mt-3 text-center">
                  Automatically split large CETUS trades into smaller tranches to avoid MEV detection.
                </p>
              </div>

              {(apiData as any)?.verification && (
                <VerificationCard 
                  title="Portfolio Analysis Record" 
                  verification={(apiData as any).verification} 
                />
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
