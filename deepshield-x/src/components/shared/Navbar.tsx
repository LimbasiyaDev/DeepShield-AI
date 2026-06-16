"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Bell, User, ChevronDown, Activity, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Intelligence", href: "/intelligence" },
  { name: "Protection", href: "/trade" },
  { name: "Guardian", href: "/guardian" },
  { name: "Verification", href: "/verification" },
  { name: "Radar", href: "/radar" },
];

export function Navbar() {
  const pathname = usePathname();
  const { walletConnected, walletAddress, setWalletModalOpen, disconnectWallet, suiMainnetStatus, deepBookStatus, portfolioValue } = useStore();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-3 w-64">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-primary tracking-tight">DeepShield AI</span>
        </Link>
      </div>

      {/* Middle: Main Navigation */}
      <nav className="hidden xl:flex items-center gap-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-bold transition-colors relative py-5",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Hackathon Demo Buttons */}
        <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-border pr-6">
          <Link href="/command-center">
            <Button variant="outline" size="sm" className="font-bold border-primary text-primary hover:bg-primary/10">
              Command Center
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="sm" className="font-bold bg-success hover:bg-success/90 text-white shadow-sm">
              Start Demo
            </Button>
          </Link>
        </div>
        
        {/* Live Sui Network Status */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-secondary text-[11px] font-bold text-muted-foreground border border-border">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${suiMainnetStatus === 'Operational' ? 'bg-success' : 'bg-warning'}`}></div>
            Sui Mainnet
          </div>
          <div className="w-px h-3 bg-border"></div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${deepBookStatus === 'Active' ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
            DeepBook
          </div>
        </div>
        
        <button className="relative p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors hidden md:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        
        {/* Wallet Connection */}
        {!walletConnected ? (
          <Button 
            onClick={() => setWalletModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm rounded-lg px-6"
          >
            Connect Wallet
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="border border-border bg-card shadow-sm hover:bg-secondary flex items-center gap-2 pl-3 pr-2 py-2 rounded-md transition-colors cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-[#4A8FE2]/10 flex items-center justify-center mr-1">
                  <span className="text-[10px] font-extrabold text-[#4A8FE2]">S</span>
                </div>
                <span className="font-bold text-sm">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-md rounded-xl">
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground font-bold pb-2">
                <div>My Wallet</div>
                <div className="text-2xl text-primary mt-1">{portfolioValue}</div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="font-semibold cursor-pointer py-2 px-2" onClick={() => window.location.href='/portfolio'}>
                <Shield className="w-4 h-4 mr-2 text-muted-foreground" /> Portfolio Protection
              </DropdownMenuItem>
              <DropdownMenuItem className="font-semibold cursor-pointer py-2 px-2" onClick={() => window.location.href='/replay'}>
                <Activity className="w-4 h-4 mr-2 text-muted-foreground" /> Protection History
              </DropdownMenuItem>
              <DropdownMenuItem className="font-semibold cursor-pointer py-2 px-2" onClick={() => window.location.href='/settings'}>
                <Settings className="w-4 h-4 mr-2 text-muted-foreground" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={disconnectWallet} className="font-bold text-destructive focus:text-destructive cursor-pointer py-2 px-2">
                <LogOut className="w-4 h-4 mr-2" /> Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

    </header>
  );
}
