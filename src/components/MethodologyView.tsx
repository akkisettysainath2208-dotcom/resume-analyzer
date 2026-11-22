interface MethodologyViewProps {
  onBackToAnalyzer: () => void;
}

export function MethodologyView({ onBackToAnalyzer }: MethodologyViewProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            How This Prototype Works &amp; Responsible Use
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Architecture, PDF constraints, and scoring limitations
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToAnalyzer}
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
        >
          Return to Analyzer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              01. Extraction &amp; Analysis Pipeline
            </h2>
            <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600 list-decimal pl-5">
              <li>
                <strong className="text-slate-900">PDF Parsing:</strong>{" "}
                Uploaded PDFs (up to 30 pages, 10 MB max) are processed on the server to extract plain text up to 25,000 characters. Encrypted or image-only scanned PDFs are detected and flagged.
              </li>
              <li>
                <strong className="text-slate-900">Prompt Isolation:</strong>{" "}
                Resume text and job description content are enclosed in structural delimiters and treated strictly as untrusted data, not instructions.
              </li>
              <li>
                <strong className="text-slate-900">Structured JSON Output:</strong>{" "}
                Gemini evaluates evidence present in the resume against the job description and returns a bounded score (0–100), matched skills with evidence, missing skills, keyword gaps, and five honest suggestions.
              </li>
            </ol>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              02. Limitations &amp; Privacy Guarantees
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Estimated Score Only:</strong>{" "}
                The 0–100 score is an AI coaching estimate, not a real employer ATS score or hiring prediction. Different employers use different ATS vendors and screening rules.
              </li>
              <li>
                <strong className="text-slate-900">No Database Storage:</strong>{" "}
                This prototype does not persist uploaded PDFs, resume text, job descriptions, or analysis results to a database.
              </li>
              <li>
                <strong className="text-slate-900">Honesty First:</strong>{" "}
                Always verify every suggestion against your actual background and never add skills or experience you do not genuinely possess.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
