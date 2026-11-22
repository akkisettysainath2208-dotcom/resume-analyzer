import { useState } from "react";
import { Check, Copy, ArrowLeft } from "lucide-react";
import type { ExtractedPdfInfo } from "../types/analysis";

interface ExtractedTextViewProps {
  resumeText: string;
  pdfInfo: ExtractedPdfInfo | null;
  onBackToAnalyzer: () => void;
}

export function ExtractedTextView({
  resumeText,
  pdfInfo,
  onBackToAnalyzer,
}: ExtractedTextViewProps) {
  const [copied, setCopied] = useState(false);
  const trimmed = resumeText.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const lineCount = trimmed ? trimmed.split(/\r?\n/).length : 0;

  const handleCopy = async () => {
    if (!trimmed) return;
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            ATS-Extracted Resume Text
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
            <span>{pdfInfo ? pdfInfo.fileName : "Pasted or Sample Resume"}</span>
            {pdfInfo && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {pdfInfo.pagesProcessed} of {pdfInfo.totalPages} pages
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{wordCount.toLocaleString()} words</span>
            <span aria-hidden="true">·</span>
            <span>{lineCount.toLocaleString()} lines</span>
            <span aria-hidden="true">·</span>
            <span>{trimmed.length.toLocaleString()} chars</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {trimmed && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Copied Text
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy Plain Text
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onBackToAnalyzer}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Analyzer
          </button>
        </div>
      </div>

      {trimmed ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          <div className="lg:col-span-2 p-6">
            <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
              {trimmed}
            </pre>
          </div>
          <aside className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              What to check here
            </h2>
            <ul className="space-y-3 text-xs leading-relaxed text-slate-600">
              <li>
                <strong className="text-slate-900">Reading order:</strong>{" "}
                Multi-column PDFs sometimes merge sentences across columns. Verify that job titles, dates, and bullet points read in the right sequence.
              </li>
              <li>
                <strong className="text-slate-900">Missing headings or icons:</strong>{" "}
                Text embedded inside graphics, skill bars, or SVG badges will not appear in plain-text extraction.
              </li>
              <li>
                <strong className="text-slate-900">25,000-character limit:</strong>{" "}
                Up to 30 pages are read and capped at 25,000 characters before sending to Gemini.
              </li>
            </ul>
          </aside>
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            No resume text loaded yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Upload a PDF resume or paste text in the Analyzer to inspect how it parses.
          </p>
          <button
            type="button"
            onClick={onBackToAnalyzer}
            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            Go to Analyzer
          </button>
        </div>
      )}
    </section>
  );
}
