"use client";

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * ZoomCamera Component
 * 
 * Manages smooth pan and zoom effects for the video frame.
 * Uses keyframe-based animation with multiple easing options.
 */

interface ZoomKeyframe {
    frame: number;
    x: number;          // X offset (0 = center)
    y: number;          // Y offset (0 = center)
    scale: number;      // Zoom level (1 = normal)
    rotation?: number;  // Rotation in degrees
}

interface ZoomCameraProps {
    children: React.ReactNode;
    keyframes: ZoomKeyframe[];
    easing?: 'smooth' | 'snappy' | 'elastic' | 'bounce';
    transformOrigin?: string;
}

const getEasing = (type: string) => {
    switch (type) {
        case 'snappy':
            return Easing.bezier(0.4, 0, 0.2, 1);
        case 'elastic':
            return Easing.elastic(1);
        case 'bounce':
            return Easing.bounce;
        default:
            return Easing.bezier(0.25, 0.1, 0.25, 1);
    }
};

export const ZoomCamera: React.FC<ZoomCameraProps> = ({
    children,
    keyframes,
    easing = 'smooth',
    transformOrigin = 'center center'
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Sort keyframes by frame
    const sortedKeyframes = [...keyframes].sort((a, b) => a.frame - b.frame);

    // Find current interpolation
    let currentX = 0;
    let currentY = 0;
    let currentScale = 1;
    let currentRotation = 0;

    if (sortedKeyframes.length === 0) {
        // No keyframes, return children as-is
        return <>{children}</>;
    }

    if (frame <= sortedKeyframes[0].frame) {
        // Before first keyframe
        currentX = sortedKeyframes[0].x;
        currentY = sortedKeyframes[0].y;
        currentScale = sortedKeyframes[0].scale;
        currentRotation = sortedKeyframes[0].rotation || 0;
    } else if (frame >= sortedKeyframes[sortedKeyframes.length - 1].frame) {
        // After last keyframe
        const last = sortedKeyframes[sortedKeyframes.length - 1];
        currentX = last.x;
        currentY = last.y;
        currentScale = last.scale;
        currentRotation = last.rotation || 0;
    } else {
        // Between keyframes - interpolate
        for (let i = 0; i < sortedKeyframes.length - 1; i++) {
            const kf1 = sortedKeyframes[i];
            const kf2 = sortedKeyframes[i + 1];

            if (frame >= kf1.frame && frame <= kf2.frame) {
                const duration = kf2.frame - kf1.frame;
                const progress = (frame - kf1.frame) / duration;

                const easedProgress = interpolate(progress, [0, 1], [0, 1], {
                    easing: getEasing(easing)
                });

                currentX = interpolate(easedProgress, [0, 1], [kf1.x, kf2.x]);
                currentY = interpolate(easedProgress, [0, 1], [kf1.y, kf2.y]);
                currentScale = interpolate(easedProgress, [0, 1], [kf1.scale, kf2.scale]);
                currentRotation = interpolate(
                    easedProgress,
                    [0, 1],
                    [kf1.rotation || 0, kf2.rotation || 0]
                );
                break;
            }
        }
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                transform: `translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${currentRotation}deg)`,
                transformOrigin,
                transition: 'transform 0.05s linear',
            }}>
                {children}
            </div>
        </div>
    );
};

/**
 * Helper: Create zoom keyframes for element focus
 */
export const createElementZoom = (
    elementBounds: { x: number; y: number; width: number; height: number },
    viewportWidth: number,
    viewportHeight: number,
    startFrame: number,
    holdFrames: number,
    zoomScale: number = 1.5
): ZoomKeyframe[] => {
    // Calculate offset to center the element
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const elementCenterX = elementBounds.x + elementBounds.width / 2;
    const elementCenterY = elementBounds.y + elementBounds.height / 2;

    const offsetX = (centerX - elementCenterX) * zoomScale;
    const offsetY = (centerY - elementCenterY) * zoomScale;

    return [
        { frame: startFrame, x: 0, y: 0, scale: 1 },
        { frame: startFrame + 30, x: offsetX, y: offsetY, scale: zoomScale }, // Zoom in
        { frame: startFrame + 30 + holdFrames, x: offsetX, y: offsetY, scale: zoomScale }, // Hold
        { frame: startFrame + 60 + holdFrames, x: 0, y: 0, scale: 1 }, // Zoom out
    ];
};

/**
 * Helper: Create pan-through keyframes for scrolling effect
 */
export const createScrollPan = (
    totalHeight: number,
    viewportHeight: number,
    durationFrames: number,
    startFrame: number = 0
): ZoomKeyframe[] => {
    const maxScroll = totalHeight - viewportHeight;
    const keyframes: ZoomKeyframe[] = [];

    // Create smooth scroll with pauses
    const pausePoints = [0, 0.25, 0.5, 0.75, 1]; // Pause at 0%, 25%, 50%, 75%, 100%

    pausePoints.forEach((point, i) => {
        const scrollY = -maxScroll * point;
        const frameOffset = (durationFrames * point);

        keyframes.push({
            frame: startFrame + frameOffset,
            x: 0,
            y: scrollY,
            scale: 1
        });

        // Add pause frame (hold for 30 frames)
        if (i < pausePoints.length - 1) {
            keyframes.push({
                frame: startFrame + frameOffset + 30,
                x: 0,
                y: scrollY,
                scale: 1
            });
        }
    });

    return keyframes;
};

export default ZoomCamera;
