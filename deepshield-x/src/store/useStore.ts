import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Wallet State
  walletConnected: boolean;
  walletAddress: string | null;
  jwtToken: string | null;
  portfolioValue: string | null;
  protectionScore: number;
  protectedTrades: number;
  estimatedSavings: string;
  isWalletModalOpen: boolean;
  
  // Wallet Actions
  setWalletModalOpen: (isOpen: boolean) => void;
  connectWallet: (address: string, token?: string) => void;
  disconnectWallet: () => void;

  // Network State
  suiMainnetStatus: 'Operational' | 'Degraded' | 'Down';
  deepBookStatus: 'Active' | 'Inactive';
  networkLatency: string;
  
  // Protection Settings
  protectionEnabled: boolean;
  toggleProtection: () => void;
  aiSensitivity: number;
  setAiSensitivity: (val: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      walletConnected: false,
      walletAddress: null,
      jwtToken: null,
      portfolioValue: null,
      protectionScore: 0,
      protectedTrades: 0,
      estimatedSavings: "$0.00",
      isWalletModalOpen: false,
      
      setWalletModalOpen: (isOpen: boolean) => set({ isWalletModalOpen: isOpen }),
      
      connectWallet: (address: string, token?: string) => {
        set({ 
          walletConnected: true, 
          walletAddress: address, 
          jwtToken: token || null,
          portfolioValue: "$12,450.00",
          protectionScore: 945,
          protectedTrades: 312,
          estimatedSavings: "$45,200",
          isWalletModalOpen: false
        });
      },
      
      disconnectWallet: () => {
        set({ 
          walletConnected: false, 
          walletAddress: null,
          jwtToken: null,
          portfolioValue: null,
          protectionScore: 0,
          protectedTrades: 0,
          estimatedSavings: "$0.00"
        });
      },
      
      suiMainnetStatus: 'Operational',
      deepBookStatus: 'Active',
      networkLatency: '24ms',

      protectionEnabled: true,
      toggleProtection: () => set((state) => ({ protectionEnabled: !state.protectionEnabled })),
      
      aiSensitivity: 80,
      setAiSensitivity: (val: number) => set({ aiSensitivity: val }),
    }),
    {
      name: 'deepshield-session',
      partialize: (state) => ({ 
        walletConnected: state.walletConnected,
        walletAddress: state.walletAddress,
        jwtToken: state.jwtToken,
        portfolioValue: state.portfolioValue,
        protectionScore: state.protectionScore,
        protectedTrades: state.protectedTrades,
        estimatedSavings: state.estimatedSavings,
        protectionEnabled: state.protectionEnabled,
        aiSensitivity: state.aiSensitivity
      })
    }
  )
);
