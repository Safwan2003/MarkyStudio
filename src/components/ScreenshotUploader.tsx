'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, RefreshCw, ZoomIn, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedScreenshot {
    id: string;
    file: File;
    preview: string;
    order: number;
    status: 'pending' | 'analyzing' | 'complete' | 'error';
    analysis?: any;
}

interface ScreenshotUploaderProps {
    onUploadComplete?: (files: File[]) => void;
    maxFiles?: number;
    className?: string;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
    onUploadComplete,
    maxFiles = 5,
    className = ''
}) => {
    const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Handle file selection
    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        if (screenshots.length + newFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} screenshots allowed`);
            return;
        }

        const newScreenshots: UploadedScreenshot[] = newFiles.map((file, index) => ({
            id: `${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
            order: screenshots.length + index,
            status: 'pending'
        }));

        setScreenshots(prev => [...prev, ...newScreenshots]);
    }, [screenshots.length, maxFiles]);

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // Remove screenshot
    const removeScreenshot = (id: string) => {
        setScreenshots(prev => {
            const updated = prev.filter(s => s.id !== id);
            return updated.map((s, index) => ({ ...s, order: index }));
        });
    };

    // Remove ALL screenshots
    const clearAll = () => {
        if (confirm('Are you sure you want to clear all images?')) {
            setScreenshots([]);
        }
    };

    // Process uploads / Regenerate
    const handleSubmit = async () => {
        if (screenshots.length === 0) {
            alert('Please upload at least one screenshot');
            return;
        }

        setIsProcessing(true);
        // Reset statuses to 'analyzing'
        setScreenshots(prev => prev.map(s => ({ ...s, status: 'analyzing' })));

        try {
            // Sort by order before submitting
            const orderedFiles = screenshots
                .sort((a, b) => a.order - b.order)
                .map(s => s.file);

            if (onUploadComplete) {
                await onUploadComplete(orderedFiles);
            }

            // Mark all as complete
            setScreenshots(prev => prev.map(s => ({ ...s, status: 'complete' })));
        } catch (error) {
            console.error('Upload/Regen failed:', error);
            setScreenshots(prev => prev.map(s => ({ ...s, status: 'error' })));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Animated Dropzone */}
            <motion.div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{
                    borderColor: isDragging ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                    scale: isDragging ? 1.02 : 1
                }}
                transition={{ duration: 0.2 }}
                className={`
                    relative border-2 border-dashed rounded-2xl p-10 mb-8 cursor-pointer
                    flex flex-col items-center justify-center text-center
                    backdrop-blur-sm transition-colors group
                    ${screenshots.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
                `}
            >
                <input
                    type="file"
                    id="screenshot-input"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={screenshots.length >= maxFiles}
                />

                <label htmlFor="screenshot-input" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500"
                    >
                        <Upload className="w-8 h-8" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-2">Upload Product Screenshots</h3>
                    <p className="text-gray-400 mb-6 max-w-sm">
                        Drag & drop or Click to browse high-res PNG/JPG files
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span>Max {maxFiles} files</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full" />
                        <span>Current: {screenshots.length}</span>
                    </div>
                </label>
            </motion.div>

            {/* Grid Showcase */}
            <AnimatePresence>
                {screenshots.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Your Gallery</h3>
                            <button onClick={clearAll} className="text-gray-400 hover:text-red-400 text-sm flex items-center gap-1 transition-colors">
                                <Trash2 className="w-4 h-4" /> Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {screenshots.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40"
                                >
                                    <img src={s.preview} alt="screenshot" className="w-full h-full object-cover" />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setPreviewImage(s.preview)}
                                            className="p-2 bg-white/10 hover:bg-blue-500 text-white rounded-full transition-colors"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeScreenshot(s.id)}
                                            className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="absolute top-2 right-2">
                                        {s.status === 'analyzing' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                                        {s.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                        {s.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                                    </div>

                                    {/* Index Badge */}
                                    <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center bg-black/60 rounded-md text-xs font-mono text-white/70">
                                        {i + 1}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Action Bar */}
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className={`
                                    flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                                    ${isProcessing
                                        ? 'bg-gray-800 text-gray-400 cursor-wait'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Analyzing Screenshots...
                                    </>
                                ) : (
                                    <>
                                        {screenshots.some(s => s.status === 'complete') ? <RefreshCw className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        {screenshots.some(s => s.status === 'complete') ? 'Regenerate Analysis' : 'Generate Showcase'}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox Preview */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewImage(null)}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={previewImage}
                            className="max-w-full max-h-full rounded-lg shadow-2xl"
                            alt="Preview"
                        />
                        <button className="absolute top-8 right-8 text-white/50 hover:text-white">
                            <X className="w-8 h-8" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
