export interface AnalysisSuggestion {
  title: string;
  detail: string;
}

export interface AnalysisResult {
  match_score: number;
  summary: string;
  matched_skills: string[];
  missing_skills: string[];
  keyword_gaps: string[];
  suggestions: AnalysisSuggestion[];
  strengths: string[];
  cautions: string[];
  meta?: {
    model: string;
    resumeCharCount: number;
    jobCharCount: number;
    analyzedAt: string;
  };
}

export interface ExtractedPdfInfo {
  text: string;
  totalPages: number;
  pagesProcessed: number;
  charCount: number;
  fileName: string;
  truncated: boolean;
}

export interface AnalysisRecord {
  id: string;
  createdAt: string;
  resumeLabel: string;
  jobTitlePreview: string;
  model: string;
  resumeText: string;
  jobDescription: string;
  result: AnalysisResult;
  checkedSuggestions: number[];
}

export type GeminiModelId = "gemini-4-hydrogen" | "gemini-3.1-flash-lite";

export type AppView = "analyzer" | "extracted" | "history" | "methodology";
