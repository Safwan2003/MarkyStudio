import { AbsoluteFill, Sequence, useVideoConfig, Audio } from "remotion";
import { Scene, VideoScript } from "@/lib/types";
import React from 'react';

// --- Sub-Templates (Scenes) ---

import { Intro } from "./scenes/Intro";
import { Showcase } from "./scenes/Showcase";

// --- Sub-Templates (Scenes) ---

// FeatureTemplate and DefaultTemplate still inline for now, will move next.


// FeatureTemplate removed - using Showcase


const DefaultTemplate: React.FC<{ scene: Scene }> = ({ scene }) => (
    <AbsoluteFill className="bg-gray-950 flex items-center justify-center">
        <h1 className="text-4xl text-white font-bold">{scene.text}</h1>
    </AbsoluteFill>
);

// --- Master Template ---

export const SaasExplainerTemplate: React.FC<{ script: VideoScript }> = ({ script }) => {
    const { fps } = useVideoConfig();

    let accumulatedFrames = 0;

    return (
        <AbsoluteFill className="bg-black">
            {script.scenes.map((scene, index) => {
                const durationInSeconds = scene.durationInSeconds || 5;
                const durationInFrames = Math.ceil(durationInSeconds * fps);
                const from = accumulatedFrames;
                accumulatedFrames += durationInFrames;

                return (
                    <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
                        {/* Visuals - Selecting the right Scene Template */}
                        {scene.type === 'Intro' && <Intro scene={scene} />}
                        {(scene.type === 'Feature' || scene.type === 'Solution') && <Showcase scene={scene} />}
                        {scene.type !== 'Intro' && scene.type !== 'Feature' && scene.type !== 'Solution' && <DefaultTemplate scene={scene} />}

                        {/* Audio */}
                        {scene.audioUrl && <Audio src={scene.audioUrl} />}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
