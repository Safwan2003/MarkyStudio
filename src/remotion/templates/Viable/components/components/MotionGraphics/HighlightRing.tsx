"use client";

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * HighlightRing Component
 * 
 * Creates animated highlight effects around UI elements.
 * Supports multiple visual styles: pulse, glow, outline, spotlight.
 */

interface HighlightRingProps {
    x: number;
    y: number;
    width: number;
    height: number;
    startFrame: number;
    durationFrames: number;
    style?: 'pulse' | 'glow' | 'outline' | 'spotlight';
    color?: string;
    borderRadius?: number | string;
}

export const HighlightRing: React.FC<HighlightRingProps> = ({
    x,
    y,
    width,
    height,
    startFrame,
    durationFrames,
    style = 'pulse',
    color = '#6366f1',
    borderRadius: rawBorderRadius = 8
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const parseRadius = (val: number | string): number => {
        if (typeof val === 'number') return val;
        return parseInt(val) || 8;
    };
    const borderRadius = parseRadius(rawBorderRadius);

    const progress = (frame - startFrame) / durationFrames;

    // Not visible before start or after end
    if (progress < 0 || progress > 1) return null;

    // Fade in and out
    const fadeIn = interpolate(progress, [0, 0.1], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(progress, [0.9, 1], [1, 0], { extrapolateLeft: 'clamp' });
    const visibility = fadeIn * fadeOut;

    // Padding around element
    const padding = 8;

    const renderPulse = () => {
        const pulseScale = 1 + Math.sin(frame * 0.3) * 0.05;
        const pulseOpacity = 0.5 + Math.sin(frame * 0.3) * 0.3;

        return (
            <>
                {/* Outer pulse ring 1 */}
                <div style={{
                    position: 'absolute',
                    left: x - padding * 2,
                    top: y - padding * 2,
                    width: width + padding * 4,
                    height: height + padding * 4,
                    borderRadius: borderRadius + padding,
                    border: `3px solid ${color}`,
                    opacity: pulseOpacity * visibility * 0.5,
                    transform: `scale(${pulseScale * 1.1})`,
                    pointerEvents: 'none',
                }} />

                {/* Main border */}
                <div style={{
                    position: 'absolute',
                    left: x - padding,
                    top: y - padding,
                    width: width + padding * 2,
                    height: height + padding * 2,
                    borderRadius: borderRadius + padding / 2,
                    border: `3px solid ${color}`,
                    opacity: visibility,
                    boxShadow: `0 0 20px ${color}80, inset 0 0 10px ${color}40`,
                    pointerEvents: 'none',
                }} />
            </>
        );
    };

    const renderGlow = () => {
        const glowIntensity = 0.5 + Math.sin(frame * 0.2) * 0.3;

        return (
            <div style={{
                position: 'absolute',
                left: x - padding,
                top: y - padding,
                width: width + padding * 2,
                height: height + padding * 2,
                borderRadius: borderRadius + padding / 2,
                background: `${color}30`,
                boxShadow: `
                    0 0 ${30 * glowIntensity}px ${color}60,
                    0 0 ${60 * glowIntensity}px ${color}40,
                    0 0 ${90 * glowIntensity}px ${color}20
                `,
                opacity: visibility,
                pointerEvents: 'none',
            }} />
        );
    };

    const renderOutline = () => {
        // Animated dashed border
        const dashOffset = frame * 2;

        return (
            <svg
                style={{
                    position: 'absolute',
                    left: x - padding,
                    top: y - padding,
                    width: width + padding * 2,
                    height: height + padding * 2,
                    opacity: visibility,
                    pointerEvents: 'none',
                    overflow: 'visible',
                }}
            >
                <rect
                    x={1.5}
                    y={1.5}
                    width={width + padding * 2 - 3}
                    height={height + padding * 2 - 3}
                    rx={borderRadius}
                    ry={borderRadius}
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    strokeDasharray="10 5"
                    strokeDashoffset={dashOffset}
                    style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                />
            </svg>
        );
    };

    const renderSpotlight = () => {
        return (
            <>
                {/* Dimmed background overlay */}
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    opacity: visibility,
                    pointerEvents: 'none',
                    clipPath: `polygon(
                        0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                        ${x - padding}px ${y - padding}px,
                        ${x - padding}px ${y + height + padding}px,
                        ${x + width + padding}px ${y + height + padding}px,
                        ${x + width + padding}px ${y - padding}px,
                        ${x - padding}px ${y - padding}px
                    )`,
                }} />

                {/* Spotlight border */}
                <div style={{
                    position: 'absolute',
                    left: x - padding,
                    top: y - padding,
                    width: width + padding * 2,
                    height: height + padding * 2,
                    borderRadius: borderRadius + padding / 2,
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 30px ${color}80`,
                    opacity: visibility,
                    pointerEvents: 'none',
                }} />
            </>
        );
    };

    switch (style) {
        case 'glow':
            return renderGlow();
        case 'outline':
            return renderOutline();
        case 'spotlight':
            return renderSpotlight();
        default:
            return renderPulse();
    }
};

/**
 * Helper: Create highlight for detected UI element
 */
export const createHighlightFromBounds = (
    bounds: { x: number; y: number; width: number; height: number },
    startFrame: number,
    durationSeconds: number,
    options?: Partial<HighlightRingProps>
): HighlightRingProps => {
    return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        startFrame,
        durationFrames: durationSeconds * 30,
        style: 'pulse',
        color: '#6366f1',
        borderRadius: 8,
        ...options
    };
};

export default HighlightRing;
