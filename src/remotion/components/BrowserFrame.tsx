import React from 'react';

export const BrowserFrame: React.FC<{
    children: React.ReactNode;
    className?: string;
    datasetName?: string; // e.g. "Create File"
}> = ({ children, className, datasetName }) => {
    return (
        <div className={`relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 ${className}`}>
            {/* Header / Traffic Lights */}
            <div className="h-8 bg-gray-800/80 backdrop-blur-sm flex items-center px-4 space-x-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />

                {datasetName && (
                    <div className="ml-4 flex-1 text-center">
                        <span className="text-xs text-gray-400 font-medium font-mono">{datasetName}</span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="relative w-full h-full bg-white dark:bg-slate-950">
                {children}
            </div>
        </div>
    );
};
