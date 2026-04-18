'use client';

import { useState, useCallback } from 'react';
import { Shield, Activity, CircleAlert as AlertCircle } from 'lucide-react';
import { ScraperForm } from '@/components/scraper/ScraperForm';
import { LogPanel, LogEntry } from '@/components/scraper/LogPanel';
import { ResultsTable, PolicyRecord } from '@/components/scraper/ResultsTable';

let logIdCounter = 0;

function makeLog(message: string, type: LogEntry['type'] = 'info'): LogEntry {
  return {
    id: String(++logIdCounter),
    message,
    type,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  };
}

const EDGE_FUNCTION_URL = 'https://fkdwhiwlxnrxxkirtzjj.supabase.co/functions/v1/scrape-proxy';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<PolicyRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const appendLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, makeLog(message, type)]);
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setLogs([]);
    setResults([]);
    setError(null);

    appendLog('Initiating workflow session...', 'info');

    try {
const response = await fetch(EDGE_FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZHdoaXdseG5yeHhraXJ0empqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjYyMjgsImV4cCI6MjA4NjAwMjIyOH0.OpuQ5TQSzLPREc-UJEaHU6GadFr2PseuBxbpn2D_mcY',
  },
  body: JSON.stringify({ username, password }),
});

      if (!response.ok || !response.body) {
        const errText = await response.text().catch(() => `HTTP ${response.status}`);
        appendLog(`Error: ${errText}`, 'error');
        setError(errText);
        setIsRunning(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event:')) continue;

          if (line.startsWith('data:')) {
            const raw = line.slice(5).trim();
            if (!raw || raw === '[DONE]') continue;

            try {
              const parsed = JSON.parse(raw);

              if (parsed.type === 'result') {
                const records: PolicyRecord[] = parsed.data ?? [];
                setResults(records);
                appendLog(`Workflow complete. ${records.length} policies extracted.`, 'success');
              } else if (parsed.type === 'error') {
                appendLog(parsed.message ?? 'Unknown error', 'error');
                setError(parsed.message ?? 'Unknown error');
              } else if (parsed.type === 'log') {
                const msgType: LogEntry['type'] =
                  parsed.level === 'error'
                    ? 'error'
                    : parsed.level === 'warn'
                    ? 'warn'
                    : parsed.level === 'success'
                    ? 'success'
                    : 'info';
                appendLog(parsed.message ?? raw, msgType);
              } else {
                appendLog(parsed.message ?? raw, 'info');
              }
            } catch {
              if (raw) appendLog(raw, 'info');
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      appendLog(`Fatal: ${msg}`, 'error');
      setError(msg);
    } finally {
      setIsRunning(false);
    }
  }, [username, password, appendLog]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-600/30">
            <Shield className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">LapseGuard</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Insurance Policy Arrears Monitor</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-xs text-zinc-600">CICA Portal</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="text-center space-y-2 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-800/50 bg-sky-900/20 text-sky-400 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Workflow Control Panel
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Policy Arrears Monitor
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Authenticate with the CICA portal and extract policies flagged for arrears or potential
            lapse in real time.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
            <span className="text-sm font-semibold text-zinc-200">Configuration</span>
            <span className="ml-auto text-xs text-zinc-600">Enter your CICA credentials</span>
          </div>
          <ScraperForm
            username={username}
            password={password}
            isRunning={isRunning}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSubmit={handleRun}
          />
        </div>

        {error && !isRunning && (
          <div className="flex items-start gap-3 rounded-xl border border-red-800/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {(logs.length > 0 || isRunning) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-300">Live Log</span>
            </div>
            <LogPanel logs={logs} isRunning={isRunning} />
          </div>
        )}

        {results.length > 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 shadow-xl">
            <ResultsTable records={results} />
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/60 mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-zinc-600">LapseGuard — Internal Tool</span>
          <span className="text-xs text-zinc-700">Data is not stored</span>
        </div>
      </footer>
    </div>
  );
}
