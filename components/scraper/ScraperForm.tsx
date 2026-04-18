'use client';

import { Globe, User, Lock, Play, Loader as Loader2 } from 'lucide-react';

interface ScraperFormProps {
  targetUrl: string;
  username: string;
  password: string;
  isRunning: boolean;
  onTargetUrlChange: (v: string) => void;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}

export function ScraperForm({
  targetUrl,
  username,
  password,
  isRunning,
  onTargetUrlChange,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: ScraperFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-zinc-500" />
          Target URL
        </label>
        <input
          type="url"
          value={targetUrl}
          onChange={(e) => onTargetUrlChange(e.target.value)}
          placeholder="https://portal.cica.com/login"
          disabled={isRunning}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="agent@example.com"
            disabled={isRunning}
            autoComplete="username"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            disabled={isRunning}
            autoComplete="current-password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isRunning || !targetUrl || !username || !password}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 transition-all duration-200 shadow-lg shadow-sky-900/30 hover:shadow-sky-800/40 text-sm"
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
