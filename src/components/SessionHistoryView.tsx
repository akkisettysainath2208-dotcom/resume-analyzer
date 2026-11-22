import { Trash2, ArrowUpRight } from "lucide-react";
import type { AnalysisRecord } from "../types/analysis";

interface SessionHistoryViewProps {
  records: AnalysisRecord[];
  activeRecordId: string | null;
  onSelectRecord: (record: AnalysisRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onGoToAnalyzer: () => void;
}

export function SessionHistoryView({
  records,
  activeRecordId,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
  onGoToAnalyzer,
}: SessionHistoryViewProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Session Comparison History
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Stored in memory for this browser session only. Refreshing or closing the tab clears all entries.
          </p>
        </div>

        {records.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
          >
            Clear Session History
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            No analyses run in this session yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Run an analysis in the Analyzer to compare scores across resume revisions or different job descriptions.
          </p>
          <button
            type="button"
            onClick={onGoToAnalyzer}
            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
          >
            Start an Analysis
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-2.5 px-6">Resume</th>
                <th className="py-2.5 px-4">Target Job Snippet</th>
                <th className="py-2.5 px-4">Model</th>
                <th className="py-2.5 px-4 text-right">Match</th>
                <th className="py-2.5 px-4 text-right">Time</th>
                <th className="py-2.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {records.map((rec) => {
                const isSelected = rec.id === activeRecordId;
                const score = rec.result.match_score;
                const scoreClass =
                  score >= 75
                    ? "text-emerald-700"
                    : score >= 50
                    ? "text-amber-700"
                    : "text-red-700";

                return (
                  <tr
                    key={rec.id}
                    className={`h-11 transition-colors hover:bg-slate-50 ${
                      isSelected ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <td className="py-2.5 px-6 font-medium text-slate-900 max-w-[220px] truncate">
                      {rec.resumeLabel}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-[300px] truncate">
                      {rec.jobTitlePreview}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {rec.model}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${scoreClass}`}
                    >
                      {score}/100
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                      {new Date(rec.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectRecord(rec)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                        >
                          Open
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          aria-label={`Delete ${rec.resumeLabel} from session history`}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
