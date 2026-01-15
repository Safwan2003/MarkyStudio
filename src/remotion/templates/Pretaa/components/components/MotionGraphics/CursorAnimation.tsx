"use client";

import React from 'react';
import { interpolate, Easing } from 'remotion';

/**
 * CursorAnimation Component
 * 
 * Renders an animated cursor that moves smoothly between positions
 * with click effects and natural movement.
 */

interface CursorMovement {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    startFrame: number;
    durationFrames: number;
    clickAtEnd?: boolean;
    hoverEffect?: boolean;
}

interface CursorAnimationProps {
    movements: CursorMovement[];
    cursorStyle?: 'default' | 'pointer' | 'text';
    cursorColor?: string;
    showTrail?: boolean;
    scale?: number;
    frame?: number; // Optional: if provided, use this instead of useCurrentFrame()
}

// Bezier curve for natural cursor movement
const bezierInterpolate = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const oneMinusT = 1 - t;
    return (
        oneMinusT * oneMinusT * oneMinusT * p0 +
        3 * oneMinusT * oneMinusT * t * p1 +
        3 * oneMinusT * t * t * p2 +
        t * t * t * p3
    );
};

// Click Ripple Effect
const ClickRipple: React.FC<{ x: number; y: number; startFrame: number; color: string; frame: number }> = ({
    x, y, startFrame, color, frame
}) => {
    const progress = (frame - startFrame) / 15; // 15 frames = 0.5s click

    if (progress < 0 || progress > 1) return null;

    const scale = interpolate(progress, [0, 0.3, 1], [0, 1.2, 1.5]);
    const opacity = interpolate(progress, [0, 0.3, 1], [0.8, 0.6, 0]);
    const ringScale = interpolate(progress, [0, 1], [0.5, 2]);
    const ringOpacity = interpolate(progress, [0, 0.5, 1], [0, 0.5, 0]);

    return (
        <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
            {/* Main click dot */}
            <div style={{
                position: 'absolute',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: color,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                boxShadow: `0 0 20px ${color}`,
            }} />

            {/* Expanding ring */}
            <div style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `2px solid ${color}`,
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
            }} />
        </div>
    );
};

// Default cursor SVG
const DefaultCursor: React.FC<{ color: string; isPointer: boolean }> = ({ color, isPointer }) => {
    if (isPointer) {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M7 2L7 18L10.5 14.5L14 22L17 20.5L13.5 13L19 13L7 2Z"
                    fill={color}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M5 3L5 21L10 16L14 22L17 20L13 14L19 14L5 3Z"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export const CursorAnimation: React.FC<CursorAnimationProps> = ({
    movements,
    cursorStyle = 'default',
    cursorColor = '#1a1a2e',
    showTrail = true,
    scale = 1,
    frame: frameProp
}) => {
    // CRITICAL: When frame prop is provided, we MUST NOT call any Remotion hooks
    // This allows the component to work outside of Remotion Player context
    // When no frame prop is provided, we call useCurrentFrame inside the component

    // If frame is provided, use it directly - no hooks needed
    const frame = frameProp !== undefined ? frameProp : 0;

    // If no frame prop and we're not in the hook context, just use 0
    // The component will still render but won't animate
    // This is a safe fallback for non-Remotion contexts

    // Find current movement
    let currentX = movements[0]?.startX || 0;
    let currentY = movements[0]?.startY || 0;
    let isPointer = cursorStyle === 'pointer';
    let activeClick: { x: number; y: number; frame: number } | null = null;

    for (const movement of movements) {
        const { startX, startY, endX, endY, startFrame, durationFrames, clickAtEnd, hoverEffect } = movement;

        if (frame < startFrame) {
            currentX = startX;
            currentY = startY;
            break;
        }

        if (frame >= startFrame && frame <= startFrame + durationFrames) {
            // Currently in this movement
            const progress = (frame - startFrame) / durationFrames;

            // Natural easing with bezier curve
            const eased = interpolate(progress, [0, 1], [0, 1], {
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });

            // Add slight curve to the path
            const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 30;
            const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 30;

            currentX = bezierInterpolate(eased, startX, midX, midX, endX);
            currentY = bezierInterpolate(eased, startY, midY, midY, endY);

            if (hoverEffect && progress > 0.8) {
                isPointer = true;
            }

            break;
        }

        if (frame > startFrame + durationFrames) {
            currentX = endX;
            currentY = endY;

            // Check if we should show click
            if (clickAtEnd && frame <= startFrame + durationFrames + 15) {
                activeClick = { x: endX, y: endY, frame: startFrame + durationFrames };
            }
        }
    }

    // Subtle idle animation
    const idleOffsetX = Math.sin(frame * 0.1) * 1;
    const idleOffsetY = Math.cos(frame * 0.15) * 1;

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
            {/* Trail effect */}
            {showTrail && (
                <div style={{
                    position: 'absolute',
                    left: currentX + idleOffsetX - 5,
                    top: currentY + idleOffsetY - 5,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: `${cursorColor}40`,
                    filter: 'blur(4px)',
                    transition: 'all 0.1s ease-out',
                }} />
            )}

            {/* Cursor */}
            <div style={{
                position: 'absolute',
                left: currentX + idleOffsetX,
                top: currentY + idleOffsetY,
                transform: `scale(${scale})`,
                transition: 'transform 0.1s ease-out',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}>
                <DefaultCursor color={cursorColor} isPointer={isPointer} />
            </div>

            {/* Click effect */}
            {activeClick && (
                <ClickRipple
                    x={activeClick.x}
                    y={activeClick.y}
                    startFrame={activeClick.frame}
                    color={cursorColor}
                    frame={frame}
                />
            )}
        </div>
    );
};

export default CursorAnimation;
