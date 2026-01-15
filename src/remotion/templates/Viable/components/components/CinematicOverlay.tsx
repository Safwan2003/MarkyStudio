import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const CinematicOverlay: React.FC = () => {
    const frame = useCurrentFrame();

    // Subtle grain animation
    const grainOpacity = interpolate(frame % 2, [0, 1], [0.02, 0.04]);

    // Dynamic Light Leak (shimmer effect)
    const leakOpacity = interpolate(
        Math.sin(frame / 45),
        [-1, 1],
        [0.05, 0.15]
    );

    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {/* Vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 100%)',
                mixBlendMode: 'multiply',
                opacity: 0.8
            }} />

            {/* Dynamic Light Leak */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
                opacity: leakOpacity,
                transform: `rotate(${frame / 200}rad)`,
            }} />

            {/* Noise Grain */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: grainOpacity,
                backgroundColor: '#333',
                filter: 'url(#noiseFilter)',
                mixBlendMode: 'overlay'
            }} />

            <svg style={{ visibility: 'hidden', position: 'absolute' }}>
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.75"
                        numOctaves="4"
                        stitchTiles="stitch"
                    />
                </filter>
            </svg>
        </AbsoluteFill>
    );
};
