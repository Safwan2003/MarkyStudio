import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoScript, ThemeStyles } from '@/lib/types';

import { Intro } from './scenes/Intro';
import { Problem } from './scenes/Problem';
import { Solution } from './scenes/Solution';
import { Showcase } from './scenes/Showcase';
import { CTA } from './scenes/CTA';

// Default Theme 
const getTheme = (script: VideoScript): ThemeStyles => {
    const global = script?.globalDesign || {};
    return {
        primary: global.primaryColor || '#2563EB',
        secondary: global.secondaryColor || '#1E293B',
        accent: global.accentColor || '#F59E0B',
        background: global.backgroundColor || '#FFFFFF',
        text: global.textColor || '#0F172A',
        headingFont: global.headingFont || 'Inter',
        bodyFont: global.bodyFont || 'Inter',
        borderRadius: global.borderRadius || '24px'
    };
};

export const FronterTemplate: React.FC<{ plan: VideoScript }> = ({ plan }) => {
    const frame = useCurrentFrame();
    const themeStyles = getTheme(plan);

    // Safety check
    if (!plan || !plan.scenes) {
        return <AbsoluteFill style={{ backgroundColor: 'black', color: 'white', justifyContent: 'center', alignItems: 'center' }}>No Script Data</AbsoluteFill>;
    }

    // Sequence Logic
    let currentSceneComponent = null;
    let startFrame = 0;

    for (const scene of plan.scenes) {
        const duration = (scene.duration || 5) * 30; // 30fps default

        // Is this the active scene?
        if (frame >= startFrame && frame < startFrame + duration) {

            // Map scene type to Component
            switch (scene.type) {
                case 'hook':
                case 'intro':
                    currentSceneComponent = <Intro scene={scene} themeStyles={themeStyles} />;
                    break;
                case 'problem':
                    currentSceneComponent = <Problem scene={scene} themeStyles={themeStyles} />;
                    break;
                case 'solution':
                    currentSceneComponent = <Solution scene={scene} themeStyles={themeStyles} />;
                    break;
                case 'showcase':
                    currentSceneComponent = <Showcase scene={scene} themeStyles={themeStyles} />;
                    break;
                case 'cta':
                    currentSceneComponent = <CTA scene={scene} themeStyles={themeStyles} />;
                    break;
                default:
                    currentSceneComponent = (
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                            <h1 style={{ color: 'white' }}>Unknown Scene Type: {scene.type}</h1>
                        </AbsoluteFill>
                    );
            }
            break;
        }
        startFrame += duration;
    }

    return (
        <AbsoluteFill>
            {currentSceneComponent}
        </AbsoluteFill>
    );
};
