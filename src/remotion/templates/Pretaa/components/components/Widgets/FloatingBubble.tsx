import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { WidgetProps } from './types';
import { ComponentOverride } from '../../../types/SceneDirector';
import { LucideIcon, Check, User, Activity, Zap, Shield, Star, BarChart, Rocket, Lock, Trophy, Bell, Heart, Settings } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    check: Check,
    user: User,
    activity: Activity,
    zap: Zap,
    shield: Shield,
    star: Star,
    chart: BarChart,
    rocket: Rocket,
    lock: Lock,
    trophy: Trophy,
    bell: Bell,
    heart: Heart,
    settings: Settings
};

export const FloatingBubble: React.FC<WidgetProps> = ({ data, frame }) => {
    const { fps } = useVideoConfig();
    const style = data.style || {};
    const content = data.content || {};
    const entrance = data.entrance || { type: 'spring_pop', delay: 0, duration: 20 };

    // Entrance Animation calculation
    const delay = entrance.delay || 0;
    const duration = entrance.duration || 20;

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 10, stiffness: 100 }
    });

    const opacity = interpolate(
        frame - delay,
        [0, duration],
        [0, style.opacity ?? 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Idle "floating" animation
    const floatY = Math.sin((frame - delay) * 0.05) * 8;
    const floatRotate = Math.cos((frame - delay) * 0.03) * 2;

    // If frame is before delay (and not using spring which handles negative implicitly for 0), hide it
    if (frame < delay) return null;

    const Icon = content.icon && ICON_MAP[content.icon.toLowerCase()] ? ICON_MAP[content.icon.toLowerCase()] : Check;

    return (
        <div
            style={{
                position: 'absolute',
                left: style.x ?? 100,
                top: style.y ?? 100,
                transform: `scale(${scale}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
                opacity: opacity,
                backgroundColor: style.backgroundColor || 'rgba(255, 255, 255, 0.85)',
                backdropFilter: `blur(${style.blur ?? 20}px)`,
                padding: '12px 24px',
                borderRadius: '50px',
                boxShadow: style.boxShadow || '0 15px 35px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: `1px solid ${style.borderColor || 'rgba(255,255,255,0.7)'}`,
                zIndex: style.zIndex || 100
            }}
        >
            <div style={{
                backgroundColor: style.borderColor || style.color || '#6366f1',
                borderRadius: '50%',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${(style.borderColor || style.color || '#6366f1')}30`
            }}>
                <Icon size={22} color="white" strokeWidth={2.5} />
            </div>
            {content.text && (
                <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: style.fontSize || 18,
                    fontWeight: 600,
                    color: style.textColor || '#1e293b',
                    whiteSpace: 'nowrap'
                }}>
                    {content.text}
                </span>
            )}
        </div>
    );
};
