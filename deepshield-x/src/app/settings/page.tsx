"use client";

import { Wallet, Shield, Bot, Bell, Lock, Settings, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Account Settings</h1>
      </div>

      <div className="grid gap-6">
        
        {/* Wallet Settings */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet Settings
            </CardTitle>
            <CardDescription className="text-sm">Manage your connected wallets and RPC endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-border flex items-center justify-center">
                  <span className="font-extrabold text-primary text-sm">SUI</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Sui Wallet</div>
                  <div className="text-sm text-muted-foreground font-mono font-medium mt-0.5">0x1a...b9f</div>
                </div>
              </div>
              <Button variant="outline" className="border-border text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold shadow-sm">Disconnect</Button>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Custom RPC Endpoint</Label>
              <div className="flex gap-3">
                <Input defaultValue="https://mainnet.sui.rpc.deepshield.network" className="bg-secondary/30 border-border h-12 shadow-sm font-medium" />
                <Button className="h-12 px-6 font-bold bg-foreground text-background shadow-sm hover:bg-foreground/90">Update</Button>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Using DeepShield's protected RPC is required for commit-reveal MEV protection.</p>
            </div>
          </CardContent>
        </Card>

        {/* Protection Preferences */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Shield className="w-5 h-5 text-primary" />
              Protection Preferences
            </CardTitle>
            <CardDescription className="text-sm">Configure how DeepShield reacts to identified threats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Auto-Protect Mode</Label>
                <CardDescription className="text-sm max-w-[400px]">Automatically route high-risk trades through the private mempool.</CardDescription>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Risk Tolerance Slider</Label>
                <span className="text-sm font-extrabold text-warning">Medium (40/100)</span>
              </div>
              <Slider defaultValue={[40]} max={100} step={1} />
              <p className="text-xs text-muted-foreground font-medium">Trades with a risk score above 40 will trigger a warning before execution.</p>
            </div>

          </CardContent>
        </Card>

        {/* AI Guardian Settings */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Bot className="w-5 h-5 text-primary" />
              AI Guardian Settings
            </CardTitle>
            <CardDescription className="text-sm">Customize the AI execution assistant behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Proactive Suggestions</Label>
                <CardDescription className="text-sm max-w-[400px]">AI will automatically suggest split orders or delays if it detects bad market conditions.</CardDescription>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Explainability Level</Label>
                <CardDescription className="text-sm max-w-[400px]">Show deep technical reasoning for AI decisions.</CardDescription>
              </div>
              <Switch defaultChecked />
            </div>

          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Whale Alerts</Label>
                <CardDescription className="text-sm">Get notified when massive liquidity shifts occur.</CardDescription>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Protection Summaries</Label>
                <CardDescription className="text-sm">Weekly report of total MEV saved.</CardDescription>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
