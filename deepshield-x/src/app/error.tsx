'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route Boundary Error:', error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-8 text-foreground">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Module Offline</h2>
        <p className="text-sm text-muted-foreground">
          This sector of DeepShield encountered a runtime failure.
        </p>
        <div className="w-full rounded bg-black/50 p-3 text-left font-mono text-xs text-destructive-foreground">
          {error.message || "Unknown Runtime Exception"}
        </div>
        <Button onClick={() => reset()} variant="outline" className="mt-2 border-primary text-primary hover:bg-primary/10 font-bold">
          Try Again
        </Button>
      </div>
    </div>
  );
}
