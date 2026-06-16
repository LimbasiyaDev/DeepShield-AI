'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
          <div className="flex max-w-md flex-col items-center gap-6 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center shadow-lg">
            <div className="rounded-full bg-destructive/20 p-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">System Fault Detected</h2>
              <p className="text-sm text-muted-foreground">
                DeepShield's execution core encountered an unexpected error.
              </p>
            </div>
            
            <div className="w-full rounded-md bg-black/50 p-4 text-left font-mono text-xs text-destructive-foreground overflow-auto max-h-32">
              {error.message || "Unknown Runtime Error"}
            </div>

            <Button
              onClick={() => reset()}
              className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Re-initialize Core
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
