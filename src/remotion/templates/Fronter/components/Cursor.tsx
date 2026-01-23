import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CursorProps {
    x: number;
    y: number;
    color?: string;
    click?: boolean; // Trigger click animation
}

export const Cursor: React.FC<CursorProps> = ({ x, y, color = '#2563EB', click = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Smooth movement logic would typically be handled by the parent moving x/y with springs
    // This component renders the visual cursor at the given absolute coordinates

    const clickScale = click ? 0.8 : 1;

    return (
        <div style={{
            position: 'absolute',
            left: 0, top: 0,
            transform: `translate(${x}px, ${y}px) scale(${clickScale})`,
            zIndex: 9999,
            pointerEvents: 'none',
            transition: 'transform 0.1s ease-out' // Micro-transition for the click scale
        }}>
            {/* SVG Hand Cursor */}
            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
                <path d="M7.82843 3.17157C8.2034 2.7966 8.7121 2.58594 9.24264 2.58594H11C11.6667 2.58594 12.2222 3.01822 12.4286 3.63725L13.5 6.85199V2.58594C13.5 1.75751 14.1716 1.08594 15 1.08594C15.8284 1.08594 16.5 1.75751 16.5 2.58594V10.0859H17.5C18.3284 10.0859 19 10.7575 19 11.5859V15.5859C19 19.4519 15.866 22.5859 12 22.5859H10.5C8.01472 22.5859 6 20.5712 6 18.0859V7.58594C6 6.75751 6.67157 6.08594 7.5 6.08594H7.82843L7.82843 3.17157Z"
                    fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Ripple Effect on Click */}
            {click && (
                <div style={{
                    position: 'absolute',
                    top: -20, left: -20,
                    width: 60, height: 60,
                    borderRadius: '50%',
                    border: `2px solid ${color}`,
                    opacity: 0,
                    animation: 'ripple 0.6s ease-out forwards'
                }}>
                    <style>{`
                        @keyframes ripple {
                            0% { transform: scale(0.5); opacity: 1; }
                            100% { transform: scale(1.5); opacity: 0; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};
