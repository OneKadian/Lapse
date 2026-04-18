'use client';

import { cn } from '@/lib/utils';
import { ShieldAlert, TriangleAlert as AlertTriangle, Download } from 'lucide-react';

export type PolicyRecord = {
  urgency: 'PAST_DUE' | 'POTENTIAL_LAPSE';
  policyNumber: string;
  owner: string;
  ptd: string;
  nextPaymentDate: string;
  modePremium: string;
};

interface ResultsTableProps {
  records: PolicyRecord[];
}

function UrgencyBadge({ urgency }: { urgency: PolicyRecord['urgency'] }) {
  if (urgency === 'PAST_DUE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold whitespace-nowrap">
        <ShieldAlert className="w-3 h-3" />
        PAST DUE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold whitespace-nowrap">
      <AlertTriangle className="w-3 h-3" />
      POTENTIAL LAPSE
    </span>
  );
}

function exportCsv(records: PolicyRecord[]) {
  const headers = ['Urgency', 'Policy #', 'Owner', 'PTD', 'Next Payment Date', 'Mode Premium'];
  const rows = records.map((r) => [
    r.urgency === 'PAST_DUE' ? 'PAST DUE' : 'POTENTIAL LAPSE',
    r.policyNumber,
    r.owner,
    r.ptd,
    r.nextPaymentDate,
    r.modePremium,
  ]);
  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lapseguard-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ResultsTable({ records }: ResultsTableProps) {
  if (records.length === 0) return null;

  const pastDueCount = records.filter((r) => r.urgency === 'PAST_DUE').length;
  const potentialLapseCount = records.filter((r) => r.urgency === 'POTENTIAL_LAPSE').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Scrape Results</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-zinc-400">{records.length} policies found</span>
            {pastDueCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-red-400">
                <ShieldAlert className="w-3 h-3" />
                {pastDueCount} past due
              </span>
            )}
            {potentialLapseCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                {potentialLapseCount} potential lapse
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => exportCsv(records)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Urgency
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Policy #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  PTD
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Next Payment Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Mode Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {records.map((record, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    'transition-colors',
                    record.urgency === 'PAST_DUE'
                      ? 'bg-red-950/20 hover:bg-red-950/30'
                      : 'bg-orange-950/10 hover:bg-orange-950/20'
                  )}
                >
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={record.urgency} />
                  </td>
                  <td className="px-4 py-3 font-mono text-sky-400 font-medium whitespace-nowrap">
                    {record.policyNumber}
                  </td>
                  <td className="px-4 py-3 text-zinc-200 whitespace-nowrap">{record.owner}</td>
                  <td className="px-4 py-3 text-zinc-300 font-mono whitespace-nowrap">{record.ptd}</td>
                  <td className="px-4 py-3 text-zinc-300 font-mono whitespace-nowrap">
                    {record.nextPaymentDate}
                  </td>
                  <td className="px-4 py-3 text-zinc-200 font-mono whitespace-nowrap">
                    {record.modePremium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
