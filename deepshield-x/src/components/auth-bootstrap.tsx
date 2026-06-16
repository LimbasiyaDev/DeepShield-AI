"use client";

import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useStore } from '@/store/useStore';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const currentAccount = useCurrentAccount();
  const { walletAddress, jwtToken, connectWallet, disconnectWallet } = useStore();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    // Initial hydration phase
    const hydrate = async () => {
      // Small delay to allow Zustand persist to hydrate if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const rawState = localStorage.getItem('deepshield-session');
      let persistedAddress = null;
      let persistedJwt = null;

      if (rawState) {
        try {
          const parsed = JSON.parse(rawState);
          persistedAddress = parsed.state?.walletAddress;
          persistedJwt = parsed.state?.jwtToken;
        } catch (e) {
          console.error("Failed to parse persisted session", e);
        }
      }

      if (persistedJwt && persistedAddress) {
        // Assume valid for now, check dapp-kit next
        connectWallet(persistedAddress, persistedJwt);
      } else {
        disconnectWallet();
      }
      setIsRestoring(false);
    };

    hydrate();
  }, []);

  // Sync dapp-kit account changes after hydration
  useEffect(() => {
    if (!isRestoring) {
      if (!currentAccount && walletAddress) {
        // Wallet was removed or disconnected from extension
        console.warn("Wallet extension disconnected. Clearing session.");
        disconnectWallet();
      } else if (currentAccount && walletAddress && currentAccount.address !== walletAddress) {
         // Wallet changed, require re-auth
         console.warn("Wallet address changed in extension. Clearing session.");
         disconnectWallet();
      }
    }
  }, [currentAccount, walletAddress, isRestoring]);

  if (isRestoring) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-foreground tracking-widest animate-pulse">RESTORING SESSION...</h2>
        <p className="text-sm text-muted-foreground mt-2">Connecting to DeepShield AI</p>
      </div>
    );
  }

  return <>{children}</>;
}
