"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 border border-destructive/20 bg-destructive/5 rounded-xl text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">System Recovery State</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            The UI encountered an unexpected rendering error. DeepShield's core infrastructure remains active, but this view must be reset.
          </p>
          <Button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            variant="outline"
            className="flex items-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" /> Reset View
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
