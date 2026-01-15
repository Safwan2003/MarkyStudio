import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { WidgetProps } from './types';

export const FeatureDetail: React.FC<WidgetProps> = ({ data, frame }) => {
    const { fps } = useVideoConfig();
    const style = data.style || {};
    const content = data.content || {};
    const entrance = data.entrance || { type: 'scale', delay: 0, duration: 25 };

    const delay = entrance.delay || 0;

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15 }
    });

    if (frame < delay) return null;

    return (
        <div style={{
            position: 'absolute',
            left: style.x ?? 0,
            top: style.y ?? 0,
            zIndex: style.zIndex || 95
        }}>
            {/* Connector Line */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: '100%',
                width: 40,
                height: 2,
                backgroundColor: style.borderColor || '#cbd5e1',
                transformOrigin: 'right center',
                transform: `scaleX(${scale})`,
            }} />

            {/* Tooltip Body */}
            <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'left center',
                backgroundColor: style.backgroundColor || '#1e293b',
                color: 'white',
                padding: '12px 16px',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                minWidth: 200,
                borderLeft: `4px solid ${style.borderColor || '#3b82f6'}`
            }}>
                <div style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 4
                }}>
                    {content.text || 'Feature Highlight'}
                </div>
                {content.value && (
                    <div style={{
                        fontSize: 13,
                        color: '#94a3b8',
                        lineHeight: 1.4
                    }}>
                        {content.value}
                    </div>
                )}
            </div>
        </div>
    );
};
