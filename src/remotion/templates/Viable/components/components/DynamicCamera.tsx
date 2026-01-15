import React from 'react';
import { AbsoluteFill, interpolate, Easing, useVideoConfig } from 'remotion';

interface CameraSpec {
    initialZoom: number;
    targetZoom: number;
    panX: number;
    panY: number;
    duration: number;
    easing: 'linear' | 'ease-in-out' | 'elastic';
}

interface DynamicCameraProps {
    camera?: CameraSpec;
    frame: number;
    children: React.ReactNode;
}

export const DynamicCamera: React.FC<DynamicCameraProps> = ({ camera, frame, children }) => {
    const { width, height } = useVideoConfig();

    if (!camera) return <>{children}</>;

    // 1. Easing selection
    let easingFn = Easing.bezier(0.42, 0, 0.58, 1); // Default ease-in-out
    if (camera.easing === 'linear') easingFn = Easing.linear;
    if (camera.easing === 'elastic') easingFn = Easing.elastic(1.2);

    // 2. Interpolation
    const duration = camera.duration || 150;
    const progress = interpolate(frame, [0, duration], [0, 1], {
        extrapolateRight: 'clamp',
        easing: easingFn
    });

    const zoom = interpolate(progress, [0, 1], [camera.initialZoom || 1, camera.targetZoom || 1]);
    const panX = interpolate(progress, [0, 1], [0, camera.panX || 0]);
    const panY = interpolate(progress, [0, 1], [0, camera.panY || 0]);

    // 3. Transform Application
    // We apply pan relative to the center
    return (
        <div style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transformOrigin: 'center center',
            transition: 'none' // We handle every frame
        }}>
            {children}
        </div>
    );
};
