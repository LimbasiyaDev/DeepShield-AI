"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, Search, Lock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
}

export function TradeReplayModal({ isOpen, onClose, trade }: TradeReplayModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    let timer: NodeJS.Timeout;
    if (step === 0) timer = setTimeout(() => setStep(1), 1500); // User Trade
    if (step === 1) timer = setTimeout(() => setStep(2), 1500); // Bot Detection
    if (step === 2) timer = setTimeout(() => setStep(3), 1500); // Threat Analysis
    if (step === 3) timer = setTimeout(() => setStep(4), 2000); // DeepShield Activated
    if (step === 4) timer = setTimeout(() => setStep(5), 1500); // Threat Blocked
    if (step === 5) timer = setTimeout(() => setStep(6), 1500); // Trade Executed
    // Step 6 is final

    return () => clearTimeout(timer);
  }, [step, isOpen]);

  if (!isOpen || !trade) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden relative"
        >
          <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Event Reconstruction
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:bg-secondary p-1 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-full max-w-md space-y-4">
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-foreground text-lg">{trade.pair}</span>
                <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">{trade.timestamp}</span>
              </div>

              {/* Step 0: User Trade */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-secondary border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold">You</span>
                </div>
                <div>
                  <div className="font-bold">Initiated Trade</div>
                  <div className="text-xs text-muted-foreground">Sent to Mempool</div>
                </div>
              </motion.div>

              {/* Step 1: Bot Detection */}
              {step >= 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-4 text-destructive shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold">MEV Bot Detected Order</div>
                    <div className="text-xs">Identified high slippage tolerance</div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Threat Analysis */}
              {step >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-warning/10 border border-warning/20 p-4 rounded-xl flex items-center gap-4 text-warning shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold">AI Threat Analysis</div>
                    <div className="text-xs">Risk Score: {trade.originalRisk} | Predicted Loss: {trade.predictedLoss}</div>
                  </div>
                </motion.div>
              )}

              {/* Step 3 & 4: DeepShield Activated & Blocked */}
              {step >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center gap-4 text-primary shadow-sm relative overflow-hidden"
                >
                  {step === 3 && <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>}
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center z-10">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold">{step >= 4 ? "Threat Blocked" : "DeepShield Routing..."}</div>
                    <div className="text-xs">{step >= 4 ? `Strategy Applied: ${trade.aiRecommendation}` : "Bypassing public mempool"}</div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Executed */}
              {step >= 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-success text-white p-4 rounded-xl flex items-center justify-between shadow-md mt-6"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6" />
                    <div>
                      <div className="font-bold text-lg">Protected Execution</div>
                      <div className="text-xs font-medium text-success-foreground">Saved {trade.moneySaved} from MEV</div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function History(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
