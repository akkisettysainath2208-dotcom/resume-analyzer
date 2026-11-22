import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { AnalysisResult } from "../types/analysis";

interface ResultsDashboardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  checkedSuggestions: number[];
  onToggleSuggestion: (index: number) => void;
  onLoadSample: () => void;
}

type FindingsFilter = "all" | "matched" | "missing" | "keywords";

function getScoreBand(score: number): {
  label: string;
  textClass: string;
  barClass: string;
} {
  if (score >= 75) {
    return {
      label: "Strong Alignment",
      textClass: "text-emerald-700",
      barClass: "bg-emerald-600",
    };
  }
  if (score >= 50) {
    return {
      label: "Moderate Alignment",
      textClass: "text-amber-700",
      barClass: "bg-amber-600",
    };
  }
  return {
    label: "Needs Tailoring",
    textClass: "text-red-700",
    barClass: "bg-red-600",
  };
}

export function ResultsDashboard({
  result,
  isLoading,
  checkedSuggestions,
  onToggleSuggestion,
  onLoadSample,
}: ResultsDashboardProps) {
  const [filterMode, setFilterMode] = useState<FindingsFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStrengths, setShowStrengths] = useState(false);
  const [showCautions, setShowCautions] = useState(false);
  const [copiedKey, setCopiedKey] = useState<"summary" | "keywords" | null>(
    null
  );

  if (isLoading) {
    return (
      <section
        aria-label="Analysis loading"
        className="rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="animate-pulse space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2.5">
              <div className="h-4 w-36 rounded bg-slate-200" />
              <div className="h-10 w-44 rounded bg-slate-200" />
            </div>
            <div className="h-9 w-56 rounded bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-11/12 rounded bg-slate-100" />
              <div className="h-4 w-4/5 rounded bg-slate-100" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-11/12 rounded bg-slate-100" />
              <div className="h-4 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section
        aria-label="Empty analysis state"
        className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center"
      >
        <h2 className="text-base font-semibold text-slate-900">
          Ready to evaluate resume alignment
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Upload a text-based PDF resume or paste your resume text above, add a job description, and run the analysis to review your estimated match score, missing skills, keyword gaps, and five concrete improvements.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Load Sample Resume &amp; Job Description
          </button>
        </div>
      </section>
    );
  }

  const band = getScoreBand(result.match_score);
  const query = searchQuery.trim().toLowerCase();
  const filterList = (items: string[]) =>
    query ? items.filter((item) => item.toLowerCase().includes(query)) : items;

  const filteredMatched = filterList(result.matched_skills);
  const filteredMissing = filterList(result.missing_skills);
  const filteredKeywords = filterList(result.keyword_gaps);

  const handleCopy = async (kind: "summary" | "keywords") => {
    const text =
      kind === "summary"
        ? `Estimated Match: ${result.match_score}/100 (${band.label})\n\n${result.summary}`
        : result.keyword_gaps.join(", ");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(kind);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard blocked in restricted context; ignore silently
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume_analysis.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const lines: string[] = [
      `# Resume Analysis Report`,
      ``,
      `- **Estimated Match Score:** ${result.match_score}/100 (${band.label})`,
      result.meta ? `- **Model:** ${result.meta.model}` : "",
      ``,
      `## Overall Assessment`,
      result.summary,
      ``,
      `## Matching Skills`,
      ...(result.matched_skills.length
        ? result.matched_skills.map((item) => `- ${item}`)
        : ["- None identified"]),
      ``,
      `## Missing or Weak Skills`,
      ...(result.missing_skills.length
        ? result.missing_skills.map((item) => `- ${item}`)
        : ["- No major gaps identified"]),
      ``,
      `## Keyword Gaps`,
      result.keyword_gaps.length
        ? result.keyword_gaps.join(", ")
        : "No major keyword gaps identified.",
      ``,
      `## 5 Ways to Improve Your Resume`,
      ...result.suggestions
        .slice(0, 5)
        .map((s, idx) => `${idx + 1}. **${s.title}** — ${s.detail}`),
      ``,
      `---`,
      `Use this report as a coaching aid. Always verify the analysis and never add false information to a resume.`,
    ].filter(Boolean);

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume_analysis_report.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const showMatchedBlock = filterMode === "all" || filterMode === "matched";
  const showMissingBlock = filterMode === "all" || filterMode === "missing";
  const showKeywordsBlock = filterMode === "all" || filterMode === "keywords";

  return (
    <section
      aria-label="Analysis results"
      className="rounded-xl border border-slate-200 bg-white"
    >
      {/* Focal Anchor: Estimated Match Score & Actions */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Estimated Resume Match
              </span>
              {result.meta && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{result.meta.model}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {result.meta.resumeCharCount.toLocaleString()} resume chars analyzed
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <span className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {result.match_score}
                <span className="text-xl font-normal text-slate-400">/100</span>
              </span>

              <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${band.textClass}`}>
                {result.match_score >= 75 ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                )}
                {band.label}
              </span>
            </div>

            <div
              className="h-2.5 w-full max-w-xl overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={result.match_score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Estimated resume match score"
            >
              <div
                className={`h-full transition-all duration-300 ${band.barClass}`}
                style={{ width: `${result.match_score}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy("summary")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
            >
              {copiedKey === "summary" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Copied Summary
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy Summary
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download Report
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download JSON
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Overall Assessment
          </h2>
          <p className="mt-1.5 max-w-4xl text-sm leading-relaxed text-slate-700">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar for Findings */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/50 px-6 py-3">
        <div
          role="tablist"
          aria-label="Filter analysis findings"
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/70 p-1"
        >
          {(
            [
              { id: "all", label: "All Findings" },
              { id: "matched", label: `Matches (${result.matched_skills.length})` },
              { id: "missing", label: `Gaps (${result.missing_skills.length})` },
              { id: "keywords", label: `Keywords (${result.keyword_gaps.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filterMode === tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap tabular-nums ${
                filterMode === tab.id
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter skills & keywords..."
            aria-label="Filter skills and keywords"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Skills Comparison Split */}
      {(showMatchedBlock || showMissingBlock) && (
        <div
          className={`grid grid-cols-1 ${
            showMatchedBlock && showMissingBlock ? "lg:grid-cols-2" : ""
          } divide-y lg:divide-y-0 lg:divide-x divide-slate-200 border-b border-slate-200`}
        >
          {showMatchedBlock && (
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Matching Skills
                </h3>
                <span className="text-xs text-emerald-700 font-medium tabular-nums">
                  {filteredMatched.length} evidenced
                </span>
              </div>

              {filteredMatched.length > 0 ? (
                <ul className="mt-4 divide-y divide-slate-100">
                  {filteredMatched.map((item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className="flex items-start gap-2.5 py-2.5 text-sm leading-relaxed text-slate-700 first:pt-0 last:pb-0"
                    >
                      <CheckCircle2
                        className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  {query
                    ? "No matching skills match your filter."
                    : "No clear matches identified."}
                </p>
              )}
            </div>
          )}

          {showMissingBlock && (
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Missing or Weak Skills
                </h3>
                <span className="text-xs text-amber-700 font-medium tabular-nums">
                  {filteredMissing.length} identified
                </span>
              </div>

              {filteredMissing.length > 0 ? (
                <ul className="mt-4 divide-y divide-slate-100">
                  {filteredMissing.map((item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className="flex items-start gap-2.5 py-2.5 text-sm leading-relaxed text-slate-700 first:pt-0 last:pb-0"
                    >
                      <AlertTriangle
                        className="mt-1 h-4 w-4 shrink-0 text-amber-600"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  {query
                    ? "No missing skills match your filter."
                    : "No major skill gaps identified."}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Keyword Gaps */}
      {showKeywordsBlock && (
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Keyword Gaps
              </h3>
              <p className="text-xs text-slate-500">
                Relevant terms from the job description that are absent or under-emphasized
              </p>
            </div>
            {result.keyword_gaps.length > 0 && (
              <button
                type="button"
                onClick={() => handleCopy("keywords")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
              >
                {copiedKey === "keywords" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    Copied Keywords
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy Keyword List
                  </>
                )}
              </button>
            )}
          </div>

          {filteredKeywords.length > 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-slate-800">
              {filteredKeywords.map((kw, idx) => (
                <span key={`${kw}-${idx}`}>
                  <span className="font-mono text-[13px] text-slate-900">{kw}</span>
                  {idx < filteredKeywords.length - 1 && (
                    <span className="mx-2 text-slate-300" aria-hidden="true">
                      /
                    </span>
                  )}
                </span>
              ))}
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              {query
                ? "No keywords match your filter."
                : "No major keyword gaps identified."}
            </p>
          )}
        </div>
      )}

      {/* 5 Concrete Improvements Checklist */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              5 Ways to Improve Your Resume
            </h3>
            <p className="text-xs text-slate-500">
              Check off actions as you revise your resume. Never add skills or experience you do not genuinely have.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-600 tabular-nums">
            {checkedSuggestions.length} of {result.suggestions.slice(0, 5).length} reviewed
          </span>
        </div>

        <ol className="mt-4 divide-y divide-slate-100">
          {result.suggestions.slice(0, 5).map((suggestion, idx) => {
            const isChecked = checkedSuggestions.includes(idx);
            const numLabel = `0${idx + 1}.`;
            return (
              <li key={`${suggestion.title}-${idx}`} className="py-3.5 first:pt-0 last:pb-0">
                <label className="flex cursor-pointer items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSuggestion(idx)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums">
                        {numLabel}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isChecked ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {suggestion.title}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        isChecked ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {suggestion.detail}
                    </p>
                  </div>
                </label>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Expandable Disclosures for Strengths & Cautions */}
      <div className="divide-y divide-slate-200">
        {result.strengths.length > 0 && (
          <div>
            <button
              type="button"
              aria-expanded={showStrengths}
              onClick={() => setShowStrengths((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              <span>Other Strengths ({result.strengths.length})</span>
              {showStrengths ? (
                <ChevronUp className="h-4 w-4 text-slate-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
              )}
            </button>
            {showStrengths && (
              <ul className="space-y-2 border-t border-slate-100 bg-slate-50/40 px-6 py-4 text-sm text-slate-700 list-disc pl-10">
                {result.strengths.map((item, idx) => (
                  <li key={`${item}-${idx}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {result.cautions.length > 0 && (
          <div>
            <button
              type="button"
              aria-expanded={showCautions}
              onClick={() => setShowCautions((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              <span>Limitations &amp; Points to Verify ({result.cautions.length})</span>
              {showCautions ? (
                <ChevronUp className="h-4 w-4 text-slate-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
              )}
            </button>
            {showCautions && (
              <ul className="space-y-2 border-t border-slate-100 bg-slate-50/40 px-6 py-4 text-sm text-slate-700 list-disc pl-10">
                {result.cautions.map((item, idx) => (
                  <li key={`${item}-${idx}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
