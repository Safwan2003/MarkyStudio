'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Code, Sparkles, MousePointer, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subscene } from '@/lib/types';

interface SubscenePreviewProps {
    subscenes: Subscene[];
    originalScreenshots: string[]; // URLs to original screenshots
    onApprove: () => void;
    onReject: () => void;
}

export const SubscenePreview: React.FC<SubscenePreviewProps> = ({
    subscenes,
    originalScreenshots,
    onApprove,
    onReject
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

    const currentSubscene = subscenes[currentIndex];
    const currentScreenshot = originalScreenshots[currentIndex];

    if (!currentSubscene) return null;

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-white/5 px-8 py-5 border-b border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            AI Generation Review
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Step {currentIndex + 1} of {subscenes.length}: Verify precision and interactivity
                        </p>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'preview'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Eye className="w-4 h-4" />
                            Visual Preview
                        </button>
                        <button
                            onClick={() => setViewMode('code')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'code'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            Code Inspector
                        </button>
                    </div>
                </div>
            </div>

            {/* Subscene Navigation */}
            <div className="flex items-center gap-2 px-8 py-4 bg-black/40 border-b border-white/5 overflow-x-auto scrollbar-hide">
                {subscenes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`
                            px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                            ${currentIndex === index
                                ? 'bg-white/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }
                        `}
                    >
                        Scene {index + 1}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="p-8 bg-black/20 min-h-[600px]">
                <AnimatePresence mode="wait">
                    {viewMode === 'preview' ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Comparison Columns */}
                            <div className="flex flex-col gap-12">
                                {/* Original */}
                                <div className="flex flex-col h-[700px] bg-[#111] rounded-2xl border border-white/10 overflow-hidden group hover:border-blue-500/30 transition-colors">
                                    <div className="px-5 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
                                            <span className="font-semibold text-gray-200">Original Screenshot</span>
                                        </div>
                                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px] font-mono tracking-wider">SOURCE</span>
                                    </div>
                                    <div className="flex-1 relative p-6 flex items-center justify-center bg-[url('/grid-pattern.svg')]">
                                        <img
                                            src={currentScreenshot}
                                            alt="Original"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Generated */}
                                <div className="flex flex-col h-[700px] bg-[#111] rounded-2xl border border-white/10 overflow-hidden group hover:border-green-500/30 transition-colors relative">
                                    <div className="px-5 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></div>
                                            <span className="font-semibold text-gray-200">Interactive Preview</span>
                                        </div>
                                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded text-[10px] font-mono tracking-wider flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> LIVE RENDER
                                        </span>
                                    </div>
                                    <div className="flex-1 relative bg-white overflow-hidden">
                                        {(!currentSubscene.html) && (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-10">
                                                <span>Waiting for generation...</span>
                                            </div>
                                        )}
                                        <iframe
                                            srcDoc={`
                                                <!DOCTYPE html>
                                                <html>
                                                <head>
                                                    <style>
                                                        html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
                                                        .vision-root { transform-origin: top left; }
                                                        ${currentSubscene.css || ''}
                                                    </style>
                                                </head>
                                                <body>${currentSubscene.html || ''}</body>
                                                </html>
                                            `}
                                            className="w-full h-full border-0 transform scale-[0.9] origin-top-left"
                                            style={{ width: '111.1%', height: '111.1%' }}
                                            title="Preview"
                                        />

                                        {/* Overlay Hint */}
                                        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-white/10">
                                            <MousePointer className="w-3 h-3" />
                                            Interactable
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Dashboard */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#111] rounded-xl p-5 border border-white/10 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">AI Confidence</p>
                                        <p className="text-2xl font-bold text-white">
                                            {Math.round((currentSubscene.metadata?.analysisConfidence || 0.85) * 100)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-[#111] rounded-xl p-5 border border-white/10 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Duration</p>
                                        <p className="text-2xl font-bold text-white">{currentSubscene.duration}s</p>
                                    </div>
                                </div>
                                <div className="bg-[#111] rounded-xl p-5 border border-white/10 flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Interactions</p>
                                        <p className="text-2xl font-bold text-white">{currentSubscene.interactions.length}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 h-[500px]">
                                <div className="border-r border-white/10 flex flex-col">
                                    <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">HTML Structure</div>
                                    <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-blue-300 scrollbar-thin scrollbar-thumb-white/10">
                                        {currentSubscene.html}
                                    </pre>
                                </div>
                                <div className="flex flex-col">
                                    <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">CSS Styles</div>
                                    <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-pink-300 scrollbar-thin scrollbar-thumb-white/10">
                                        {currentSubscene.css}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interaction Timeline */}
                <div className="mt-8 bg-[#111] rounded-2xl border border-white/10 p-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <MousePointer className="w-4 h-4 text-blue-500" /> Interaction Timeline
                    </h4>
                    <div className="space-y-3 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[85px] top-2 bottom-2 w-px bg-white/10"></div>

                        {currentSubscene.interactions.map((interaction, idx) => (
                            <div key={idx} className="flex items-center gap-6 text-sm relative z-10">
                                <span className="w-16 text-right font-mono text-gray-500 text-xs">{(interaction.frame / 30).toFixed(1)}s</span>
                                <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#111]"></div>
                                <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                                    <span className="text-gray-300">{interaction.description}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold
                                        ${interaction.action === 'click' ? 'bg-blue-500/20 text-blue-400' :
                                            interaction.action === 'hover' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-gray-500/20 text-gray-400'}`}>
                                        {interaction.action}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="bg-[#0A0A0A] p-6 border-t border-white/10 flex items-center justify-between sticky bottom-0 z-20">
                <button
                    onClick={onReject}
                    className="px-6 py-3 rounded-xl font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition flex items-center gap-2"
                >
                    <XCircle className="w-5 h-5" />
                    Discard & Retry
                </button>
                <button
                    onClick={onApprove}
                    className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    <CheckCircle2 className="w-5 h-5" />
                    Approve & Generate Video
                </button>
            </div>
        </div>
    );
};
