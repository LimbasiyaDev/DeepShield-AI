"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Shield, CheckCircle2, AlertTriangle, Layers, Lock, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuardian } from "@/hooks/useGuardian";
import { useLivePrice } from "@/hooks/useLivePrice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  role: string;
  content: string;
  isInitial: boolean;
  analysis?: {
    riskAssessment: string;
    tradeImpact: string;
    expectedSlippage: string;
    suggestedStrategy: string;
    explainability: {
      riskReason: string;
      signals: string[];
      whaleImpact: string;
      liquidity: string;
    }
  };
};

export default function GuardianPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { mutate: askGuardian, isPending: isThinking } = useGuardian();
  const { data: liveSuiPrice } = useLivePrice("SUIUSDT");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your DeepShield Execution Guardian. Enter your intended trade or market question, and I will analyze the DeepBook environment to protect you.",
      isInitial: true
    }
  ]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage, isInitial: false }]);
    setInput("");

    const currentContext = {
      suiPrice: liveSuiPrice || "$1.24",
      deepBookLiquidity: "$15.4M",
      whaleActivity: "Moderate Accumulation",
      networkStatus: "Operational"
    };

    askGuardian({ question: userMessage, context: currentContext }, {
      onSuccess: (data: any) => {
        setMessages(prev => [
          ...prev, 
          { 
            role: "assistant", 
            content: data.answer || "Analysis complete.",
            isInitial: false,
            analysis: {
              riskAssessment: data.confidence < 50 ? "High Risk" : data.confidence < 80 ? "Medium Risk" : "Low Risk",
              tradeImpact: "Varies",
              expectedSlippage: "Varies",
              suggestedStrategy: data.recommendation || "Proceed with caution",
              explainability: {
                riskReason: "AI Sentiment Analysis",
                signals: ["On-chain activity", "DeepBook Liquidity"],
                whaleImpact: "Monitored",
                liquidity: "Checked"
              }
            }
          }
        ]);
      },
      onError: () => {
        setMessages(prev => [
          ...prev, 
          { 
            role: "assistant", 
            content: "Sorry, I am having trouble connecting to the DeepShield API right now. Please try again later.",
            isInitial: false
          }
        ]);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full h-[calc(100vh-6rem)] pb-6">
      
      {/* Left Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-card shadow-sm border border-border rounded-2xl overflow-hidden relative">
        <div className="h-16 border-b border-border flex items-center px-6 gap-3">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h2 className="font-bold text-foreground">Execution Assistant</h2>
          <Badge className="ml-auto bg-secondary text-muted-foreground border border-border px-3 py-1 font-semibold flex items-center gap-2 rounded-lg">
            <Lock className="w-3 h-3" /> Secured
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-secondary border-border' : 'bg-primary border-primary'}`}>
                  {msg.role === 'user' ? <div className="w-5 h-5 rounded-full bg-border" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                
                <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                  <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === 'user' ? 'bg-secondary border-border text-foreground rounded-tr-none' : 'bg-card border-border rounded-tl-none'}`}>
                    <p className="text-sm leading-relaxed text-foreground">{msg.content}</p>
                  </div>

                  {msg.role === 'assistant' && msg.analysis && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-full mt-2 space-y-3"
                    >
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Recommended Strategy</h4>
                      
                      {/* Strategy Option 1 */}
                      <Card className="bg-secondary/30 border-border hover:border-warning/50 transition-colors shadow-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-2 rounded bg-card border border-border">
                            <AlertTriangle className="w-5 h-5 text-warning" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-foreground">Wait 4 mins for liquidity</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">Predicted spread compression approaching.</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Strategy Option 2 */}
                      <Card className="bg-secondary/30 border-border hover:border-primary/50 transition-colors shadow-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-2 rounded bg-card border border-border">
                            <Layers className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-foreground">Split into 4 orders</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">2,500 SUI tranches to minimize slippage (Est. 0.04%).</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Strategy Option 3 */}
                      <Card className="bg-secondary/30 border-border hover:border-success/50 transition-colors shadow-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-2 rounded bg-card border border-border">
                            <Shield className="w-5 h-5 text-[#7C3AED]" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-foreground">Use Protected Execution</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">Route through DeepShield MEV blockers.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-3 pt-2">
                        <Button 
                          id={`exec-btn-${idx}`}
                          onClick={() => {
                            const btn = document.getElementById(`exec-btn-${idx}`);
                            if (btn) btn.innerHTML = '<span class="animate-pulse">Routing secure transaction...</span>';
                            setTimeout(() => router.push('/trade?mode=protected'), 800);
                          }}
                          className="bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-sm"
                        >
                          <PlayIcon className="w-4 h-4 mr-2" /> Execute Strategy
                        </Button>
                        <Button 
                          onClick={() => router.push('/trade')}
                          variant="outline" 
                          className="bg-card text-foreground font-bold shadow-sm"
                        >
                          Modify Parameters
                        </Button>
                      </div>

                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isThinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[80%]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary shadow-sm border border-primary">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border rounded-tl-none flex items-center gap-2 shadow-sm">
                  <div className="flex gap-1.5">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Guardian a question..." 
              className="h-14 pl-6 pr-16 bg-background border-border rounded-xl text-base shadow-sm focus-visible:ring-primary focus-visible:border-primary"
              disabled={isThinking}
            />
            <Button 
              type="submit" size="icon" disabled={!input.trim() || isThinking}
              className="absolute right-2 top-2 h-10 w-10 bg-transparent text-primary hover:bg-secondary rounded-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Insights Sidebar */}
      <div className="w-full lg:w-80 space-y-6 flex flex-col">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Confidence</h3>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-extrabold text-foreground">98</span>
              <span className="text-xl font-bold text-foreground mb-1">%</span>
            </div>
            <p className="text-xs text-muted-foreground">Optimal execution probability based on current orderbook depth.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Market Pressure</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-foreground mb-2">
                <span>Buy Volume</span>
                <span className="text-[#E04D1B]">62%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-[#E04D1B] rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-foreground mb-2">
                <span>Sell Volume</span>
                <span className="text-primary">38%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card flex-1">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Liquidity Depth (SUI)</h3>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-end pt-4 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-secondary text-muted-foreground text-[10px] rounded border border-border z-10">Spot</div>
            <div className="absolute top-4 bottom-0 left-1/2 w-px bg-foreground z-0"></div>
            
            <div className="flex items-end justify-between h-full gap-1 z-10 opacity-80">
              <div className="w-full bg-primary/20 h-1/4 rounded-t-sm"></div>
              <div className="w-full bg-primary/50 h-1/3 rounded-t-sm"></div>
              <div className="w-full bg-primary/70 h-2/3 rounded-t-sm mr-2"></div>
              
              <div className="w-full bg-[#E04D1B]/70 h-full rounded-t-sm ml-2"></div>
              <div className="w-full bg-[#E04D1B]/40 h-1/2 rounded-t-sm"></div>
              <div className="w-full bg-[#E04D1B]/20 h-1/6 rounded-t-sm"></div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function PlayIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    </svg>
  );
}

function Badge({ children, className }: any) {
  return <div className={`inline-flex items-center justify-center rounded-full text-xs font-medium ${className}`}>{children}</div>;
}
