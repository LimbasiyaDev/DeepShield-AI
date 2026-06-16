"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, DollarSign, AlertTriangle, Radar, Trophy, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import { TransactionModal } from "@/components/shared/TransactionModal";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const walletBalance = (data as any)?.balance?.totalBalance ? ((data as any).balance.totalBalance / 1000000000).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Wallet Balance" value={`$${walletBalance}`} change="+12.4%" delay={0.1} trend="up" color="text-primary" />
        <MetricCard title="MEV Saved" value="$2.1M" change="+4.2%" delay={0.2} trend="up" color="text-success" />
        <MetricCard title="SUI Ecosystem Health" value="92/100" extra={<div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center"><Activity className="w-5 h-5 text-success" /></div>} delay={0.3} trend="up" color="text-success" label="Optimal Liquidity" />
        <MetricCard title="Active Threats" value="3" extra={<Shield className="w-8 h-8 text-warning/20 absolute right-6 top-6" />} delay={0.4} trend="down" color="text-warning" label="Mitigating..." icon={AlertTriangle} />
      </div>

      {/* Primary Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 shadow-sm border-border rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle className="text-lg font-bold">Protected Volume Trend</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-muted-foreground cursor-pointer hover:bg-secondary">1D</Badge>
              <Badge className="bg-primary hover:bg-primary/90 text-white cursor-pointer">1W</Badge>
              <Badge variant="outline" className="text-muted-foreground cursor-pointer hover:bg-secondary">1M</Badge>
            </div>
          </CardHeader>
          <CardContent className="pl-0 pb-4 pr-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(data as any)?.volumeData || []}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={true} horizontal={true} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-border rounded-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(data as any)?.riskDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {((data as any)?.riskDistribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'black' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {((data as any)?.riskDistribution || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Protected Trades Table */}
      <Card className="shadow-sm border-border rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-lg font-bold">Recent Protected Trades</CardTitle>
          <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trade ID</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pair</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Score</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protection Type</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Savings</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((data as any)?.recentTrades || []).map((trade: any, i: number) => (
                <TableRow 
                  key={i} 
                  onClick={() => setSelectedTrade(trade)}
                  className="border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <TableCell className="font-medium text-muted-foreground">{trade.id}</TableCell>
                  <TableCell className="font-semibold">{trade.pair}</TableCell>
                  <TableCell className="font-medium">{trade.value}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-bold border-none
                      ${trade.risk > 70 ? 'bg-destructive/10 text-destructive' : trade.risk > 30 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {trade.risk}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground font-medium">{trade.mode}</span>
                  </TableCell>
                  <TableCell className="text-success font-semibold">{trade.savings}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-success font-medium text-sm">
                      <ShieldCheck className="w-4 h-4" /> Success
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <TransactionModal 
        isOpen={!!selectedTrade} 
        onClose={() => setSelectedTrade(null)} 
        trade={selectedTrade} 
      />
    </div>
  );
}

function MetricCard({ title, value, change, delay, trend = "up", color = "text-primary", extra, label, icon: Icon }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="shadow-sm border-border rounded-xl h-full hover:shadow-md transition-shadow relative overflow-hidden bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-end relative z-10">
          <div>
            <div className="text-3xl font-extrabold text-foreground mb-2">{value}</div>
            {change && (
              <p className={`text-xs font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                {change} <span className="text-muted-foreground font-medium ml-1">vs last week</span>
              </p>
            )}
            {label && (
              <p className={`text-sm font-semibold flex items-center gap-1 mt-1 ${color}`}>
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </p>
            )}
          </div>
          {extra && (
            <div className="pb-2 pl-4">
              {extra}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
