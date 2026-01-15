import React from 'react';

interface ParallaxWrapperProps {
    zIndex?: number;
    cameraOffset?: { x: number; y: number };
    children: React.ReactNode;
}

export const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ zIndex = 0, cameraOffset = { x: 0, y: 0 }, children }) => {
    // Depth intensity based on zIndex
    // higher z-index = "closer" to camera = moves more
    const depthFactor = (zIndex - 50) / 100; // Normalized around z=50

    const parallaxX = cameraOffset.x * depthFactor * 0.5;
    const parallaxY = cameraOffset.y * depthFactor * 0.5;

    return (
        <div style={{
            transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            transition: 'none'
        }}>
            {children}
        </div>
    );
};
