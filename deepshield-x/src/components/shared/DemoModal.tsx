"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [step, setStep] = useState(0);

  // Auto-advance simulation
  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    let timer: NodeJS.Timeout;
    if (step === 0) timer = setTimeout(() => setStep(1), 2000); // Trade Without Protection
    if (step === 1) timer = setTimeout(() => setStep(2), 2000); // MEV Front-runs
    if (step === 2) timer = setTimeout(() => setStep(3), 2000); // User Loses
    if (step === 3) timer = setTimeout(() => setStep(4), 3000); // VERSUS
    if (step === 4) timer = setTimeout(() => setStep(5), 2000); // Trade With DeepShield
    if (step === 5) timer = setTimeout(() => setStep(6), 2000); // Protected Execution
    if (step === 6) timer = setTimeout(() => setStep(7), 2000); // User Loses $4
    // Step 7 is the final state

    return () => clearTimeout(timer);
  }, [step, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-muted-foreground hover:bg-secondary p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
            
            <AnimatePresence mode="wait">
              {/* STAGE 1: WITHOUT PROTECTION */}
              {step < 3 && (
                <motion.div
                  key="unprotected"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="space-y-6 w-full max-w-sm"
                >
                  <div className="text-xs font-extrabold text-destructive tracking-widest uppercase mb-8">Scenario 1: Standard Trade</div>
                  
                  <div className="bg-secondary/50 border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <span className="font-bold text-foreground">User Trade (10 SUI)</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-muted-foreground">Mempool</span>
                  </div>

                  {step >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center justify-between text-destructive"
                    >
                      <ShieldAlert className="w-5 h-5" />
                      <span className="font-bold">MEV Bot Front-runs Order</span>
                    </motion.div>
                  )}

                  {step >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-6"
                    >
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Value Extracted</div>
                      <div className="text-5xl font-extrabold text-destructive">-$137.00</div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STAGE 2: VERSUS TRANSITION */}
              {step === 3 && (
                <motion.div
                  key="versus"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="flex items-center justify-center text-4xl font-extrabold text-foreground tracking-widest"
                >
                  VERSUS
                </motion.div>
              )}

              {/* STAGE 3: WITH DEEPSHIELD */}
              {step >= 4 && (
                <motion.div
                  key="protected"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 w-full max-w-sm"
                >
                  <div className="text-xs font-extrabold text-primary tracking-widest uppercase mb-8 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> Scenario 2: DeepShield AI
                  </div>
                  
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <span className="font-bold text-foreground">User Trade (10 SUI)</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">Private RPC</span>
                  </div>

                  {step >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-success/10 border border-success/20 p-4 rounded-xl flex items-center justify-between text-success"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">Execution Protected</span>
                    </motion.div>
                  )}

                  {step >= 6 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-6"
                    >
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Standard Slippage</div>
                      <div className="text-5xl font-extrabold text-foreground mb-6">-$4.00</div>
                      
                      {step >= 7 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-success text-white p-4 rounded-xl flex items-center justify-center gap-3 shadow-md"
                        >
                          <TrendingUp className="w-6 h-6" />
                          <span className="text-xl font-bold">Saved $133.00</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
          
          {step === 7 && (
             <div className="p-4 bg-secondary/50 border-t border-border flex justify-center">
               <Button onClick={onClose} className="w-full max-w-sm font-bold shadow-sm">Start Protecting Trades</Button>
             </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
