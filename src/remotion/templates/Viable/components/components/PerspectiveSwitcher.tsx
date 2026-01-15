import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { PerspectiveType } from '../../types/SceneDirector';

interface PerspectiveSwitcherProps {
    perspective?: PerspectiveType;
    children: (perspective: PerspectiveType) => React.ReactNode;
}

export const PerspectiveSwitcher: React.FC<PerspectiveSwitcherProps> = ({ perspective = 'isometric', children }) => {
    const frame = useCurrentFrame();

    // In a full implementation, we could handle morphing here.
    // For now, we provide the directive to children to render the correct "angle".

    return (
        <AbsoluteFill>
            {children(perspective)}
        </AbsoluteFill>
    );
};
