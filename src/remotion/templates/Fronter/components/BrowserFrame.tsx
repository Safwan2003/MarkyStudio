import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface BrowserFrameProps {
    children: React.ReactNode;
    url?: string;
    style?: React.CSSProperties;
    dark?: boolean;
    mobile?: boolean;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
    children,
    url = 'fronter.ai/dashboard',
    style,
    dark = false,
    mobile = false
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: dark ? '#1e293b' : '#ffffff',
            borderRadius: mobile ? 32 : 16,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            transition: 'border-radius 0.5s ease',
            ...style
        }}>
            {/* Browser Header / URL Bar */}
            {!mobile && (
                <div style={{
                    height: 52,
                    borderBottom: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                    gap: 20,
                    backgroundColor: dark ? '#0f172a' : '#f8fafc',
                    flexShrink: 0
                }}>
                    {/* Traffic Lights */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                    </div>

                    {/* URL Bar */}
                    <div style={{
                        flex: 1,
                        height: 32,
                        backgroundColor: dark ? '#1e293b' : '#ffffff',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: dark ? '#94a3b8' : '#64748b',
                        fontSize: 13,
                        fontWeight: 500,
                        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ opacity: 0.5, marginRight: 4 }}>https://</span>
                        {url}
                    </div>
                </div>
            )}

            {/* Mobile Header (Notch/Status) - Simplified */}
            {mobile && (
                <div style={{
                    height: 44,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backgroundColor: dark ? '#0f172a' : '#fff',
                }}>
                    <div style={{ width: 100, height: 24, background: '#000', borderRadius: 12 }} />
                </div>
            )}

            {/* Content Area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
};
