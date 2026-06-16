"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Lock, Activity, ScanSearch, Radar, History, Zap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { DemoModal } from "@/components/shared/DemoModal";

const features = [
  { title: "AI Trade Guardian", desc: "Autonomous algorithmic oversight that intercepts and restructures vulnerable transactions before they hit the public mempool.", icon: Shield },
  { title: "Protected Orders", desc: "Encrypted routing paths that obscure intent from front-runners.", icon: Lock },
  { title: "MEV Risk Scanner", desc: "Real-time analysis of block builder behavior and mempool threats.", icon: ScanSearch },
  { title: "Whale Radar", desc: "Detect large institutional shifts before they impact your slippage tolerance.", icon: Radar },
  { title: "Protection Replay", desc: "Review prevented attacks step-by-step.", icon: History },
  { title: "Execution Optimizer", desc: "Splits and schedules large orders optimally across DeepBook liquidity pools.", icon: Zap },
  { title: "Risk Intelligence", desc: "Global threat scoring and network health metrics.", icon: BarChart },
  { title: "Trade Simulator", desc: "Test strategies safely against historical MEV attack vectors.", icon: Activity },
];

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Subtle background gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-secondary border border-border text-primary text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Institutional Grade Protection
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Trade Smarter.<br />
              <span className="text-primary">Trade Safer.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Protect every trade with AI-powered execution intelligence and MEV defense on DeepBook. Ensure absolute confidence in high-density environments.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-base font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                  Launch App <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button onClick={() => setIsDemoOpen(true)} size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-border hover:bg-secondary shadow-sm text-foreground">
                <Play className="mr-2 w-4 h-4" /> Watch Demo
              </Button>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Trusted by Institutions</span>
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 w-16 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 w-16 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual (Architecture Flow) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative h-[500px]">
            {/* Visual Container */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-border p-8 flex flex-col items-center justify-between">
              <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-4">Execution Flow</div>
              
              {/* Node 1: Trader */}
              <div className="flex flex-col items-center z-10">
                <div className="w-16 h-16 rounded-full bg-background border border-border shadow-sm flex items-center justify-center">
                  <User className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-medium mt-2">Trader</span>
              </div>

              {/* Connecting Line */}
              <div className="w-px h-16 bg-gradient-to-b from-border to-primary"></div>
              <div className="w-2 h-2 rounded-full bg-primary -mt-2 z-10"></div>

              {/* Node 2: AI Guardian */}
              <div className="flex flex-col items-center z-10">
                <div className="w-20 h-24 rounded-2xl bg-primary shadow-lg flex flex-col items-center justify-center gap-2 relative">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold text-primary mt-2">AI Guardian</span>
              </div>

              {/* Connecting Line */}
              <div className="w-2 h-2 rounded-full bg-primary -mb-2 z-10"></div>
              <div className="w-px h-16 bg-gradient-to-b from-primary to-success"></div>

              {/* Node 3: DeepBook */}
              <div className="w-full bg-background border border-border rounded-xl p-4 shadow-sm flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-foreground">Protected Execution</span>
                </div>
                <span className="text-xs font-bold text-[#7C3AED]">DeepBook</span>
              </div>
            </div>

            {/* Floating Metrics */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -left-12 top-12 bg-white rounded-xl shadow-lg border border-border p-4 w-48 z-20">
              <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                <Shield className="w-3 h-3 text-primary" /> Protected Volume
              </div>
              <div className="text-2xl font-bold text-foreground">$12.4M</div>
            </motion.div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute -right-8 top-32 bg-white rounded-xl shadow-lg border border-border p-4 w-48 z-20">
              <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                <Activity className="w-3 h-3 text-success" /> Saved from MEV
              </div>
              <div className="text-2xl font-bold text-success">$184K</div>
            </motion.div>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute -left-4 bottom-32 bg-white rounded-xl shadow-lg border border-border p-4 w-48 z-20">
              <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                <Shield className="w-3 h-3 text-warning" /> Trades Protected
              </div>
              <div className="text-2xl font-bold text-foreground">43,291</div>
            </motion.div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 5.5 }} className="absolute -right-6 bottom-12 bg-white rounded-xl shadow-lg border border-border p-4 w-48 z-20">
              <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                <Lock className="w-3 h-3 text-destructive" /> Threats Prevented
              </div>
              <div className="text-2xl font-bold text-foreground">1,204</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Trading Defense</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">High-density intelligence modules working in concert to secure your executions across the decentralized ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className="border-border shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-background py-8 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs font-semibold text-muted-foreground">
          <span>DeepShield AI</span>
          <span>© 2024 DeepShield AI. Institutional Grade Protection.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Security</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">API</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </div>
        </div>
      </footer>
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}

// Minimal icon stand-in
function User({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
