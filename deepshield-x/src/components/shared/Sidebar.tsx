"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  BarChart3, 
  Settings,
  ShieldCheck,
  Activity,
  History,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarNavigation = [
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Portfolio", href: "/portfolio", icon: ShieldCheck },
  { name: "Asset Safety", href: "/#", icon: Lock },
  { name: "Network Health", href: "/#", icon: Activity },
  { name: "Audit Logs", href: "/#", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on the landing page based on typical SaaS layouts
  if (pathname === "/") return null;

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      
      {/* Context Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Guardian Core</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Protection</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarNavigation.map((item) => {
          // Highlight Analytics specifically since it's the first active mock route
          const isActive = pathname === item.href || (item.name === "Asset Safety" && pathname === "/settings");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Button variant="outline" className="w-full justify-center bg-transparent border-border text-foreground hover:bg-secondary">
          Upgrade Node
        </Button>
      </div>
    </aside>
  );
}
