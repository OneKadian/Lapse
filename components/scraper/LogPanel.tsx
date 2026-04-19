'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type LogEntry = {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warn';
  timestamp: string;
};

interface LogPanelProps {
  logs: LogEntry[];
  isRunning: boolean;
}

export function LogPanel({ logs, isRunning }: LogPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-slate-300 font-mono ml-2">scraper.log</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            RUNNING
          </span>
        )}
        {!isRunning && logs.length > 0 && (
          <span className="ml-auto text-xs text-slate-400 font-mono">{logs.length} lines</span>
        )}
      </div>
      <div className="bg-slate-900 h-72 overflow-y-auto p-4 font-mono text-sm">
        {logs.length === 0 && !isRunning && (
          <div className="flex h-full items-center justify-center">
            <span className="text-slate-500 text-xs">Waiting for scraper to start...</span>
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-6">
            <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>
            <span
              className={cn(
                'break-all',
                log.type === 'error' && 'text-red-500',
                log.type === 'success' && 'text-emerald-500',
                log.type === 'warn' && 'text-yellow-500',
                log.type === 'info' && 'text-slate-300'
              )}
            >
              {log.message}
            </span>
          </div>
        ))}
        {isRunning && (
          <div className="flex gap-3 leading-6">
            <span className="text-slate-500 shrink-0 select-none">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="text-slate-400 animate-pulse">_</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
