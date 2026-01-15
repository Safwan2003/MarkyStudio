import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const KineticText: React.FC<{ text: string; subText?: string }> = ({ text, subText }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        from: 0.5,
        to: 1,
        config: {
            damping: 12,
            stiffness: 100,
        }
    });

    const opacity = spring({
        frame: frame - 10,
        fps,
        from: 0,
        to: 1,
    });

    return (
        <AbsoluteFill className="flex flex-col items-center justify-center bg-black">
            <h1
                style={{ transform: `scale(${scale})` }}
                className="text-8xl font-black text-white text-center leading-tight tracking-tighter"
            >
                {text.toUpperCase()}
            </h1>
            {subText && (
                <h2
                    style={{ opacity }}
                    className="text-4xl font-bold text-blue-500 mt-8 tracking-widest uppercase"
                >
                    {subText}
                </h2>
            )}

            {/* Background embellishments (Grid) */}
            <div className="absolute inset-0 -z-10 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
        </AbsoluteFill>
    );
};
