import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene, ThemeStyles } from '@/lib/types';
import { BrandIcons } from '../components/BrandIcons';

export const CTA: React.FC<{ scene: Scene, themeStyles: ThemeStyles }> = ({ scene, themeStyles }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // --- TIMELINE ---
    const logoDuration = 20;
    const textStart = 15;
    const buttonStart = 35;

    // --- ANIMATIONS ---

    // Logo Reveal
    const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
    const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
    const logoY = interpolate(logoSpring, [0, 1], [50, 0]);
    const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

    // Text Stagger
    const titleWords = (scene.mainText || "Ready to grow your business?").split(" ");

    // Button
    const buttonSpring = spring({ frame: frame - buttonStart, fps, config: { damping: 12 } });

    // Background Mesh Animation
    const meshRotate = frame * 0.2;
    const meshScale = Math.sin(frame / 100) * 0.1 + 1.2;

    // Floating Icons
    const icons = [
        { Icon: BrandIcons.Heart, x: -350, y: -150, delay: 10, size: 60, color: '#f43f5e' },
        { Icon: BrandIcons.CheckCircle, x: 380, y: -80, delay: 20, size: 50, color: '#10b981' },
        { Icon: BrandIcons.Activity, x: -300, y: 180, delay: 30, size: 70, color: '#f59e0b' },
        { Icon: BrandIcons.Layers, x: 320, y: 140, delay: 15, size: 65, color: '#3b82f6' },
        { Icon: BrandIcons.RedFocus, x: 0, y: -250, delay: 40, size: 40, color: '#ef4444' }
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: '#0f172a',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            {/* --- DYNAMIC MESH BACKGROUND --- */}
            <AbsoluteFill>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '150%',
                    height: '150%',
                    transform: `translate(-50%, -50%) rotate(${meshRotate}deg) scale(${meshScale})`,
                    background: `
                        radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
                    `,
                    opacity: 0.6,
                    filter: 'blur(60px)',
                }} />
                {/* Grid Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.2,
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }} />
            </AbsoluteFill>

            {/* --- CONTENT CONTAINER --- */}
            <div style={{
                position: 'relative',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 40
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transform: `scale(${logoScale}) translateY(${logoY}px)`,
                    opacity: logoOpacity
                }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 900,
                        color: '#0f172a',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>C</div>
                    <span style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: -0.5 }}>Company</span>
                </div>

                {/* Hero Title */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', maxWidth: 900 }}>
                        {titleWords.map((word, i) => {
                            const wordSpring = spring({ frame: frame - (textStart + i * 2), fps, config: { damping: 10, stiffness: 100 } });
                            return (
                                <div key={i} style={{ overflow: 'hidden' }}>
                                    <h1 style={{
                                        fontSize: 84,
                                        fontWeight: 900,
                                        color: '#fff',
                                        margin: 0,
                                        lineHeight: 1.1,
                                        fontFamily: themeStyles.headingFont,
                                        transform: `translateY(${(1 - wordSpring) * 100}%)`,
                                        textShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                    }}>
                                        {word}
                                    </h1>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Subtext */}
                <p style={{
                    fontSize: 22,
                    color: '#94a3b8',
                    maxWidth: 600,
                    textAlign: 'center',
                    margin: 0,
                    opacity: spring({ frame: frame - (textStart + 10), fps }),
                    transform: `translateY(${interpolate(spring({ frame: frame - (textStart + 10), fps }), [0, 1], [20, 0])}px)`
                }}>
                    {scene.subText || "Join over 10,000+ teams who use our platform to build world-class experiences."}
                </p>

                {/* CTA Button */}
                <div style={{
                    transform: `scale(${buttonSpring})`,
                    opacity: buttonSpring
                }}>
                    <div style={{
                        position: 'relative',
                        backgroundColor: themeStyles.primary,
                        padding: '24px 64px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        boxShadow: `0 20px 50px ${themeStyles.primary}40`,
                        overflow: 'hidden'
                    }}>
                        <span style={{
                            color: '#fff',
                            fontSize: 24,
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            position: 'relative',
                            zIndex: 2
                        }}>
                            {scene.ctaText || "Get Started for Free"}
                        </span>

                        {/* Shine Effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transform: `translateX(${interpolate(frame % 90, [0, 90], [-200, 200])}%) skewX(-20deg)`,
                            zIndex: 1
                        }} />

                        {/* Border Gradient */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderRadius: 20,
                            zIndex: 3
                        }} />
                    </div>
                </div>
            </div>

            {/* --- FLOATING 3D ICONS --- */}
            {icons.map((icon, i) => {
                const iconSpring = spring({ frame: frame - (buttonStart + icon.delay), fps, config: { damping: 12 } });
                const floatY = Math.sin((frame + i * 20) / 30) * 15;
                const rotate = Math.cos((frame + i * 10) / 40) * 10;

                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `
                            translate(-50%, -50%) 
                            translate(${icon.x}px, ${icon.y + floatY}px) 
                            scale(${iconSpring}) 
                            rotate(${rotate}deg)
                        `,
                        opacity: iconSpring,
                        zIndex: 10
                    }}>
                        <div style={{
                            width: icon.size * 1.6,
                            height: icon.size * 1.6,
                            backgroundColor: 'rgba(30, 41, 59, 0.6)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }}>
                            <icon.Icon width={icon.size} stroke={icon.color} color={icon.color} style={{ color: icon.color }} />
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
