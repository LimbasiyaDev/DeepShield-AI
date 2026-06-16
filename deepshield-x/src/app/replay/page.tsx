"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Shield, ArrowRight, CheckCircle2, TrendingUp, AlertOctagon, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { TradeReplayModal } from "@/components/shared/TradeReplayModal";

import { useReplay } from "@/hooks/useReplay";

export default function ReplayPage() {
  const [selectedReplay, setSelectedReplay] = useState<any>(null);
  const { history } = useReplay();
  const { data: apiData, isLoading } = history;
  const replays = (apiData as any)?.data || [];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Protection Replay
          </h1>
          <p className="text-muted-foreground text-sm">Review your past trades and see exactly how DeepShield protected your value.</p>
        </div>
      </div>

      <div className="relative border-l-2 border-border ml-4 md:ml-8 pl-8 space-y-12">
        {replays.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-secondary/20 rounded-xl border border-dashed border-border ml-[-32px]">
            <History className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-bold text-foreground">No Replays Available</h3>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
              Execute a trade through the Command Center to generate an interactive replay of DeepShield's protection in action.
            </p>
          </div>
        ) : (
          replays.map((trade: any, index: number) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[42px] top-4 w-5 h-5 rounded-full border-4 border-background bg-primary shadow-sm"></div>
              
              <div className="text-sm text-muted-foreground mb-3 font-bold uppercase tracking-widest">{trade.timestamp}</div>

              <Card 
                onClick={() => setSelectedReplay(trade)}
                className="shadow-sm border-border bg-card overflow-hidden relative group cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary text-white rounded-full p-2 shadow-sm">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <CardHeader className="pb-3 border-b border-border bg-secondary/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg font-bold">{trade.pair}</CardTitle>
                      <Badge variant="outline" className="bg-background text-muted-foreground font-mono font-medium">{trade.id}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-success/10 px-3 py-1 rounded-full border border-success/20">
                      <Shield className="w-4 h-4 text-success" />
                      <span className="text-success font-bold">Protected Successfully</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    
                    {/* Without Protection (Simulated) */}
                    <div className="md:col-span-2 space-y-3 p-5 rounded-xl bg-destructive/5 border border-destructive/10 relative">
                      <div className="absolute top-3 right-3">
                        <AlertOctagon className="w-5 h-5 text-destructive/50" />
                      </div>
                      <div className="text-xs font-extrabold text-destructive uppercase tracking-widest mb-2">Original Threat</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">Original Risk Score</span>
                        <span className="text-sm font-extrabold text-destructive">{trade.originalRisk}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">Predicted MEV Loss</span>
                        <span className="text-sm font-extrabold text-destructive">{trade.predictedLoss}</span>
                      </div>
                    </div>

                    {/* Arrow connector */}
                    <div className="hidden md:flex justify-center items-center">
                      <div className="p-2 rounded-full bg-secondary border border-border shadow-sm">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    {/* With Protection (Actual) */}
                    <div className="md:col-span-2 space-y-3 p-5 rounded-xl bg-success/5 border border-success/10 relative">
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5 text-success/50" />
                      </div>
                      <div className="text-xs font-extrabold text-success uppercase tracking-widest mb-2">DeepShield Action</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">Execution Mode</span>
                        <span className="text-sm font-bold text-primary">{trade.actualExecution}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">Value Saved</span>
                        <span className="text-sm font-extrabold text-success flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> {trade.moneySaved}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="mt-6 pt-5 border-t border-border flex items-start gap-4">
                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest flex-shrink-0">
                      AI Insight
                    </div>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      DeepShield correctly recommended <strong className="text-foreground">{trade.aiRecommendation}</strong> to mitigate the identified <strong className="text-foreground">{trade.originalRisk > 80 ? 'critical' : 'high'}</strong> risk prior to execution.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
      
      <TradeReplayModal 
        isOpen={!!selectedReplay} 
        onClose={() => setSelectedReplay(null)} 
        trade={selectedReplay} 
      />
    </div>
  );
}
