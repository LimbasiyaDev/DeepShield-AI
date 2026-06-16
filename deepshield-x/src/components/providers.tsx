'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import '@mysten/dapp-kit/dist/index.css';
import { AuthBootstrap } from './auth-bootstrap';

// Prevent Next.js Error Overlay from hijacking the screen when the Sui Wallet extension throws internal errors
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('dApp.signPersonalMessage') ||
      msg.includes('dApp.signAndExecuteTransactionBlock') ||
      msg.includes('dapp-interface.js') ||
      msg.includes('TRPCClientError') ||
      msg.includes('Incorrect password') ||
      msg.includes('SIGN ERROR') ||
      msg.includes('Transaction execution failed')
    ) {
      // Downgrade to warn so it doesn't trigger the Next.js dev overlay
      console.warn('[Suppressed Extension Error]', ...args);
      return;
    }
    originalError.apply(console, args);
  };
}

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  mainnet: { url: 'https://fullnode.mainnet.sui.io:443', network: 'mainnet' as any },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <AuthBootstrap>
            {children}
          </AuthBootstrap>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
