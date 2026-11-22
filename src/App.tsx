import { useRef, useState } from "react";
import { Header } from "./components/Header";
import { InputWorkbench } from "./components/InputWorkbench";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { ExtractedTextView } from "./components/ExtractedTextView";
import { SessionHistoryView } from "./components/SessionHistoryView";
import { MethodologyView } from "./components/MethodologyView";
import { SAMPLE_PRESETS } from "./data/samplePresets";
import type {
  AnalysisRecord,
  AnalysisResult,
  AppView,
  ExtractedPdfInfo,
  GeminiModelId,
} from "./types/analysis";

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("analyzer");
  const [resumeInputMode, setResumeInputMode] = useState<"pdf" | "text">("pdf");
  const [resumeText, setResumeText] = useState("");
  const [pdfInfo, setPdfInfo] = useState<ExtractedPdfInfo | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [jobDescription, setJobDescription] = useState("");
  const [selectedModel, setSelectedModel] =
    useState<GeminiModelId>("gemini-4-hydrogen");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(
    null
  );
  const [checkedSuggestions, setCheckedSuggestions] = useState<number[]>([]);

  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleUploadPdf = async (file: File) => {
    setPdfError(null);
    setAnalysisError(null);
    setIsExtractingPdf(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as Partial<ExtractedPdfInfo> & {
        error?: string;
      };

      if (!response.ok || !payload.text) {
        throw new Error(payload.error || "Could not extract text from PDF.");
      }

      const info: ExtractedPdfInfo = {
        text: payload.text,
        totalPages: payload.totalPages ?? 1,
        pagesProcessed: payload.pagesProcessed ?? 1,
        charCount: payload.charCount ?? payload.text.length,
        fileName: payload.fileName ?? file.name,
        truncated: Boolean(payload.truncated),
      };

      setPdfInfo(info);
      setResumeText(info.text);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to process PDF file.";
      setPdfError(message);
      setPdfInfo(null);
      setResumeText("");
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleClearPdf = () => {
    setPdfInfo(null);
    setPdfError(null);
    setResumeText("");
  };

  const handleLoadSample = (presetId?: string) => {
    const preset =
      SAMPLE_PRESETS.find((item) => item.id === presetId) ?? SAMPLE_PRESETS[0];
    setPdfInfo(null);
    setPdfError(null);
    setAnalysisError(null);
    setResumeInputMode("text");
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setActiveView("analyzer");
  };

  const handleAnalyze = async () => {
    setAnalysisError(null);
    setIsAnalyzing(true);
    setCheckedSuggestions([]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          model: selectedModel,
        }),
      });

      const payload = (await response.json()) as AnalysisResult & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Analysis failed. Please try again.");
      }

      setCurrentResult(payload);

      const firstJobLine =
        jobDescription
          .split(/\r?\n/)
          .map((l) => l.trim())
          .find(Boolean) || "Job Description";

      const resumeLabel =
        resumeInputMode === "pdf" && pdfInfo
          ? pdfInfo.fileName
          : "Pasted Resume Text";

      const record: AnalysisRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        resumeLabel,
        jobTitlePreview: firstJobLine.slice(0, 70),
        model: selectedModel,
        resumeText,
        jobDescription,
        result: payload,
        checkedSuggestions: [],
      };

      setHistory((prev) => [record, ...prev]);
      setActiveRecordId(record.id);

      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Analysis failed. Please verify your connection and try again.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleSuggestion = (index: number) => {
    setCheckedSuggestions((prev) => {
      const next = prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index];

      if (activeRecordId) {
        setHistory((records) =>
          records.map((rec) =>
            rec.id === activeRecordId
              ? { ...rec, checkedSuggestions: next }
              : rec
          )
        );
      }

      return next;
    });
  };

  const handleSelectHistoryRecord = (record: AnalysisRecord) => {
    setResumeInputMode("text");
    setPdfInfo(null);
    setPdfError(null);
    setAnalysisError(null);
    setResumeText(record.resumeText);
    setJobDescription(record.jobDescription);
    setSelectedModel(
      record.model === "gemini-3.1-flash-lite"
        ? "gemini-3.1-flash-lite"
        : "gemini-4-hydrogen"
    );
    setCurrentResult(record.result);
    setCheckedSuggestions(record.checkedSuggestions);
    setActiveRecordId(record.id);
    setActiveView("analyzer");
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeRecordId === id) {
      setActiveRecordId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onLoadDefaultSample={() => handleLoadSample()}
        historyCount={history.length}
        hasExtractedText={resumeText.trim().length > 0}
      />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 sm:px-6 py-8">
        {activeView === "analyzer" && (
          <div className="space-y-8">
            <InputWorkbench
              resumeInputMode={resumeInputMode}
              onChangeResumeInputMode={(mode) => {
                setResumeInputMode(mode);
                setPdfError(null);
              }}
              resumeText={resumeText}
              onChangeResumeText={(text) => {
                setResumeText(text);
                if (pdfInfo && text !== pdfInfo.text) {
                  setPdfInfo(null);
                }
              }}
              pdfInfo={pdfInfo}
              isExtractingPdf={isExtractingPdf}
              pdfError={pdfError}
              onUploadPdf={handleUploadPdf}
              onClearPdf={handleClearPdf}
              jobDescription={jobDescription}
              onChangeJobDescription={setJobDescription}
              selectedModel={selectedModel}
              onChangeModel={setSelectedModel}
              onLoadSample={(id) => handleLoadSample(id)}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
              onInspectExtractedText={() => setActiveView("extracted")}
            />

            <div ref={resultsRef}>
              <ResultsDashboard
                result={currentResult}
                isLoading={isAnalyzing}
                checkedSuggestions={checkedSuggestions}
                onToggleSuggestion={handleToggleSuggestion}
                onLoadSample={() => handleLoadSample()}
              />
            </div>
          </div>
        )}

        {activeView === "extracted" && (
          <ExtractedTextView
            resumeText={resumeText}
            pdfInfo={pdfInfo}
            onBackToAnalyzer={() => setActiveView("analyzer")}
          />
        )}

        {activeView === "history" && (
          <SessionHistoryView
            records={history}
            activeRecordId={activeRecordId}
            onSelectRecord={handleSelectHistoryRecord}
            onDeleteRecord={handleDeleteHistoryRecord}
            onClearAll={() => {
              setHistory([]);
              setActiveRecordId(null);
            }}
            onGoToAnalyzer={() => setActiveView("analyzer")}
          />
        )}

        {activeView === "methodology" && (
          <MethodologyView onBackToAnalyzer={() => setActiveView("analyzer")} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-slate-500">
          <span>
            Use this as a coaching aid. Always verify the analysis and never add false information to a resume.
          </span>
          <span>No resumes or results are saved to a database.</span>
        </div>
      </footer>
    </div>
  );
}
