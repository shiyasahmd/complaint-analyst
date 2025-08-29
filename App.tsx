
import React, { useState, useCallback } from 'react';
import ComplaintInput from './components/ComplaintInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import HistoryPanel from './components/HistoryPanel';
import { analyzeComplaint } from './services/geminiService';
import type { AnalysisResult, ComplaintHistoryItem } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ComplaintHistoryItem[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<number | null>(null);
  const [complaintInputText, setComplaintInputText] = useState('');

  const activeAnalysis = history.find(item => item.id === activeAnalysisId);


  const handleAnalyze = useCallback(async () => {
    if (!complaintInputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setActiveAnalysisId(null);

    try {
      const result = await analyzeComplaint(complaintInputText);
      const newHistoryItem: ComplaintHistoryItem = {
        id: Date.now(),
        complaintText: complaintInputText,
        analysisResult: result,
        timestamp: new Date().toLocaleString(),
      };

      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
      setActiveAnalysisId(newHistoryItem.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
       setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [complaintInputText]);

  const handleSelectHistory = useCallback((id: number) => {
    const selectedItem = history.find(item => item.id === id);
    if (selectedItem) {
        setActiveAnalysisId(id);
        setComplaintInputText(selectedItem.complaintText);
        setError(null);
    }
  }, [history]);


  const handleClear = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setActiveAnalysisId(null);
    setComplaintInputText('');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-md">
        <div className="max-w-screen-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
           <div className="bg-blue-600 text-white rounded-lg p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Government Complaint Analyst</h1>
            <p className="text-sm text-slate-500">AI-Powered Complaint Resolution Assistant</p>
          </div>
        </div>
      </header>
      <main className="max-w-screen-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ComplaintInput 
                complaintText={complaintInputText}
                onTextChange={setComplaintInputText}
                onAnalyze={handleAnalyze} 
                isLoading={isLoading} 
                onClear={handleClear} 
              />
            </div>
            <div>
              <AnalysisDisplay 
                analysisResult={activeAnalysis?.analysisResult ?? null} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>
          <div className="xl:col-span-1">
             <HistoryPanel 
                history={history}
                onSelectItem={handleSelectHistory}
                activeId={activeAnalysisId}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
