"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Shield, TrendingDown, Target, Star, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ScorePage() {
  const { data: apiData } = useDashboard();
  const leaderboardData = (apiData as any)?.leaderboardData || [];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#7C3AED]" />
            Trader Protection Score
          </h1>
          <p className="text-muted-foreground text-sm">Your overall security rating and leaderboard ranking on the DeepShield network.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Personal Score Card (Hero) */}
        <div className="md:col-span-5">
          <Card className="shadow-sm border-border bg-card relative overflow-hidden h-full flex flex-col items-center justify-center text-center p-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 to-transparent"></div>
            
            <div className="relative mb-6">
              <svg className="w-48 h-48" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--secondary)" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * 94.5) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-5xl font-extrabold text-[#7C3AED]">945</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Global Score</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Elite Defender</h3>
            <p className="text-sm font-medium text-muted-foreground max-w-[250px]">Your wallet ranks in the top 5% of protected traders on DeepBook.</p>
            
            <Badge variant="outline" className="mt-6 border-[#7C3AED]/30 text-[#7C3AED] bg-[#7C3AED]/10 px-4 py-1.5 font-bold text-xs uppercase tracking-widest">
              Rank #4
            </Badge>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          <StatCard title="MEV Loss Prevented" value="$45,200" icon={Shield} color="text-success" />
          <StatCard title="Protected Trades" value="312" icon={Target} color="text-primary" />
          <StatCard title="Risk Reduction" value="85%" icon={TrendingDown} color="text-success" />
          <StatCard title="Streak" value="45 Days" icon={Star} color="text-warning" />
        </div>
      </div>

      <Card className="shadow-sm border-border bg-card mt-4">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Medal className="w-5 h-5 text-warning" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-16 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Rank</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Wallet</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-widest">Protection Score</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-widest">Loss Prevented</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-widest">Protected Trades</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-widest">Risk Reduction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user: any, i: number) => (
                <TableRow 
                  key={i} 
                  className={`border-border transition-colors ${user.rank === 4 ? 'bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10 border-[#7C3AED]/20' : 'hover:bg-secondary/50'}`}
                >
                  <TableCell className="font-semibold">
                    {user.rank === 1 ? <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center"><Crown className="w-4 h-4 text-warning" /></div> : 
                     user.rank === 2 ? <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><span className="text-slate-500 font-bold">#2</span></div> :
                     user.rank === 3 ? <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><span className="text-amber-700 font-bold">#3</span></div> : 
                     <span className="text-muted-foreground font-bold ml-2">#{user.rank}</span>}
                  </TableCell>
                  <TableCell className={`font-mono font-medium ${user.rank === 4 ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                    {user.wallet}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-extrabold text-lg ${user.rank === 4 ? 'text-[#7C3AED]' : 'text-foreground'}`}>{user.score}</span>
                  </TableCell>
                  <TableCell className="text-right text-success font-bold">{user.saved}</TableCell>
                  <TableCell className="text-right text-foreground font-medium">{user.trades}</TableCell>
                  <TableCell className="text-right text-muted-foreground font-medium">{user.reduction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="shadow-sm border-border bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</div>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className={`text-4xl font-extrabold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
