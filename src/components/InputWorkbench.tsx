import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import {
  FileText,
  Upload,
  X,
  ArrowRight,
  AlertCircle,
  Eye,
  Loader2,
} from "lucide-react";
import type { ExtractedPdfInfo, GeminiModelId } from "../types/analysis";
import { SAMPLE_PRESETS } from "../data/samplePresets";

interface InputWorkbenchProps {
  resumeInputMode: "pdf" | "text";
  onChangeResumeInputMode: (mode: "pdf" | "text") => void;
  resumeText: string;
  onChangeResumeText: (text: string) => void;
  pdfInfo: ExtractedPdfInfo | null;
  isExtractingPdf: boolean;
  pdfError: string | null;
  onUploadPdf: (file: File) => void;
  onClearPdf: () => void;
  jobDescription: string;
  onChangeJobDescription: (text: string) => void;
  selectedModel: GeminiModelId;
  onChangeModel: (model: GeminiModelId) => void;
  onLoadSample: (presetId: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisError: string | null;
  onInspectExtractedText: () => void;
}

export function InputWorkbench({
  resumeInputMode,
  onChangeResumeInputMode,
  resumeText,
  onChangeResumeText,
  pdfInfo,
  isExtractingPdf,
  pdfError,
  onUploadPdf,
  onClearPdf,
  jobDescription,
  onChangeJobDescription,
  selectedModel,
  onChangeModel,
  onLoadSample,
  onAnalyze,
  isAnalyzing,
  analysisError,
  onInspectExtractedText,
}: InputWorkbenchProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadPdf(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPdf(file);
    }
    e.target.value = "";
  };

  const resumeCharCount = resumeText.trim().length;
  const jobCharCount = jobDescription.trim().length;
  const canAnalyze =
    !isAnalyzing &&
    !isExtractingPdf &&
    resumeCharCount >= 80 &&
    jobCharCount >= 40;

  return (
    <section
      aria-label="Resume and job description input"
      className="rounded-xl border border-slate-200 bg-white"
    >
      {/* Top workspace toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            AI Resume Analyzer &amp; ATS Score Checker
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Compare your resume against a target job description for skill alignment, keyword gaps, and honest improvements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <label htmlFor="sample-preset-select" className="font-medium text-slate-700 whitespace-nowrap">
              Try sample:
            </label>
            <select
              id="sample-preset-select"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onLoadSample(e.target.value);
                  e.target.value = "";
                }
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <option value="" disabled>
                Choose preset...
              </option>
              {SAMPLE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <label htmlFor="gemini-model-select" className="font-medium text-slate-700 whitespace-nowrap">
              Model:
            </label>
            <select
              id="gemini-model-select"
              value={selectedModel}
              onChange={(e) => onChangeModel(e.target.value as GeminiModelId)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <option value="gemini-4-hydrogen">Gemini 4 Hydrogen (Balanced)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left: Resume Input */}
        <div className="flex flex-col p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                1. Your Resume
              </h2>
              <p className="text-xs text-slate-500">
                Text-based PDF (up to 30 pages) or pasted plain text
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Resume input method"
              className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={resumeInputMode === "pdf"}
                onClick={() => onChangeResumeInputMode("pdf")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  resumeInputMode === "pdf"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upload PDF
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={resumeInputMode === "text"}
                onClick={() => onChangeResumeInputMode("text")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  resumeInputMode === "text"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          <div className="mt-4 flex-1 flex flex-col">
            {resumeInputMode === "pdf" ? (
              <div className="flex flex-1 flex-col">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="resume-pdf-input"
                />

                {!pdfInfo && !isExtractingPdf ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload PDF resume"
                    className={`flex flex-1 min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
                      isDragging
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <Upload className="h-6 w-6 text-slate-500" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      Drop your PDF resume here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Text-based PDFs up to 10 MB · Unlocked documents only
                    </p>
                    <span className="mt-4 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800">
                      Choose PDF File
                    </span>
                  </div>
                ) : isExtractingPdf ? (
                  <div className="flex flex-1 min-h-[240px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50/60 px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-700" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      Extracting readable text from PDF...
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Reading up to 30 pages
                    </p>
                  </div>
                ) : pdfInfo ? (
                  <div className="flex flex-1 min-h-[240px] flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <FileText
                            className="mt-0.5 h-5 w-5 shrink-0 text-blue-700"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {pdfInfo.fileName}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 tabular-nums">
                              <span>
                                {pdfInfo.pagesProcessed}{" "}
                                {pdfInfo.pagesProcessed === 1 ? "page" : "pages"} read
                                {pdfInfo.totalPages > pdfInfo.pagesProcessed
                                  ? ` of ${pdfInfo.totalPages}`
                                  : ""}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {pdfInfo.charCount.toLocaleString()} characters extracted
                              </span>
                              {pdfInfo.truncated && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-amber-700 font-medium">
                                    Capped at 25,000 chars
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={onClearPdf}
                          aria-label="Remove uploaded PDF"
                          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-900"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <p className="text-xs font-medium text-slate-500">
                          Extracted text preview
                        </p>
                        <p className="mt-1.5 line-clamp-5 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
                          {pdfInfo.text}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
                      <button
                        type="button"
                        onClick={onInspectExtractedText}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        Inspect full ATS-extracted text
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
                      >
                        Replace PDF
                      </button>
                    </div>
                  </div>
                ) : null}

                {pdfError && (
                  <div
                    role="alert"
                    className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                    <span>{pdfError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-1 flex-col">
                <label htmlFor="resume-text-area" className="sr-only">
                  Paste your resume text
                </label>
                <textarea
                  id="resume-text-area"
                  value={resumeText}
                  onChange={(e) => onChangeResumeText(e.target.value)}
                  placeholder="Paste your resume text here (experience, skills, education, projects)..."
                  className="min-h-[240px] w-full flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 tabular-nums">
                  <span>
                    {resumeCharCount.toLocaleString()} / 25,000 characters
                    {resumeCharCount > 0 && resumeCharCount < 80
                      ? " (minimum 80 characters)"
                      : ""}
                  </span>
                  {resumeCharCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onChangeResumeText("")}
                      className="font-medium text-slate-600 hover:text-slate-900"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Job Description */}
        <div className="flex flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                2. Target Job Description
              </h2>
              <p className="text-xs text-slate-500">
                Include responsibilities, required qualifications, and preferred skills
              </p>
            </div>
            {jobCharCount > 0 && (
              <button
                type="button"
                onClick={() => onChangeJobDescription("")}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-1 flex-col">
            <label htmlFor="job-description-area" className="sr-only">
              Paste the job description
            </label>
            <textarea
              id="job-description-area"
              value={jobDescription}
              onChange={(e) => onChangeJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[240px] w-full flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 tabular-nums">
              <span>
                {jobCharCount.toLocaleString()} / 20,000 characters
                {jobCharCount > 0 && jobCharCount < 40
                  ? " (minimum 40 characters)"
                  : ""}
              </span>
              {resumeCharCount >= 80 && resumeInputMode === "pdf" && pdfInfo && (
                <span className="text-emerald-700 font-medium">
                  Resume ready
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action & Privacy Strip */}
      <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-4 rounded-b-xl">
        {analysisError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{analysisError}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="max-w-2xl text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-800">Privacy &amp; Scope:</span>{" "}
            Your resume text is sent to Google&apos;s Gemini API for analysis. Do not upload a resume unless you are comfortable sharing its contents. This prototype does not save uploaded resumes or results to a database, and the score is an AI estimate rather than a real employer ATS score.
          </p>

          <button
            type="button"
            disabled={!canAnalyze}
            onClick={onAnalyze}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Analyzing Resume...
              </>
            ) : (
              <>
                Analyze My Resume
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
