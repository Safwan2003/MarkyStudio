
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene } from '@/lib/types';
import { ThemeStyles } from '../components/ThemeEngine';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTA = ({ scene, themeStyles }: { scene: Scene, themeStyles: ThemeStyles }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entrance
    const brandEntrance = spring({ frame, fps, config: { damping: 15 } });

    // Background particles
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        x: (Math.sin(i * 123) * 0.5 + 0.5) * 1920,
        y: (Math.cos(i * 456) * 0.5 + 0.5) * 1080,
        size: Math.sin(i * 789) * 4 + 2,
        opacity: Math.sin(frame / 20 + i) * 0.5 + 0.5
    }));

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>

            {/* ATMOSPHERIC GLOWS */}
            <div style={{
                position: 'absolute', width: 1200, height: 1200,
                background: `radial-gradient(circle, ${themeStyles.colors.primary}22 0%, transparent 70%)`,
                filter: 'blur(150px)',
                opacity: 0.6,
                top: '50%', left: '50%',
                transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame / 40) * 0.2})`
            }} />

            {/* PARTICLES */}
            {particles.map((p, i) => (
                <div key={i} style={{
                    position: 'absolute', left: p.x, top: p.y,
                    width: p.size, height: p.size,
                    backgroundColor: themeStyles.colors.primary,
                    borderRadius: '50%',
                    opacity: p.opacity,
                    boxShadow: `0 0 10px ${themeStyles.colors.primary}`
                }} />
            ))}

            {/* CONTENT */}
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    transform: `scale(${brandEntrance})`,
                    textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    {/* Final Logo Animation */}
                    <div style={{
                        width: 180, height: 180,
                        borderRadius: 48,
                        backgroundColor: themeStyles.colors.primary,
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        marginBottom: 60,
                        boxShadow: `0 30px 60px ${themeStyles.colors.primary}44`,
                        position: 'relative'
                    }}>
                        <span style={{ color: 'white', fontSize: 100, fontWeight: 900 }}>f</span>
                        <div style={{ position: 'absolute', top: -20, right: -20, color: themeStyles.colors.primary }}>
                            <Sparkles size={60} fill={themeStyles.colors.primary} />
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 140, fontWeight: 950, color: 'white',
                        letterSpacing: '-0.04em', lineHeight: 1,
                        marginBottom: 30
                    }}>
                        fronter<span style={{ color: themeStyles.colors.primary }}>.ai</span>
                    </h1>

                    <p style={{
                        fontSize: 36, color: '#9ca3af', fontWeight: 500,
                        maxWidth: 1000, margin: '0 auto 80px'
                    }}>
                        {scene.mainText || "The operating system for modern agencies."}
                    </p>

                    {/* Primary CTA Button */}
                    <div style={{
                        padding: '35px 85px',
                        backgroundColor: themeStyles.colors.primary,
                        borderRadius: 100,
                        color: 'white', fontSize: 40, fontWeight: 900,
                        display: 'flex', alignItems: 'center', gap: 20,
                        boxShadow: `0 25px 50px ${themeStyles.colors.primary}66`,
                        transform: `scale(${1 + Math.sin(frame / 15) * 0.05})`
                    }}>
                        {scene.ctaText || "Try for free"} <ArrowRight size={45} strokeWidth={3} />
                    </div>
                </div>
            </AbsoluteFill>

        </AbsoluteFill>
    );
};
