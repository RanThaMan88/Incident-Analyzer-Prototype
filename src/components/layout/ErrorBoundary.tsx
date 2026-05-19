import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#050505] p-4 text-white">
          <Card className="max-w-md bg-[#141414] border-[#1F1F1F] p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="mb-2 text-lg font-semibold tracking-tight text-white">System Error Encountered</h2>
            <p className="mb-6 text-sm text-[#8E8E8E]">
              JurisLens encountered an unexpected error. Our forensic state engine has halted.
              <br />
              <br className="hidden" />
              <span className="font-mono text-[10px] text-red-400">{this.state.error?.message}</span>
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#FF4F00] text-white hover:bg-[#FF4F00]/90"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Restart Workspace
            </Button>
          </Card>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
