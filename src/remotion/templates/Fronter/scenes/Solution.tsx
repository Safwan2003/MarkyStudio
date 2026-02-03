import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene, ThemeStyles } from '@/lib/types';
import { BrandIcons } from '../components/BrandIcons';

// Custom Hand Cursor SVG
const HandCursor: React.FC<{ size: number, color: string, style?: React.CSSProperties }> = ({ size, color, style }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
    >
        <path d="M10.5 22C6.91015 22 4 19.0899 4 15.5V13.5C4 11.567 5.567 10 7.5 10C8.03816 10 8.5463 10.1215 9 10.3392V5.5C9 3.567 10.567 2 12.5 2C14.433 2 16 3.567 16 5.5V11.2381C16.4537 11.0838 16.9618 11 17.5 11C19.433 11 21 12.567 21 14.5V15.5C21 19.0899 18.0899 22 14.5 22H10.5Z" fill="white" stroke="black" strokeWidth="1.5" />
        <path d="M9 10.3392V5.5C9 3.567 10.567 2 12.5 2C14.433 2 16 3.567 16 5.5V11.2381" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Custom Easing functions
const elastic = (t: number) => {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
};

export const Solution: React.FC<{ scene: Scene, themeStyles: ThemeStyles }> = ({ scene, themeStyles }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // --- TIMELINE CONSTANTS ---
    const cursorEnterStart = 20;
    const clickFrame = 65;
    const modalStart = 75;
    const typingStart = 95;
    const typingEnd = 125;
    const editorStart = 145; // Cinematic zoom out to editor

    const companyText = "company";

    // --- ANIMATION VALUES ---

    // Cinematic Camera (Panning based on cursor or phase)
    const baseCameraX = interpolate(frame, [0, 145, 200, 300], [0, 0, -20, 20]);
    const baseCameraY = interpolate(frame, [0, 145, 200, 300], [0, 0, -10, 10]);

    // Zoom Phase 1 -> 2
    const sceneScale = interpolate(frame, [editorStart - 10, editorStart + 40], [1, 1], { extrapolateRight: 'clamp' }); // Controlled scale
    const dashboardFadeOut = interpolate(frame, [editorStart, editorStart + 15], [1, 0], { extrapolateRight: 'clamp' });

    // Cursor Path
    const cursorX = interpolate(frame,
        [cursorEnterStart, clickFrame, modalStart, typingStart, typingEnd],
        [width * 0.85, width * 0.38, width * 0.45, width * 0.52, width * 0.62],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const cursorY = interpolate(frame,
        [cursorEnterStart, clickFrame, modalStart, typingStart, typingEnd],
        [height * 0.95, height * 0.45, height * 0.62, height * 0.58, height * 0.68],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const cursorScale = interpolate(frame,
        [clickFrame - 2, clickFrame, clickFrame + 5],
        [1, 0.7, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Click Ripple Effect
    const rippleProgress = spring({
        frame: frame - clickFrame,
        fps,
        config: { damping: 12, stiffness: 100 },
    });
    const rippleOpacity = interpolate(rippleProgress, [0, 0.5, 1], [0, 0.4, 0]);
    const rippleScale = interpolate(rippleProgress, [0, 1], [0.5, 2.5]);

    // Modal Physics
    const modalSpring = spring({
        frame: frame - modalStart,
        fps,
        config: { stiffness: 100, damping: 10 },
    });
    const modalScale = interpolate(modalSpring, [0, 1], [0.85, 1]);

    // Phase 2 (Editor View)
    const editorSpring = spring({
        frame: frame - editorStart,
        fps,
        config: { damping: 18, stiffness: 80 },
    });
    const editorOpacity = interpolate(editorSpring, [0.3, 1], [0, 1]);
    const editorDepth = interpolate(editorSpring, [0, 1], [0.8, 1]);

    // 3D Isometric transforms for Phase 2
    const browser3D = spring({ frame: frame - (editorStart + 20), fps, config: { damping: 14 } });
    const mobile3D = spring({ frame: frame - (editorStart + 35), fps, config: { damping: 14 } });

    // Staggered Text Reveal
    const mainWords = (scene.mainText || "Mockups connects the conceptual structure").split(" ");
    const subWords = (scene.subText || "Far far away, behind the word mountains, far from the countries").split(" ");

    // Ambient background icons floating
    const float1 = Math.sin(frame / 40) * 15;
    const float2 = Math.cos(frame / 35) * 20;

    return (
        <AbsoluteFill style={{ backgroundColor: '#0e1117', perspective: 2000 }}>
            {/* Background Layer with Parallax */}
            <AbsoluteFill style={{ transform: `translate(${baseCameraX * 1.5}px, ${baseCameraY * 1.5}px) scale(1.1)` }}>
                <Img
                    src={staticFile('/fronter_intro_laptop.jpg')}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(30px) brightness(0.4) saturate(0.8)',
                    }}
                />

                {/* Ambient Icons */}
                <BrandIcons.Home width={120} style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.1, transform: `translate(${float1}px, ${float2}px) rotate(15deg)` }} color="#fff" />
                <BrandIcons.Activity width={100} style={{ position: 'absolute', bottom: '20%', right: '15%', opacity: 0.1, transform: `translate(${float2}px, ${float1}px) rotate(-10deg)` }} color="#fff" />
                <BrandIcons.Settings width={80} style={{ position: 'absolute', top: '40%', right: '10%', opacity: 0.05, transform: `translate(${float1 * 0.5}px, ${float2 * 0.7}px) rotate(45deg)` }} color="#fff" />
            </AbsoluteFill>

            {/* MAIN CAMERA CONTAINER */}
            <AbsoluteFill style={{
                transform: `translate(${baseCameraX}px, ${baseCameraY}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                {/* PHASE 1: DASHBOARD (Z-LAYER) */}
                {frame < editorStart + 20 && (
                    <div style={{
                        width: '85%',
                        height: '80%',
                        backgroundColor: '#ffffff',
                        borderRadius: 24,
                        overflow: 'hidden',
                        display: 'flex',
                        position: 'relative',
                        boxShadow: '0 80px 150px rgba(0,0,0,0.7)',
                        opacity: dashboardFadeOut,
                        transform: `scale(${interpolate(frame, [editorStart, editorStart + 20], [1, 1.2])})`,
                    }}>
                        {/* Sidebar */}
                        <div style={{ width: '8%', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: 40, background: '#fff' }}>
                            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: 10 }} />
                            <div style={{ width: 44, height: 44, backgroundColor: '#4f46e5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 24 }}>+</div>
                            <BrandIcons.Activity width={20} color="#cbd5e1" />
                            <BrandIcons.Mail width={20} color="#cbd5e1" />
                        </div>

                        {/* Context Area */}
                        <div style={{ flex: 1, background: '#f8fafc', padding: '60px 80px' }}>
                            <div style={{ height: 44, width: '35%', backgroundColor: '#e2e8f0', borderRadius: 8, marginBottom: 48 }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', height: 200, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} />
                                ))}
                            </div>
                        </div>

                        {/* PHASE 1 MODAL */}
                        {frame >= modalStart && (
                            <AbsoluteFill style={{
                                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(12px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}>
                                <div style={{
                                    width: 520,
                                    backgroundColor: '#fff',
                                    borderRadius: 16,
                                    transform: `scale(${modalScale})`,
                                    padding: 48,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'flex', gap: 24, marginBottom: 40, borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ paddingBottom: 16, color: '#94a3b8', fontSize: 14, fontWeight: 'bold' }}>WEB</div>
                                        <div style={{ paddingBottom: 16, borderBottom: '3px solid #4f46e5', color: '#0f172a', fontWeight: 'bold' }}>IMAGE</div>
                                    </div>
                                    <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>Create a new Image project</h3>
                                    <div style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 10,
                                        padding: '20px',
                                        fontSize: 18,
                                        position: 'relative',
                                        background: '#fcfdfe'
                                    }}>
                                        {companyText.substring(0, Math.floor(interpolate(frame, [typingStart, typingEnd], [0, companyText.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))}
                                        {frame < typingEnd && (frame % 20 < 10) && <span style={{ width: 2, height: 24, backgroundColor: '#4f46e5', display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }} />}
                                    </div>
                                    <div style={{ backgroundColor: '#4f46e5', borderRadius: 10, padding: '20px', color: '#fff', fontWeight: '900', textAlign: 'center', marginTop: 32, fontSize: 18, boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)' }}>Select an image</div>
                                </div>
                            </AbsoluteFill>
                        )}
                    </div>
                )}

                {/* PHASE 2: HIGH-END EDITOR VIEW */}
                {frame >= editorStart && (
                    <AbsoluteFill style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: editorOpacity,
                        transform: `scale(${editorDepth})`,
                        zIndex: 100
                    }}>
                        <div style={{
                            width: '94%',
                            height: '88%',
                            backgroundColor: '#ffffff',
                            borderRadius: 28,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 100px 200px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            position: 'relative'
                        }}>
                            {/* Toolbar (Ambient Lighting Effect) */}
                            <div style={{ height: 4, background: 'linear-gradient(90deg, #4f46e5, #0ea5e9, #4f46e5)', backgroundSize: '200% 100%', animation: 'shimmer 3s infinite linear' }} />

                            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
                                {/* LANDING PAGE PREVIEW */}
                                <div style={{
                                    width: '100%', height: '100%', backgroundColor: '#fff', padding: '60px 100px'
                                }}>
                                    {/* Brandings */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100,
                                        transform: `translateY(${interpolate(editorSpring, [0, 1], [20, 0])}px)`,
                                        opacity: editorOpacity
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ height: 40, width: 40, borderRadius: 20, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: 20 }}>B</div>
                                            <span style={{ fontWeight: 900, fontSize: 22, color: '#0f172a' }}>Brandy</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 40, color: '#64748b', fontSize: 15, fontWeight: 600 }}>
                                            <span>Platform</span>
                                            <span>Solutions</span>
                                            <span>Resources</span>
                                            <span>Pricing</span>
                                        </div>
                                        <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 900, fontSize: 15 }}>Get Started</div>
                                    </div>

                                    {/* Hero Staggered Words */}
                                    <div style={{ maxWidth: '65%' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', marginBottom: 32 }}>
                                            {mainWords.map((word, i) => {
                                                const wordSpring = spring({ frame: frame - (editorStart + 10 + i * 3), fps, config: { damping: 12 } });
                                                return (
                                                    <div key={i} style={{ overflow: 'hidden' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            fontSize: 72,
                                                            fontWeight: 900,
                                                            color: '#0f172a',
                                                            lineHeight: 1,
                                                            fontFamily: themeStyles.headingFont,
                                                            transform: `translateY(${(1 - wordSpring) * 100}%) rotate(${(1 - wordSpring) * 5}deg)`
                                                        }}>
                                                            {word}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 8px' }}>
                                            {subWords.map((word, i) => {
                                                const subSpring = spring({ frame: frame - (editorStart + 30 + i * 2), fps, config: { damping: 12 } });
                                                return (
                                                    <span key={i} style={{
                                                        fontSize: 20,
                                                        color: '#64748b',
                                                        lineHeight: 1.6,
                                                        opacity: subSpring,
                                                        transform: `translateY(${(1 - subSpring) * 10}px)`
                                                    }}>
                                                        {word}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* ISOMETRIC MOCKUPS */}
                                    {/* Desktop Browser with 3D Rotate */}
                                    <div style={{
                                        position: 'absolute',
                                        right: -60,
                                        bottom: -20,
                                        width: '58%',
                                        height: '75%',
                                        backgroundColor: '#1e293b',
                                        borderRadius: '24px 0 0 0',
                                        boxShadow: '-40px 40px 80px rgba(15, 23, 42, 0.2)',
                                        transform: `
                                            translateX(${(1 - browser3D) * 100}px) 
                                            translateY(${(1 - browser3D) * 200}px)
                                            perspective(1000px)
                                            rotateY(${(1 - browser3D) * -15}deg)
                                            rotateX(${(1 - browser3D) * 10}deg)
                                        `,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ height: 40, background: '#0f172a', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#ef4444' }} />
                                            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#f59e0b' }} />
                                            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#10b981' }} />
                                            <div style={{ flex: 1, height: 20, background: '#334155', borderRadius: 10, marginLeft: 20 }} />
                                        </div>
                                        <div style={{ flex: 1, backgroundColor: '#000' }}>
                                            {scene.screenshotUrl && <Img src={scene.screenshotUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                    </div>

                                    {/* Mobile Phone Pop-up */}
                                    <div style={{
                                        position: 'absolute',
                                        right: '38%',
                                        bottom: -10,
                                        width: 220,
                                        height: '52%',
                                        backgroundColor: '#0f172a',
                                        borderRadius: '40px 40px 0 0',
                                        border: '8px solid #0f172a',
                                        boxShadow: '0 50px 100px rgba(0,0,0,0.4)',
                                        transform: `
                                            translateY(${(1 - mobile3D) * 500}px)
                                            perspective(1000px)
                                            rotateY(${(1 - mobile3D) * 20}deg)
                                        `,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <div style={{ width: 60, height: 4, borderRadius: 2, background: '#334155' }} />
                                        </div>
                                        <div style={{ flex: 1, backgroundColor: '#000' }}>
                                            {scene.mobileScreenshotUrl && <Img src={scene.mobileScreenshotUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM CONTROL BAR */}
                            <div style={{
                                height: 90,
                                background: '#fff',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 40px',
                                transform: `translateY(${interpolate(editorSpring, [0, 1], [100, 0])}px)`
                            }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    {[BrandIcons.Home, BrandIcons.Activity, BrandIcons.Layers].map((Icon, i) => (
                                        <div key={i} style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#4f46e5' : '#94a3b8', background: i === 0 ? '#4f46e508' : '#fff' }}>
                                            <Icon width={20} />
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Collaborators */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
                                    <div style={{ display: 'flex' }}>
                                        {[
                                            { icon: BrandIcons.AvatarWoman, color: '#3b82f6', t: 40 },
                                            { icon: BrandIcons.AvatarMan, color: '#10b981', t: 45 },
                                            { icon: BrandIcons.Avatar2, color: '#f59e0b', t: 50 },
                                        ].map((item, i) => {
                                            const pop = spring({ frame: frame - (editorStart + item.t), fps, config: { damping: 10 } });
                                            return (
                                                <div key={i} style={{
                                                    width: 44, height: 44, borderRadius: 22, border: '3px solid #fff', marginLeft: i > 0 ? -14 : 0,
                                                    overflow: 'hidden', transform: `scale(${pop})`, background: '#f8fafc', position: 'relative'
                                                }}>
                                                    <item.icon style={{ width: '100%', height: '100%' }} />
                                                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, background: item.color, border: '2px solid #fff' }} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{ height: 44, width: 120, borderRadius: 22, background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>
                                        Publish
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AbsoluteFill>
                )}
            </AbsoluteFill>

            {/* CURSOR & CLICK EFFECTS */}
            {frame < editorStart && frame >= cursorEnterStart && (
                <>
                    {/* Ripple at click position */}
                    {frame >= clickFrame && (
                        <div style={{
                            position: 'absolute',
                            left: width * 0.38 + 12,
                            top: height * 0.45 + 12,
                            width: 100,
                            height: 100,
                            border: '4px solid #4f46e5',
                            borderRadius: '50%',
                            transform: `translate(-50%, -50%) scale(${rippleScale})`,
                            opacity: rippleOpacity,
                            pointerEvents: 'none',
                            zIndex: 199
                        }} />
                    )}

                    <HandCursor
                        size={72}
                        color="#000"
                        style={{
                            position: 'absolute',
                            left: cursorX,
                            top: cursorY,
                            zIndex: 200,
                            transform: `scale(${cursorScale}) rotate(-8deg)`,
                            filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.3))'
                        }}
                    />
                </>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </AbsoluteFill>
    );
};
