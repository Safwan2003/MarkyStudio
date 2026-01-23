
import { AbsoluteFill, useVideoConfig, useCurrentFrame } from 'remotion';
import { getThemeStyles } from './components/ThemeEngine';
import { Intro } from './scenes/Intro';
import { Problem } from './scenes/Problem';
import { Solution } from './scenes/Solution';
import { Showcase } from './scenes/Showcase';
import { CTA } from './scenes/CTA';
import { VideoScript } from '@/lib/types';

export const FronterTemplate = ({ plan }: { plan: VideoScript }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const brand = plan?.globalDesign?.primaryColor || '#2563EB';
    const themeStyles = getThemeStyles(brand);

    const scenes = plan?.scenes || [];

    // Duration Logic: Dynamic pacing based on scene.duration
    if (scenes.length === 0) return <AbsoluteFill style={{ backgroundColor: '#000' }} />;

    let currentScene = scenes[0];
    let startFrame = 0;

    for (const scene of scenes) {
        const duration = (scene.duration || 5) * 30; // 30fps default
        if (frame >= startFrame && frame < startFrame + duration) {
            currentScene = scene;
            break;
        }
        startFrame += duration;
    }

    // Safety check: if frame exceeds total duration, show last scene
    if (frame >= startFrame + (currentScene.duration || 5) * 30) {
        currentScene = scenes[scenes.length - 1];
    }

    return (
        <AbsoluteFill style={{ backgroundColor: themeStyles.colors.background }}>
            {currentScene.type === 'hook' && <Intro scene={currentScene} themeStyles={themeStyles} />}
            {currentScene.type === 'problem' && <Problem scene={currentScene} themeStyles={themeStyles} />}
            {currentScene.type === 'solution' && <Solution scene={currentScene} themeStyles={themeStyles} />}
            {currentScene.type === 'showcase' && <Showcase scene={currentScene} themeStyles={themeStyles} />}
            {currentScene.type === 'cta' && <CTA scene={currentScene} themeStyles={themeStyles} />}
        </AbsoluteFill>
    );
};
