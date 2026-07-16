"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#050507] text-neutral-200 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          {/* Neon radial glow behind content */}
          <div className="absolute w-[450px] h-[450px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="max-w-md w-full relative z-10 text-center space-y-8 p-8 rounded-2xl border border-neutral-900/80 bg-neutral-950/60 backdrop-blur-xl shadow-2xl">
            {/* Visual alert anchor */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/35 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                <AlertTriangle className="w-7 h-7 text-rose-500" />
              </div>
            </div>

            {/* Error Message Header */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-rose-400 uppercase">
                System Intercepted Exception
              </span>
              <h1 className="text-2xl font-display font-light uppercase tracking-tight text-white">
                Initialization <span className="font-bold">Interrupted</span>
              </h1>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">
                A rendering or runtime exception occurred during screen construction. The safety container intercepted the crash.
              </p>
            </div>

            {/* Collapsible/Slight error stack readout */}
            {this.state.error && (
              <div className="text-left p-4 bg-neutral-950 rounded-lg border border-neutral-900/90 font-mono text-[10px] text-rose-300 overflow-x-auto max-h-36 scrollbar-thin scrollbar-thumb-neutral-800">
                <p className="font-bold mb-1 uppercase text-neutral-500 text-[9px] tracking-wider">Exception Diagnostic Trace:</p>
                <p className="break-all">{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            {/* Actions Panel */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 active:scale-98 transition-all duration-200 select-none cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                RELOAD ENGINE
              </button>
              
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    window.location.reload();
                  } catch (e) {
                    window.location.reload();
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono text-xs hover:text-white hover:border-neutral-700 active:scale-98 transition-all duration-200 select-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                CLEAR CACHE & RETRY
              </button>
            </div>

            {/* Technical Footer */}
            <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest flex justify-between items-center border-t border-neutral-900 pt-4">
              <span>ERR CONTAINER V1.0.0</span>
              <span>STATE: ISOLATED</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
