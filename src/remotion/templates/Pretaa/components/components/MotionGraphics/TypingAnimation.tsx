"use client";

import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface TypingAnimationProps {
    x: number;
    y: number;
    text: string;
    startFrame: number;
    durationFrames?: number; // Total duration to type all text
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    showCursor?: boolean;
    style?: React.CSSProperties;
    width?: number; // Optional width constraint for input fields
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
    x,
    y,
    text,
    startFrame,
    durationFrames = 30,
    fontSize = 16,
    color = '#1f2937',
    fontFamily = 'monospace',
    showCursor = true,
    style,
    width
}) => {
    const frame = useCurrentFrame();
    
    // Calculate progress
    const progress = interpolate(
        frame,
        [startFrame, startFrame + durationFrames],
        [0, text.length],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    
    const currentLength = Math.floor(progress);
    const currentText = text.substring(0, currentLength);
    
    // Blinking cursor effect (every 15 frames)
    const isCursorVisible = showCursor && frame >= startFrame && Math.floor(frame / 15) % 2 === 0;

    // Don't render if we haven't started
    if (frame < startFrame) return null;

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            width: width,
            pointerEvents: 'none',
            zIndex: 100, // Above content, below mouse cursor
            ...style
        }}>
            <span style={{ 
                color, 
                fontSize, 
                fontFamily,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.2
            }}>
                {currentText}
            </span>
            {isCursorVisible && (
                <span style={{
                    display: 'inline-block',
                    width: 2,
                    height: fontSize * 1.2,
                    backgroundColor: color,
                    marginLeft: 1,
                    verticalAlign: 'text-bottom'
                }} />
            )}
        </div>
    );
};
