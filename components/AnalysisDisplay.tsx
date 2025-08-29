
import React, { useState, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface AnalysisDisplayProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-white/30 rounded-2xl">
                <div className="flex items-center">
                    <div className="h-12 w-12 bg-white/50 rounded-full"></div>
                    <div className="ml-4 h-6 bg-white/50 rounded-md w-1/3"></div>
                </div>
                <div className="mt-4 pl-16 space-y-2">
                    <div className="h-4 bg-white/50 rounded-md w-full"></div>
                    <div className="h-4 bg-white/50 rounded-md w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);

const useCopyToClipboard = (): [boolean, (text: string) => Promise<void>] => {
    const [isCopied, setIsCopied] = useState(false);

    const copy = async (text: string) => {
        if (!navigator.clipboard) {
            console.warn('Clipboard not supported');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

    return [isCopied, copy];
};


const AnalysisCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  copyText?: string;
  isVisible: boolean;
  animationDelay: string;
}> = ({ icon, title, children, copyText, isVisible, animationDelay }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isCopied, copy] = useCopyToClipboard();

    return (
        <div 
            className={`bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/30 transition-all duration-500 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
        >
            <div className="relative">
                <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-controls={`card-content-${title.replace(/\s+/g, '-')}`}
                >
                    <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-3 mr-4 shadow-md">
                            {icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {copyText && (
                   <button 
                       onClick={() => copy(copyText)}
                       aria-label={`Copy ${title} to clipboard`}
                       className="absolute -top-2 -right-2 p-2 rounded-full text-slate-500 bg-white/50 hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                   >
                       {isCopied 
                           ? <CheckIcon className="w-5 h-5 text-green-600" /> 
                           : <ClipboardIcon className="w-5 h-5" />
                       }
                   </button>
               )}
            </div>
            <div
                id={`card-content-${title.replace(/\s+/g, '-')}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="text-slate-700 leading-relaxed pl-16">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisResult, isLoading, error }) => {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
      if (analysisResult) {
          // Use a timeout to allow the component to render before starting the animation
          const timer = setTimeout(() => setShowResults(true), 100);
          return () => clearTimeout(timer);
      } else {
          setShowResults(false);
      }
  }, [analysisResult]);
  
  if (isLoading) {
    return (
      <div className="bg-transparent p-6 rounded-2xl">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100/50 backdrop-blur-xl p-6 rounded-2xl border border-red-200/50 flex items-center justify-center">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-800">Analysis Failed</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl border-2 border-dashed border-white/40 min-h-[500px] lg:min-h-[calc(100vh-184px)] flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-30 animate-pulse"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-700">Awaiting Analysis</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          Provide a complaint on the left and click "Analyze" to see the intelligent breakdown here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <AnalysisCard 
            icon={<DocumentTextIcon className="h-6 w-6" />} 
            title="Complaint Summary"
            copyText={analysisResult.summary.join('\n')}
            isVisible={showResults}
            animationDelay="0ms"
        >
            <ul className="list-disc pl-5 space-y-2">
                {analysisResult.summary.map((point, index) => <li key={index}>{point}</li>)}
            </ul>
        </AnalysisCard>
        
        <AnalysisCard 
            icon={<BuildingOfficeIcon className="h-6 w-6" />} 
            title="Relevant Department"
            copyText={analysisResult.department}
            isVisible={showResults}
            animationDelay="100ms"
        >
            <p className="text-lg font-medium text-indigo-700">{analysisResult.department}</p>
        </AnalysisCard>

        <AnalysisCard 
            icon={<ScaleIcon className="h-6 w-6" />} 
            title="Rules & Regulations Analysis"
            copyText={analysisResult.analysis}
            isVisible={showResults}
            animationDelay="200ms"
        >
            <p>{analysisResult.analysis}</p>
        </AnalysisCard>

        <AnalysisCard 
            icon={<LightBulbIcon className="h-6 w-6" />} 
            title="Proposed Solutions"
            copyText={analysisResult.solutions.join('\n')}
            isVisible={showResults}
            animationDelay="300ms"
        >
            <ul className="list-disc pl-5 space-y-2">
                {analysisResult.solutions.map((solution, index) => <li key={index}>{solution}</li>)}
            </ul>
        </AnalysisCard>
    </div>
  );
};

export default AnalysisDisplay;
