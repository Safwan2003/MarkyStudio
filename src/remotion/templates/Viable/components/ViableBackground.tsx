import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { createColorPalette } from '../styleGuide';

interface ViableBackgroundProps {
    phase?: 'chaos' | 'transition' | 'order';
    accentColor?: string;
}

export const ViableBackground: React.FC<ViableBackgroundProps> = ({
    phase = 'order',
    accentColor = '#8b5cf6'
}) => {
    const frame = useCurrentFrame();
    const palette = createColorPalette(accentColor);

    // Color definitions from palette
    const bgColors = palette.background;

    // Animated Blobs setup
    const blob1X = interpolate(frame, [0, 240], [20, 80], { extrapolateRight: 'clamp' });
    const blob1Y = interpolate(frame, [0, 200], [30, 70], { extrapolateRight: 'clamp' });
    const blob2X = interpolate(frame, [0, 300], [75, 25], { extrapolateRight: 'clamp' });
    const blob2Y = interpolate(frame, [0, 260], [65, 35], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill>
            {/* Base Light Gradient */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 20% 30%, ${bgColors.start} 0%, ${bgColors.mid} 50%, ${bgColors.end} 100%)`
            }} />

            {/* Animated Brand Blobs */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}>
                {/* Primary Accent Blob */}
                <div style={{
                    position: 'absolute',
                    left: `${blob1X}%`,
                    top: `${blob1Y}%`,
                    width: '900px',
                    height: '900px',
                    background: `radial-gradient(circle, ${bgColors.blobs[0]} 0%, transparent 70%)`,
                    filter: 'blur(100px)',
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'multiply',
                    opacity: 0.6
                }} />

                {/* Secondary Accent Blob */}
                <div style={{
                    position: 'absolute',
                    left: `${blob2X}%`,
                    top: `${blob2Y}%`,
                    width: '800px',
                    height: '800px',
                    background: `radial-gradient(circle, ${bgColors.blobs[1]} 0%, transparent 70%)`,
                    filter: 'blur(120px)',
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'multiply',
                    opacity: 0.4
                }} />
            </div>

            {/* Premium Noise / Paper Texture Overlay */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.04,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
            }} />

            {/* Thin Border Frame */}
            <div style={{
                position: 'absolute',
                inset: '20px',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '24px',
                pointerEvents: 'none'
            }} />
        </AbsoluteFill>
    );
};
