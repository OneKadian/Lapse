'use client';

import { User, Lock, Play, Loader as Loader2 } from 'lucide-react';

interface ScraperFormProps {
  username: string;
  password: string;
  isRunning: boolean;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}

export function ScraperForm({
  username,
  password,
  isRunning,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: ScraperFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="agent@example.com"
            disabled={isRunning}
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/50 focus:border-slate-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            disabled={isRunning}
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/50 focus:border-slate-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isRunning || !username || !password}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 text-sm"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Workflow in progress...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Run Workflow
          </>
        )}
      </button>
    </div>
  );
}
