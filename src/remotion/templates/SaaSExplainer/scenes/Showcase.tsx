import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Scene } from "@/lib/types";
import { BrowserFrame } from "@/remotion/components/BrowserFrame";
import { Cursor } from "@/remotion/components/Cursor";

export const Showcase: React.FC<{ scene: Scene }> = ({ scene }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Fade in browser
    const opacity = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        config: { damping: 100 }
    });

    // Scale up browser
    const scale = spring({
        frame,
        fps,
        from: 0.8,
        to: 1, // Full screenish
    });

    // Cursor Movement Logic
    // Start: Bottom Right, End: Center (Submit Button)
    // Approximate coords for 1920x1080 center inside a browser frame
    const startX = width * 0.8;
    const startY = height * 0.8;
    const endX = width * 0.5;
    const endY = height * 0.55; // Slightly below center for button

    // Move cursor from 20% to 50% of duration
    const duration = scene.durationInSeconds * fps;
    const moveStart = duration * 0.2;
    const moveEnd = duration * 0.5;

    const cursorX = interpolate(frame, [moveStart, moveEnd], [startX, endX], {
        extrapolateRight: "clamp",
    });

    const cursorY = interpolate(frame, [moveStart, moveEnd], [startY, endY], {
        extrapolateRight: "clamp",
    });

    // Click Animation
    const clickStart = moveEnd + 5;
    const isClicking = frame >= clickStart && frame < clickStart + 10;

    // Button Reaction
    const buttonScale = spring({
        frame: frame - clickStart,
        fps,
        from: 1,
        to: isClicking ? 0.95 : 1,
        config: { stiffness: 200 }
    });

    return (
        <AbsoluteFill className="bg-slate-950 flex items-center justify-center">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />

            <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }} className="items-center justify-center p-20">
                <BrowserFrame className="w-full max-w-5xl h-3/4 shadow-2xl" datasetName="Overview - Dashboard">
                    {/* Mockup Content: Login Form */}
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                            <p className="text-gray-500">Sign in to your account</p>
                        </div>

                        <div className="w-96 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                                <div className="h-10 w-full bg-gray-200 rounded border border-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Password</label>
                                <div className="h-10 w-full bg-gray-200 rounded border border-gray-300" />
                            </div>

                            <button
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-lg transition-transform"
                                style={{ transform: `scale(${buttonScale})` }}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </BrowserFrame>
            </AbsoluteFill>

            {/* The Magic Hand */}
            <Cursor
                x={cursorX}
                y={cursorY}
                click={isClicking}
            />

        </AbsoluteFill>
    );
};
