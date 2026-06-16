import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { ConnectWalletModal } from "@/components/shared/ConnectWalletModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeepShield AI - Institutional Grade Protection",
  description: "AI-Powered Trade Protection Layer for DeepBook",
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground bg-background">
        <Providers>
          <TooltipProvider>
            {/* Global Top Navbar */}
            <Navbar />
            
            <div className="flex flex-1 relative z-10 overflow-hidden">
              {/* Sidebar Contextual */}
              <Sidebar />
              
              <main className="flex-1 overflow-auto">
                <div className="p-8">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </main>
            </div>
            
            {/* Global Modals */}
            <ConnectWalletModal />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
