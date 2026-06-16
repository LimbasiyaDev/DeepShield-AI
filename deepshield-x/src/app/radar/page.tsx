"use client";

import { motion } from "framer-motion";
import { Radar, AlertTriangle, ArrowUpRight, ArrowDownRight, Droplet, Skull } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useWhales } from "@/hooks/useWhales";
import { VerificationCard } from "@/components/verification/VerificationCard";

export default function RadarPage() {
  const { live } = useWhales();
  const isLoading = live.isLoading;
  const data = (live.data as any)?.events || live.data || [];
  const verification = (live.data as any)?.verification;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2 mb-1">
            <Radar className="w-8 h-8 text-primary" /> Whale Radar
          </h1>
          <p className="text-muted-foreground">Monitor large institutional shifts and market manipulation risks.</p>
        </div>
        <div className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 rounded-full text-xs font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Live
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex justify-between items-center">
              Large Buy Orders <ArrowUpRight className="w-4 h-4 text-success" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">12</div>
            <p className="text-xs font-semibold mt-1 text-success bg-success/10 inline-block px-2 py-0.5 rounded">Potential Price Spike</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex justify-between items-center">
              Large Sell Orders <ArrowDownRight className="w-4 h-4 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">5</div>
            <p className="text-xs font-semibold mt-1 text-destructive bg-destructive/10 inline-block px-2 py-0.5 rounded">Potential Dump Risk</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex justify-between items-center">
              Liquidity Shifts <Droplet className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">8</div>
            <p className="text-xs font-semibold mt-1 text-primary bg-primary/10 inline-block px-2 py-0.5 rounded">Pool Imbalances Detected</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-warning/30 bg-warning/5 hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-warning uppercase tracking-widest flex justify-between items-center">
              Manipulation Risk <Skull className="w-4 h-4 text-warning" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-warning">Critical</div>
            <p className="text-xs font-semibold mt-1 text-muted-foreground">High MEV Activity on SUI/USDC</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border bg-card mt-4">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <CardTitle className="text-lg font-bold text-foreground">Recent Whale Activity</CardTitle>
          <AlertTriangle className="w-5 h-5 text-warning" />
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Type</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pair</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Size</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Market Impact</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Time</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Risk Level</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Action Detected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Radar className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="font-semibold">No Whale Activity Detected Yet</p>
                      <p className="text-xs">Waiting for large institutional orders...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((event: any, i: number) => (
                  <TableRow key={i} className="border-border hover:bg-secondary/50 transition-colors">
                    <TableCell className="font-semibold">
                      <span className={`px-2 py-1 rounded text-xs ${
                        event?.type?.includes('Buy') ? 'bg-success/10 text-success' : 
                        event?.type?.includes('Sell') ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {event?.type || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">{event?.pair}</TableCell>
                    <TableCell className="font-mono font-medium">{event?.size}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${event?.impact?.includes('+') ? 'text-success' : event?.impact?.includes('-') ? 'text-destructive' : 'text-warning'}`}>
                        {event?.impact || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">{event.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-bold border-none
                        ${event.risk === 'Critical' ? 'text-destructive bg-destructive/10' : 
                          event.risk === 'High' ? 'text-warning bg-warning/10' : 'text-primary bg-primary/10'}
                      `}>
                        {event.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-bold">{event.action}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {verification && (
        <div className="mt-2">
          <VerificationCard 
            title="Whale Activity Report" 
            verification={verification} 
          />
        </div>
      )}
    </div>
  );
}
