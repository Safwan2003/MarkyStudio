import React from 'react';
import { spring, useVideoConfig, interpolate } from 'remotion';
import { WidgetProps } from './types';

export const DataCard: React.FC<WidgetProps> = ({ data, frame }) => {
    const { fps } = useVideoConfig();
    const style = data.style || {};
    const content = data.content || {};
    const entrance = data.entrance || { type: 'scale', delay: 0, duration: 30 };

    const delay = entrance.delay || 0;

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12 }
    });

    if (frame < delay) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: style.x ?? 100,
                top: style.y ?? 100,
                width: style.width ?? 200,
                background: style.backgroundColor || 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                borderRadius: style.borderRadius ?? 16,
                padding: '20px',
                boxShadow: style.boxShadow || '0 20px 40px -5px rgba(0,0,0,0.1)',
                transform: `scale(${scale})`,
                opacity: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: style.zIndex || 90,
                border: `1px solid ${style.borderColor || 'rgba(255,255,255,0.7)'}`,
            }}
        >
            <div style={{
                fontSize: 14,
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {content.text || 'Metric'}
            </div>
            <div style={{
                fontSize: 42,
                fontWeight: 800,
                color: style.textColor || style.color || '#0f172a',
                lineHeight: 1
            }}>
                {content.value || '0%'}
            </div>
            <div style={{
                height: 4,
                width: '100%',
                backgroundColor: '#e2e8f0',
                borderRadius: 2,
                marginTop: 8,
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: '75%', // Mock progress
                    backgroundColor: style.borderColor || style.color || '#10b981',
                    borderRadius: 2
                }} />
            </div>
        </div>
    );
};
