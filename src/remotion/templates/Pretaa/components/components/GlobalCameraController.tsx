import React, { createContext, useContext, useMemo } from 'react';
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Easing
} from 'remotion';
import { CommercialPlan } from '../../types';

interface CameraState {
    zoom: number;
    panX: number;
    panY: number;
    rotateX: number;
    rotateY: number;
}

const CameraContext = createContext<CameraState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotateX: 0,
    rotateY: 0,
});

export const useGlobalCamera = () => useContext(CameraContext);

interface GlobalCameraControllerProps {
    children: React.ReactNode;
    plan?: CommercialPlan; // Updated to use CommercialPlan
}

/**
 * GlobalCameraController - Orchestrates camera movements based on the Director's Plan.
 * Uses procedural animation to move between "Visual Anchors" defined by the Scout/Strategist.
 */
export const GlobalCameraController: React.FC<GlobalCameraControllerProps> = ({
    children,
    plan
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const cameraState = useMemo(() => {
        if (!plan || !plan.scenes) return { zoom: 1, panX: 0, panY: 0, rotateX: 0, rotateY: 0 };

        // 1. Find Active Scene & Previous Scene
        let currentScene = plan.scenes[0];
        let previousScene: any = null;
        let sceneStartFrame = 0;
        let accumulatedFrames = 0;

        for (const scene of plan.scenes) {
            const durationSec = scene.duration || 5;
            const duration = Math.floor(durationSec * 30);

            if (frame >= accumulatedFrames && frame < accumulatedFrames + duration) {
                currentScene = scene;
                sceneStartFrame = accumulatedFrames;
                break;
            }
            previousScene = scene;
            accumulatedFrames += duration;
        }

        // Helper: Calculate Target Camera State for a specific Scene
        const getSceneTarget = (scene: any) => {
            if (!scene) return { zoom: 1, x: 0, y: 0 };

            // FLUX ENGINE: Motion Locking
            // Pretaa templates have aggressive internal animation. Lock global camera to prevent "sea-sickness".
            if (scene.templateId && scene.templateId.startsWith('pretaa')) {
                return { zoom: 1, x: 0, y: 0 };
            }

            // A. Visual Anchor (Agentic)
            if (scene.visualAnchorId && plan.visualAnchors) {
                const anchor = plan.visualAnchors[scene.visualAnchorId];
                if (anchor?.rect) {
                    const anchorWidth = anchor.rect.width || 100;
                    // Smart Scale: Smaller elements get more zoom
                    const idealScale = (width * 0.5) / anchorWidth;
                    const scale = Math.min(Math.max(idealScale, 1.2), 3.0);

                    const anchorCenterX = (anchor.rect.x || 0) + anchorWidth / 2;
                    const anchorCenterY = (anchor.rect.y || 0) + (anchor.rect.height || 100) / 2;

                    return {
                        zoom: scale,
                        x: (width / 2) / scale - anchorCenterX,
                        y: (height / 2) / scale - anchorCenterY
                    };
                }
            }

            // B. Manual Layout Plan
            if (scene.director?.layoutPlan?.camera) {
                const cam = scene.director.layoutPlan.camera;
                return {
                    zoom: cam.targetZoom || 1,
                    x: cam.panX || 0,
                    y: cam.panY || 0
                };
            }

            return { zoom: 1, x: 0, y: 0 }; // Default
        };

        const currentTarget = getSceneTarget(currentScene);
        const prevTarget = previousScene ? getSceneTarget(previousScene) : { zoom: 1, x: 0, y: 0 };

        // 2. Continuous Fluid Transition Logic
        // Instead of starting from 0, we start from the *Previous Scene's Target*.

        const videoScene = currentScene as any;
        const transition = videoScene.transition || { durationInFrames: 30, type: 'cut' };
        const transitionDuration = transition.type === 'cut' ? 0 : (transition.durationInFrames || 30);

        const framesIntoScene = frame - sceneStartFrame;

        // If defined transition, interpolate from Prev -> Curr
        if (framesIntoScene < transitionDuration && previousScene) {
            const progress = interpolate(
                framesIntoScene,
                [0, transitionDuration],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1) }
            );

            // "Flux" Interpolation
            return {
                zoom: interpolate(progress, [0, 1], [prevTarget.zoom, currentTarget.zoom]),
                panX: interpolate(progress, [0, 1], [prevTarget.x, currentTarget.x]),
                panY: interpolate(progress, [0, 1], [prevTarget.y, currentTarget.y]),
                rotateX: 0,
                rotateY: 0
            };
        }

        // Post-Transition: Hold/Drift on Current Target
        // Add subtle drift for "Alive" feel
        const drift = Math.sin(frame * 0.05) * 5;

        return {
            zoom: currentTarget.zoom,
            panX: currentTarget.x + drift * 0.1, // Micro-pan
            panY: currentTarget.y + drift * 0.1,
            rotateX: 0,
            rotateY: 0,
        };
    }, [frame, plan, width, height]);

    return (
        <CameraContext.Provider value={cameraState}>
            <AbsoluteFill style={{
                transform: `scale(${cameraState.zoom}) translate(${cameraState.panX}px, ${cameraState.panY}px)`,
                transformOrigin: '50% 50%', // Zoom from center
                perspective: '1000px',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    // Optional 3D tilt can be added here
                    transform: `rotateX(${cameraState.rotateX}deg) rotateY(${cameraState.rotateY}deg)`,
                }}>
                    {children}
                </div>
            </AbsoluteFill>
        </CameraContext.Provider>
    );
};
