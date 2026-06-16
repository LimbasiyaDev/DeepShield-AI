"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Shield, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
}

export function TransactionModal({ isOpen, onClose, trade }: TransactionModalProps) {
  if (!isOpen || !trade) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden relative"
        >
          <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" /> DeepBook Execution Details
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:bg-secondary p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Header Stats */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border shadow-sm">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Pair</div>
                <div className="text-xl font-extrabold text-foreground">{trade.pair}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                <div className="text-sm font-bold text-success flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Protected
                </div>
              </div>
            </div>

            {/* Transaction Data */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Transaction Hash</span>
                <span className="text-sm font-mono font-bold text-primary flex items-center gap-1 cursor-pointer hover:underline">
                  {trade.id} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Execution Time</span>
                <span className="text-sm font-bold text-foreground">{trade.timestamp || "Just now"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Original Risk Score</span>
                <span className="text-sm font-bold text-warning">{trade.originalRisk || trade.risk}/100</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Protection Method</span>
                <span className="text-sm font-bold text-foreground bg-secondary px-2 py-0.5 rounded">{trade.actualExecution || trade.mode}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-bold text-foreground uppercase tracking-widest">Savings Generated</span>
                <span className="text-lg font-extrabold text-success">{trade.moneySaved || trade.savings}</span>
              </div>
            </div>

          </div>
          
          <div className="p-4 bg-secondary/30 border-t border-border flex justify-between items-center gap-4">
             <Button variant="outline" className="w-full font-bold shadow-sm" onClick={onClose}>Close</Button>
             <Button className="w-full font-bold bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center gap-2">
               <Activity className="w-4 h-4" /> View in Sui Explorer
             </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
