'use client';

import { TriangleAlert as AlertTriangle, Download } from 'lucide-react';

export type PolicyRecord = {
  urgency: string;
  daysSincePTD: number;
  'Policy #': string;
  'Owner': string;
  'PTD': string;
  'Next Payment Date': string;
  'Mode Premium': string;
  'Payment Method': string;
};

interface ResultsTableProps {
  records: PolicyRecord[];
}

function exportCsv(records: PolicyRecord[]) {
  const headers = ['Policy #', 'Owner', 'Days to Potential Lapse', 'Mode Premium', 'Urgency'];
  const rows = records.map((r) => [
    r['Policy #'],
    r['Owner'],
    String(90 - r.daysSincePTD),
    r['Mode Premium'],
    r.urgency,
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Scrape Results</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-zinc-400">{records.length} policies found</span>
            <span className="inline-flex items-center gap-1 text-xs text-orange-400">
              <AlertTriangle className="w-3 h-3" />
              {records.length} approaching lapse
            </span>
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

      <div className="rounded-xl border border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800 border-b border-zinc-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Policy #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Days to Lapse
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  Mode Premium
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Urgency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {records.map((record, idx) => {
                const daysToLapse = 90 - record.daysSincePTD;
                const isUrgent = daysToLapse <= 10;
                return (
                  <tr key={idx} className="bg-zinc-900 hover:bg-zinc-800 transition-colors">
                    <td className="px-4 py-3 font-mono text-sky-400 font-medium whitespace-nowrap">
                      {record['Policy #']}
                    </td>
                    <td className="px-4 py-3 text-zinc-100 whitespace-nowrap">
                      {record['Owner']}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`font-mono font-semibold ${isUrgent ? 'text-red-400' : 'text-orange-400'}`}>
                        {daysToLapse} days
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-100 font-mono whitespace-nowrap">
                      {record['Mode Premium']}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-900/40 border border-orange-700/50 text-orange-400 text-xs font-semibold whitespace-nowrap">
                        <AlertTriangle className="w-3 h-3" />
                        {record.urgency}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
