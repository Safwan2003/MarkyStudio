import React from 'react';
import { interpolate, useVideoConfig } from 'remotion';
import { WidgetProps } from './types';

export const NeonLine: React.FC<WidgetProps> = ({ data, frame }) => {
    const { fps } = useVideoConfig();
    const style = data.style || {};
    const entrance = data.entrance || { type: 'fade', delay: 0, duration: 30 };

    // Neon lines typically need a start and end point.
    // The LayoutPlan style might provide x, y (start) and width, height (or rotation) to define coordinates.
    // Or content could specify 'toX', 'toY'.
    // Let's assume style.x/y is start, and we use rotation/length approach for simplicity or content.toX/Y.
    const toX = (data.content as any)?.toX ?? ((style.x || 0) + (style.width || 100));
    const toY = (data.content as any)?.toY ?? ((style.y || 0) + (style.height || 0));

    const delay = entrance.delay || 0;
    const duration = entrance.duration || 30;

    // Animate drawing the line
    const progress = interpolate(
        frame - delay,
        [0, duration],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * (2 - t) }
    );

    if (frame < delay) return null;

    const length = Math.sqrt(Math.pow(toX - (style.x || 0), 2) + Math.pow(toY - (style.y || 0), 2));
    const angle = Math.atan2(toY - (style.y || 0), toX - (style.x || 0)) * 180 / Math.PI;

    return (
        <div
            style={{
                position: 'absolute',
                left: style.x ?? 0,
                top: style.y ?? 0,
                width: length,
                height: style.borderWidth ?? 4,
                backgroundColor: style.borderColor || '#6366f1',
                transformOrigin: '0 50%',
                transform: `rotate(${angle}deg) scaleX(${progress})`,
                borderRadius: 4,
                boxShadow: `0 0 ${style.blur ?? 10}px ${style.borderColor || '#6366f1'}, 0 0 ${2 * (style.blur ?? 10)}px ${style.borderColor || '#6366f1'}`,
                opacity: style.opacity ?? 1,
                zIndex: style.zIndex || 50
            }}
        />
    );
};
