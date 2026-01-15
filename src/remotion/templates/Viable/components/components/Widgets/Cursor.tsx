import React from 'react';
import { interpolate, useVideoConfig } from 'remotion';
import { WidgetProps } from './types';
import { MousePointer2 } from 'lucide-react';

export const Cursor: React.FC<WidgetProps & { clickFrame?: number }> = ({ data, frame, clickFrame: propClickFrame }) => {
    const style = data.style || {};
    const content = data.content || {};
    const entrance = data.entrance || { type: 'fade', delay: 0, duration: 30 };

    const delay = entrance.delay || 0;
    const duration = entrance.duration || 30;

    // Movement interpolation
    const startX = style.x ?? 0;
    const startY = style.y ?? 0;
    const targetX = (content as any).targetX ?? startX;
    const targetY = (content as any).targetY ?? startY;

    const moveProgress = interpolate(
        frame - delay,
        [0, duration],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const curX = interpolate(moveProgress, [0, 1], [startX, targetX]);
    const curY = interpolate(moveProgress, [0, 1], [startY, targetY]);

    // Click effect (pulsing scale if triggered)
    const clickFrame = propClickFrame ?? (content as any).clickFrame ?? -1;
    const isClicking = clickFrame !== -1 && frame >= clickFrame && frame < clickFrame + 10;
    const clickScale = isClicking ? interpolate(frame - clickFrame, [0, 5, 10], [1, 0.8, 1]) : 1;

    const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp' });

    if (frame < delay) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: curX,
                top: curY,
                zIndex: style.zIndex || 1000,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                transform: `scale(${clickScale})`,
                opacity
            }}
        >
            <MousePointer2
                size={32}
                fill={style.backgroundColor || "#000000"}
                color="white"
                strokeWidth={1}
            />
            {content.text && (
                <div style={{
                    position: 'absolute',
                    left: 24,
                    top: 24,
                    backgroundColor: style.backgroundColor || '#000',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                }}>
                    {content.text}
                </div>
            )}
        </div>
    );
};
