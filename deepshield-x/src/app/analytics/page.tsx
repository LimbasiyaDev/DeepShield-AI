"use client";

import { motion } from "framer-motion";
import { BarChart as BarChartIcon, TrendingUp, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const attackData = [
  { name: "Mon", attacks: 120 },
  { name: "Tue", attacks: 180 },
  { name: "Wed", attacks: 250 },
  { name: "Thu", attacks: 190 },
  { name: "Fri", attacks: 290 },
  { name: "Sat", attacks: 350 },
  { name: "Sun", attacks: 280 },
];

export default function AnalyticsPage() {
  const { data: apiData } = useDashboard();
  const volumeData = (apiData as any)?.volumeData || [];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <BarChartIcon className="w-8 h-8 text-primary" /> Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MEV Attacks Prevented */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive" /> MEV Attacks Prevented
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              {attackData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-semibold text-sm">No Attack Data</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attackData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                      cursor={{ fill: 'var(--secondary)' }}
                    />
                    <Bar dataKey="attacks" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historical Savings */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" /> Historical Savings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              {volumeData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-semibold text-sm">No Analytics Yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="var(--success)" strokeWidth={3} dot={{ r: 4, fill: "var(--success)" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Top Protected Pairs Table */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-lg font-bold text-foreground">Top Protected Pairs</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pair</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Protected Volume</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Savings</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Avg Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volumeData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <BarChartIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="font-semibold">No Protected Pairs Yet</p>
                      <p className="text-xs">Start executing protected trades to see analytics.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  <TableRow className="border-border hover:bg-secondary/50">
                    <TableCell className="font-bold text-foreground">SUI/USDC</TableCell>
                    <TableCell className="font-medium">$45.2M</TableCell>
                    <TableCell className="font-bold text-success">$1.2M</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-warning font-semibold">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-warning w-[65%]"></div>
                        </div>
                        65
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border hover:bg-secondary/50">
                    <TableCell className="font-bold text-foreground">WETH/USDC</TableCell>
                    <TableCell className="font-medium">$28.4M</TableCell>
                    <TableCell className="font-bold text-success">$840k</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-destructive font-semibold">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-destructive w-[82%]"></div>
                        </div>
                        82
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border hover:bg-secondary/50">
                    <TableCell className="font-bold text-foreground">CETUS/SUI</TableCell>
                    <TableCell className="font-medium">$12.1M</TableCell>
                    <TableCell className="font-bold text-success">$310k</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-success font-semibold">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-success w-[24%]"></div>
                        </div>
                        24
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border hover:bg-secondary/50">
                    <TableCell className="font-bold text-foreground">NAVX/SUI</TableCell>
                    <TableCell className="font-medium">$8.5M</TableCell>
                    <TableCell className="font-bold text-success">$180k</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-warning font-semibold">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-warning w-[45%]"></div>
                        </div>
                        45
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
