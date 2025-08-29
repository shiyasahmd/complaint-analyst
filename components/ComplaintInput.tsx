
import React, { useState, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { extractTextFromFile } from '../services/geminiService';


interface ComplaintInputProps {
  complaintText: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
}

const ComplaintInput: React.FC<ComplaintInputProps> = ({ complaintText, onTextChange, onAnalyze, isLoading, onClear }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeClick = () => {
    if (complaintText.trim()) {
      onAnalyze();
    }
  };

  const handleExampleClick = () => {
    setExtractionError(null);
    onTextChange(
      "To the Municipal Corporation,\n\nI am writing to report a recurring issue of improper garbage disposal and overflowing public bins in the Park Street area, specifically near the community center. For the past three months, the waste collection has been infrequent, leading to piles of garbage on the sidewalks. This is causing a severe public health hazard, attracting pests, and creating an unbearable stench.\n\nDespite multiple calls to the local sanitation office (Ref: #2354, #2411), no permanent solution has been provided. The bins are too small for the neighborhood's needs and are not emptied on schedule. According to municipal by-law 7.4 concerning public sanitation, waste must be collected at least three times a week in residential zones. This is clearly not happening.\n\nWe request immediate action to clear the existing garbage, install larger bins, and ensure a regular collection schedule is strictly followed."
    );
  };

  const handleMalayalamExampleClick = () => {
    setExtractionError(null);
    onTextChange(
      "മുനിസിപ്പൽ കോർപ്പറേഷന്,\n\nപാർക്ക് സ്ട്രീറ്റ് ഏരിയയിലെ, പ്രത്യേകിച്ച് കമ്മ്യൂണിറ്റി സെന്ററിനടുത്തുള്ള, മാലിന്യം തെറ്റായി നിക്ഷേപിക്കുന്നതും പൊതു മാലിന്യപ്പെട്ടികൾ കവിഞ്ഞൊഴുകുന്നതുമായ സ്ഥിരം പ്രശ്നം റിപ്പോർട്ട് ചെയ്യാൻ ഞാൻ ആഗ്രഹിക്കുന്നു. കഴിഞ്ഞ മൂന്ന് മാസമായി, മാലിന്യ ശേഖരണം വളരെ കുറവാണ്, ഇത് നടപ്പാതകളിൽ മാലിന്യങ്ങൾ കുന്നുകൂടാൻ കാരണമാകുന്നു. ഇത് ഗുരുതരമായ ഒരു പൊതുജനാരോഗ്യ ഭീഷണിയാണ്, കീടങ്ങളെ ആകർഷിക്കുകയും അസഹനീയമായ ദുർഗന്ധം സൃഷ്ടിക്കുകയും ചെയ്യുന്നു.\n\nപ്രാദേശിക ശുചീകരണ ഓഫീസിലേക്ക് പലതവണ വിളിച്ചിട്ടും (റഫറൻസ്: #2354, #2411), ഒരു ശാശ്വത പരിഹാരവും ലഭിച്ചിട്ടില്ല. ഈ പ്രദേശത്തെ ആവശ്യങ്ങൾക്ക് മാലിന്യപ്പെട്ടികൾ വളരെ ചെറുതാണ്, അവ കൃത്യസമയത്ത് കാലിയാക്കുന്നുമില്ല. പൊതു ശുചീകരണവുമായി ബന്ധപ്പെട്ട മുനിസിപ്പൽ നിയമത്തിലെ 7.4 വകുപ്പ് പ്രകാരം, ജനവാസ മേഖലകളിൽ ആഴ്ചയിൽ മൂന്ന് തവണയെങ്കിലും മാലിന്യം ശേഖരിക്കണം. ഇത് വ്യക്തമായും നടക്കുന്നില്ല.\n\nനിലവിലുള്ള മാലിന്യം ഉടൻ നീക്കം ചെയ്യാനും, വലിയ മാലിന്യപ്പെട്ടികൾ സ്ഥാപിക്കാനും, കൃത്യമായ ശേഖരണ ഷെഡ്യൂൾ കർശനമായി പാലിക്കുന്നുണ്ടെന്ന് ഉറപ്പാക്കാനും ഞങ്ങൾ അടിയന്തിര നടപടി അഭ്യർത്ഥിക്കുന്നു."
    );
  };
  
  const handleClearClick = () => {
    onClear();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setExtractionError('File type not supported. Please upload an image or PDF file.');
            return;
        }

        setIsExtracting(true);
        setExtractionError(null);
        onTextChange('');
        
        try {
            const extractedText = await extractTextFromFile(file);
            onTextChange(extractedText);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during text extraction.";
            setExtractionError(errorMessage);
        } finally {
            setIsExtracting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }
  };


  const anyLoading = isLoading || isExtracting;

  return (
    <div className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-xl border border-white/30 flex flex-col min-h-[650px] lg:h-[calc(100vh-184px)]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf"
        disabled={anyLoading}
      />
      <label htmlFor="complaint-text" className="text-lg font-semibold text-slate-800 mb-3">
        Citizen Complaint Text
      </label>
      <div className="relative flex-grow">
        <textarea
          id="complaint-text"
          value={complaintText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste the full text of the complaint here (English or Malayalam), or upload an image or PDF..."
          className="w-full h-full p-4 rounded-lg border border-slate-300/50 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-slate-700 leading-relaxed placeholder:text-slate-500"
          disabled={anyLoading}
        />
        {isExtracting && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-slate-600 font-medium">Extracting text from file...</p>
           </div>
        )}
      </div>
      {extractionError && (
        <div className="mt-2 text-sm text-red-700 bg-red-100/50 border border-red-200/50 p-3 rounded-md">
            <strong>Extraction Failed:</strong> {extractionError}
        </div>
      )}
       <div className="mt-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <button
          onClick={handleAnalyzeClick}
          disabled={anyLoading || !complaintText.trim()}
          className="w-full sm:w-auto flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
             <>
               <SparklesIcon className="h-5 w-5 mr-2" />
               Analyze Complaint
            </>
          )}
        </button>
        <button
          onClick={handleUploadClick}
          disabled={anyLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300/70 text-base font-medium rounded-md text-slate-700 bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors duration-200"
        >
           <PaperClipIcon className="h-5 w-5 mr-2" />
           Upload File
        </button>
        <button
          onClick={handleExampleClick}
          disabled={anyLoading}
          className="w-full sm:w-auto px-4 py-3 border border-slate-300/70 text-base font-medium rounded-md text-slate-700 bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Example (EN)
        </button>
        <button
          onClick={handleMalayalamExampleClick}
          disabled={anyLoading}
          className="w-full sm:w-auto px-4 py-3 border border-slate-300/70 text-base font-medium rounded-md text-slate-700 bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Example (ML)
        </button>
         <button
          onClick={handleClearClick}
          disabled={anyLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-slate-300/70 text-base font-medium rounded-md text-slate-700 bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Clear input and results"
        >
          <XCircleIcon className="h-5 w-5 mr-2" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default ComplaintInput;