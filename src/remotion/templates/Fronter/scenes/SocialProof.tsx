
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene } from '@/lib/types';
import { ThemeStyles } from '../components/ThemeEngine';
import { BrowserFrame } from '../components/BrowserFrame';
import { Github, Slack, Figma, Twitter, Linkedin, Cloud, Database, Globe } from 'lucide-react';

const IntegrationLogo = ({ Icon, x, y, delay, color, size = 80 }: any) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = spring({ frame: frame - delay, fps, config: { stiffness: 120, damping: 14 } });

    // Magnetic float effect attracting to center
    const floatX = Math.sin((frame + delay * 10) / 45) * 10;
    const floatY = Math.cos((frame + delay * 10) / 50) * 10;

    if (frame < delay) return null;

    return (
        <div style={{
            position: 'absolute',
            left: x, top: y,
            transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) scale(${scale})`,
            width: size, height: size,
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 20
        }}>
            <Icon size={size * 0.55} color={color} fill={color} style={{ fillOpacity: 0.1 }} />
        </div>
    );
};

const ConnectionLine = ({ start, end, delay }: any) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = spring({ frame: frame - delay, fps, config: { stiffness: 40 } });

    // Calculate SVG path
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
            <line
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - progress)}
                strokeLinecap="round"
            />
        </svg>
    );
};

export const SocialProof: React.FC<{ scene: Scene, themeStyles: ThemeStyles }> = ({ scene, themeStyles }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Central Hub Animation
    const hubScale = spring({ frame: frame - 10, fps });

    // Integration Positions (Orbiting the center)
    const centerX = width / 2;
    const centerY = height / 2;
    const items = [
        { Icon: Github, color: '#171515', x: centerX - 350, y: centerY - 150, delay: 20 },
        { Icon: Slack, color: '#4A154B', x: centerX + 350, y: centerY - 150, delay: 25 },
        { Icon: Figma, color: '#F24E1E', x: centerX - 350, y: centerY + 150, delay: 30 },
        { Icon: Database, color: '#0061e0', x: centerX + 350, y: centerY + 150, delay: 35 },
        { Icon: Cloud, color: '#2563EB', x: centerX, y: centerY - 300, delay: 40 },
        { Icon: Globe, color: '#10B981', x: centerX, y: centerY + 300, delay: 45 },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#f8fafc', overflow: 'hidden' }}>

            {/* Background Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#e2e8f0 2px, transparent 2px)', backgroundSize: '50px 50px', opacity: 0.6 }} />

            {/* Connecting Lines */}
            {items.map((item, i) => (
                <ConnectionLine
                    key={i}
                    start={{ x: item.x, y: item.y }}
                    end={{ x: centerX, y: centerY }}
                    delay={item.delay + 10}
                />
            ))}

            {/* Central Hub (Fronter Browser) */}
            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: `translate(-50%, -50%) scale(${hubScale})`,
                zIndex: 30,
                filter: 'drop-shadow(0 30px 60px rgba(37, 99, 235, 0.15))'
            }}>
                <div style={{ width: 600, height: 400 }}>
                    <BrowserFrame style={{ border: `4px solid ${themeStyles.colors.primary}` }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: themeStyles.colors.primary, marginBottom: 10 }}>Fronter</div>
                            <div style={{ fontSize: 16, color: '#64748b' }}>Integration Hub</div>
                            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                                <div style={{ width: 40, height: 6, borderRadius: 3, background: '#e2e8f0' }} />
                                <div style={{ width: 40, height: 6, borderRadius: 3, background: '#e2e8f0' }} />
                                <div style={{ width: 120, height: 6, borderRadius: 3, background: '#e2e8f0' }} />
                            </div>
                        </div>
                    </BrowserFrame>
                </div>
            </div>

            {/* Orbiting Icons */}
            {items.map((item, i) => (
                <IntegrationLogo key={i} {...item} />
            ))}

            {/* Text Overlay */}
            <div style={{
                position: 'absolute', bottom: 80, width: '100%', textAlign: 'center',
                opacity: interpolate(frame, [50, 70], [0, 1])
            }}>
                <h2 style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {scene.mainText || "Connects with everything."}
                </h2>
            </div>

        </AbsoluteFill>
    );
};
