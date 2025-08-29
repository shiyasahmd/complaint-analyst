
export interface AnalysisResult {
  summary: string[];
  department: string;
  analysis: string;
  solutions: string[];
}

export interface ComplaintHistoryItem {
  id: number;
  complaintText: string;
  analysisResult: AnalysisResult;
  timestamp: string;
}
