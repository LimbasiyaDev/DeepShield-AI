"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Wallet, Activity, Radar, Shield, CheckCircle, Database, Link as LinkIcon, Play } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const DEMO_STEPS = [
  { id: 1, title: "Connect Sui Wallet", icon: Wallet, desc: "Authenticate securely with Mysten dApp Kit and sign a verification message to establish a session." },
  { id: 2, title: "AI DeepBook Analysis", icon: Activity, desc: "Gemini analyzes SUI/USDC liquidity, spread, and depth on DeepBook to generate an execution plan." },
  { id: 3, title: "Whale Radar Scan", icon: Radar, desc: "Scan recent MEV activity and institutional moves. Identify large accumulation or dump risks." },
  { id: 4, title: "Protected Execution", icon: Shield, desc: "Route the trade through DeepShield private RPC to prevent front-running and slippage hunting." },
  { id: 5, title: "Walrus Verification", icon: Database, desc: "The entire AI report and execution logic is permanently stored as an immutable blob on Walrus." },
  { id: 6, title: "Sui Protection Proof", icon: LinkIcon, desc: "A programmable transaction block (PTB) records the Walrus Blob ID and protection metadata on-chain." },
  { id: 7, title: "Command Center", icon: CheckCircle, desc: "View the final savings and the cryptographically secure audit trail." },
];

export default function DemoGuidedFlowPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { setWalletModalOpen, walletConnected } = useStore();
  const router = useRouter();

  const handleNext = () => {
    if (currentStep === 1 && !walletConnected) {
      setWalletModalOpen(true);
      return;
    }
    
    if (currentStep < DEMO_STEPS.length) {
      setCurrentStep(curr => curr + 1);
    } else {
      router.push('/command-center');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-4xl mx-auto w-full pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">DeepShield AI Demo</h1>
        <p className="text-muted-foreground text-lg">Experience the full power of AI-driven DeepBook protection natively on Sui.</p>
      </div>

      <div className="w-full flex gap-8">
        {/* Progress Tracker */}
        <div className="w-1/3 flex flex-col gap-2">
          {DEMO_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                  isActive ? 'bg-primary/10 border-primary text-primary shadow-sm' : 
                  isCompleted ? 'bg-card border-border text-foreground opacity-70' : 
                  'bg-transparent border-transparent text-muted-foreground opacity-50'
                }`}
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-success text-white' : 'bg-secondary'}`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="font-bold text-sm">{step.title}</div>
              </div>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="w-2/3 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="h-full bg-card border-border shadow-xl overflow-hidden flex flex-col">
                <CardContent className="p-10 flex flex-col justify-center items-center h-full text-center gap-6">
                  {(() => {
                     const step = DEMO_STEPS[currentStep - 1];
                     const Icon = step.icon;
                     return (
                       <>
                         <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                           <Icon className="w-12 h-12 text-primary" />
                         </div>
                         <h2 className="text-3xl font-extrabold">{step.title}</h2>
                         <p className="text-lg text-muted-foreground leading-relaxed">{step.desc}</p>
                       </>
                     );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleNext} className="h-14 px-8 text-lg font-bold shadow-lg flex items-center gap-2">
              {currentStep === 1 && !walletConnected ? "Connect Wallet" :
               currentStep === DEMO_STEPS.length ? "Launch Command Center" : "Continue"}
              {currentStep < DEMO_STEPS.length ? <ChevronRight className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
