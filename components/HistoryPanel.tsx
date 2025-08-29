
import React from 'react';
import type { ComplaintHistoryItem } from '../types';
import { ClockIcon } from './icons/ClockIcon';

interface HistoryPanelProps {
    history: ComplaintHistoryItem[];
    onSelectItem: (id: number) => void;
    activeId: number | null;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem, activeId }) => {
    return (
        <div className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-xl border border-white/30 flex flex-col min-h-[500px] lg:min-h-[calc(100vh-184px)]">
            <div className="flex items-center mb-4">
                 <div className="bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-full p-2 mr-3 shadow-md">
                    <ClockIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Recent Analyses</h3>
            </div>
            <div className="flex-grow overflow-y-auto -mr-3 pr-3">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        <p className="font-medium">No recent analyses yet.</p>
                        <p className="text-sm">Your analyzed complaints will appear here.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {history.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSelectItem(item.id)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                        activeId === item.id 
                                        ? 'bg-white shadow-md border-blue-400 ring-2 ring-blue-200' 
                                        : 'bg-white/50 border-white/50 hover:bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <p className="font-semibold text-slate-800">{item.analysisResult.department}</p>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-3">
                                        {item.complaintText}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">{item.timestamp}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
