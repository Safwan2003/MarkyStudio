import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene, ThemeStyles } from '@/lib/types';
import { BrandIcons } from '../components/BrandIcons';

// --- COMPONENTS ---

const Cursor: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = 'black', style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path d="M5.5 3.5L11.5 19.5L14.5 13.5L19.5 18.5L21.5 16.5L16.5 11.5L22.5 8.5L5.5 3.5Z" fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5.5 3.5L11.5 19.5L14.5 13.5L19.5 18.5L21.5 16.5L16.5 11.5L22.5 8.5L5.5 3.5Z" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
);

const ClickRipple: React.FC<{ frame: number; triggerFrame: number; x: number; y: number }> = ({ frame, triggerFrame, x, y }) => {
    if (frame < triggerFrame) return null;
    const progress = frame - triggerFrame;
    if (progress > 20) return null;

    const opacity = interpolate(progress, [0, 20], [0.6, 0]);
    const scale = interpolate(progress, [0, 20], [0.5, 2]);

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 40,
            height: 40,
            borderRadius: 20,
            border: '4px solid rgba(79, 70, 229, 0.5)',
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity,
            pointerEvents: 'none',
            zIndex: 1000
        }} />
    );
};

// --- SCENE ---

export const Showcase: React.FC<{ scene: Scene; themeStyles: ThemeStyles }> = ({ scene, themeStyles }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // --- TIMELINE CONSTANTS ---
    const t = {
        scrollEnd: 40,
        hoverTextStart: 45,
        hoverPlusStart: 60,
        clickPlus: 70,
        clickExport: 100,
        clickMobile: 140,
        clickShare: 210,
        clickEmailTab: 240,
        clickLinkTab: 270,
    };

    // --- CINEMATIC CAMERA ---
    const baseCameraX = interpolate(frame, [0, 145, 300], [0, 0, 20]);
    const baseCameraY = interpolate(frame, [0, 145, 300], [0, 0, 10]);

    // --- CURSOR PATH ---
    const cursorKeyframes = [
        { f: 0, x: width * 0.9, y: height * 0.9 }, // Start
        { f: t.hoverTextStart, x: width * 0.45, y: height * 0.40 }, // Hover Text
        { f: t.hoverPlusStart, x: width * 0.52, y: height * 0.48 }, // Hover Near Text
        { f: t.clickPlus, x: width * 0.58, y: height * 0.52 }, // Click (+)
        { f: t.clickExport, x: width * 0.62, y: height * 0.55 }, // Click "Export"
        { f: t.clickMobile - 10, x: 230, y: height - 50 }, // Move to Bottom Bar
        { f: t.clickMobile, x: 230, y: height - 50 }, // Click Mobile
        { f: t.clickShare - 15, x: width * 0.88, y: height * 0.15 }, // Move to Share
        { f: t.clickShare, x: width * 0.88, y: height * 0.15 }, // Click Share
        { f: t.clickEmailTab, x: width * 0.5, y: height * 0.28 }, // Click Email Tab
        { f: t.clickLinkTab, x: width * 0.6, y: height * 0.28 }, // Click Link Tab
        { f: t.clickLinkTab + 30, x: width * 0.9, y: height * 0.9 }, // Exit
    ];

    const cursorX = interpolate(frame, cursorKeyframes.map(k => k.f), cursorKeyframes.map(k => k.x), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const cursorY = interpolate(frame, cursorKeyframes.map(k => k.f), cursorKeyframes.map(k => k.y), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Click Scaling
    const clickFrames = [t.clickPlus, t.clickExport, t.clickMobile, t.clickShare, t.clickEmailTab, t.clickLinkTab];
    const isClicking = clickFrames.some(cf => frame >= cf && frame <= cf + 6);
    const cursorScale = isClicking ? 0.8 : 1;

    // --- ANIMATIONS ---
    const scrollY = interpolate(frame, [0, t.scrollEnd], [0, -100], { extrapolateRight: 'clamp' });
    const showDashedBox = frame >= t.hoverTextStart && frame < t.clickPlus + 20;
    const dashedBoxSpring = spring({ frame: frame - t.hoverTextStart, fps });
    const showPlus = frame >= t.hoverTextStart;
    const plusScale = spring({ frame: frame - t.hoverTextStart - 5, fps });
    const showCommentModal = frame >= t.clickPlus;
    const commentModalSpring = spring({ frame: frame - t.clickPlus, fps });
    const closeComment = frame > t.clickExport + 10;
    const commentOpacity = closeComment ? interpolate(frame, [t.clickExport + 10, t.clickExport + 20], [1, 0]) : commentModalSpring;

    // Mobile Transition
    const isMobileView = frame >= t.clickMobile;
    const mobileTransition = spring({ frame: frame - t.clickMobile, fps, config: { damping: 14 } });

    // Share Modal
    const showShareModal = frame >= t.clickShare;
    const shareModalSpring = spring({ frame: frame - t.clickShare, fps });

    // Tab Logic
    let activeTab = 'PEOPLE';
    if (frame >= t.clickEmailTab) activeTab = 'EMAIL';
    if (frame >= t.clickLinkTab) activeTab = 'LINK';

    // Ambient background icons floating
    const float1 = Math.sin(frame / 40) * 15;
    const float2 = Math.cos(frame / 35) * 20;

    // Background Pulse
    const bgGradient = `radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)`;

    return (
        <AbsoluteFill style={{ backgroundColor: '#020617', perspective: 2000, overflow: 'hidden' }}>

            {/* 1. BACKGROUND LAYER: Premium "OS Desktop" Wallpaper */}
            <AbsoluteFill style={{
                transform: `translate(${baseCameraX * 0.5}px, ${baseCameraY * 0.5}px) scale(1.1)`,
                background: bgGradient
            }}>
                {/* Abstract Aurora/Mesh Gradients */}
                <div style={{ position: 'absolute', top: -400, left: -200, width: 1400, height: 1400, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite alternate' }} />
                <div style={{ position: 'absolute', bottom: -300, right: -100, width: 1200, height: 1200, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'float 15s ease-in-out infinite alternate-reverse' }} />
                <div style={{ position: 'absolute', top: '30%', left: '40%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(45, 212, 191, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.6 }} />

                {/* Floating Abstract Shapes */}
                <BrandIcons.Home width={120} style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.1, transform: `translate(${float1}px, ${float2}px) rotate(15deg)`, color: '#fff' }} />
                <BrandIcons.Activity width={100} style={{ position: 'absolute', bottom: '20%', right: '15%', opacity: 0.1, transform: `translate(${float2}px, ${float1}px) rotate(-10deg)`, color: '#fff' }} />
                <BrandIcons.Settings width={80} style={{ position: 'absolute', top: '40%', right: '10%', opacity: 0.05, transform: `translate(${float1 * 0.5}px, ${float2 * 0.7}px) rotate(45deg)`, color: '#fff' }} />
            </AbsoluteFill>

            {/* 2. MAIN CONTENT (Interactive Browser) */}
            <AbsoluteFill style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translate(${baseCameraX}px, ${baseCameraY}px)`
            }}>
                <div style={{
                    position: 'relative',
                    width: isMobileView ? 390 : 1200,
                    height: isMobileView ? 800 : 800,
                    backgroundColor: '#ffffff',
                    borderRadius: isMobileView ? 48 : 24,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px -10px rgba(0,0,0,0.5), 0 0 100px -20px rgba(79, 70, 229, 0.2)',
                    border: isMobileView ? '8px solid #1e293b' : 'none',
                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.8s ease',
                }}>
                    {/* Toolbar Shimmer */}
                    {!isMobileView && <div style={{ height: 4, background: 'linear-gradient(90deg, #4f46e5, #0ea5e9, #4f46e5)', backgroundSize: '200% 100%', animation: 'shimmer 3s infinite linear' }} />}

                    {/* SCROLL CONTAINER */}
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#fff'
                    }}>
                        <div style={{
                            width: 1200, // Fixed internal width
                            transform: isMobileView ? 'scale(0.325) origin(top left)' : `translateY(${scrollY}px)`,
                            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}>
                            {/* BROWSER TOP BAR */}
                            <div style={{ padding: '32px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 20, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff' }}>C</div>
                                    <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: -0.5, color: '#0f172a' }}>Company</span>
                                </div>
                                <div style={{ display: 'flex', gap: 40, fontWeight: 600, color: '#64748b' }}>
                                    <span>Features</span>
                                    <span>Pricing</span>
                                    <span>Blog</span>
                                    <span>Help Center</span>
                                </div>
                                <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '14px 28px', borderRadius: 8, fontWeight: 'bold' }}>Get Started</div>
                            </div>

                            {/* MAIN CONTENT TEXT */}
                            <div style={{ padding: '80px 180px', position: 'relative' }}>
                                <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.1, color: '#0f172a', marginBottom: 32, maxWidth: 800, fontFamily: themeStyles.headingFont }}>
                                    Mockups connects the
                                    <span style={{ position: 'relative', display: 'inline-block' }}>
                                        conceptual structure
                                        {/* DASHED BOX */}
                                        {showDashedBox && (
                                            <div style={{ position: 'absolute', inset: -8, border: '3px dashed #4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: 8, transform: `scale(${dashedBoxSpring})`, opacity: dashedBoxSpring }} />
                                        )}
                                        {/* PLUS BUTTON */}
                                        {showPlus && (
                                            <div style={{ position: 'absolute', right: -24, bottom: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: '#ef4444', border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${plusScale})`, zIndex: 20 }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M12 5V19M5 12H19" /></svg>
                                            </div>
                                        )}
                                    </span>
                                </h1>
                                <p style={{ fontSize: 24, color: '#64748b', maxWidth: 600, lineHeight: 1.6 }}>
                                    Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.
                                </p>

                                {/* COMMENT MODAL */}
                                {showCommentModal && (
                                    <div style={{ position: 'absolute', left: '60%', top: '40%', width: 400, backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', padding: 24, zIndex: 50, opacity: commentOpacity, transform: `scale(${commentModalSpring})` }}>
                                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fbbf24', overflow: 'hidden' }}><BrandIcons.AvatarMan style={{ width: '100%' }} /></div>
                                            <div><div style={{ fontWeight: 700, fontSize: 15 }}>Eric Johanson</div><div style={{ fontSize: 13, color: '#94a3b8' }}>Please reduce this title's font size.</div></div>
                                        </div>
                                        <div style={{ backgroundColor: '#4f46e5', color: '#fff', textAlign: 'center', padding: 12, borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                                            {frame > t.clickExport ? 'Comment Exported!' : 'Export Comment'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MOCKUP IMAGE */}
                            <div style={{ padding: '0 64px' }}>
                                {scene.screenshotUrl && <Img src={scene.screenshotUrl} style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />}
                            </div>
                        </div>
                    </div>

                    {/* STICKY BOTTOM BAR */}
                    {!isMobileView && (
                        <div style={{ height: 90, background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, zIndex: 200 }}>
                            <div style={{ display: 'flex', gap: 16 }}>
                                {[BrandIcons.Monitor, BrandIcons.Tablet, BrandIcons.Smartphone].map((Icon, i) => (
                                    <div key={i} style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: (i === 2 && isMobileView) ? '#4f46e5' : '#94a3b8', background: (i === 2 && isMobileView) ? '#4f46e508' : '#fff' }}>
                                        <Icon width={20} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MOBILE BOTTOM NAV */}
                    {isMobileView && (
                        <div style={{ height: 80, background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <BrandIcons.Home width={24} color="#4f46e5" />
                            <BrandIcons.Activity width={24} color="#94a3b8" />
                            <BrandIcons.Settings width={24} color="#94a3b8" />
                        </div>
                    )}
                </div>
            </AbsoluteFill>

            {/* 3. SHARE MODAL GLOBAL OVERLAY */}
            {showShareModal && (
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', opacity: shareModalSpring }} />
                    <div style={{
                        width: 550, backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 50px 100px rgba(0,0,0,0.5)', padding: 32,
                        transform: `scale(${shareModalSpring}) translateY(${interpolate(shareModalSpring, [0, 1], [50, 0])}px)`
                    }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
                            {['PEOPLE', 'EMAIL', 'LINK'].map(tab => (
                                <div key={tab} style={{
                                    padding: '12px 24px', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                                    color: activeTab === tab ? '#0f172a' : '#94a3b8',
                                    borderBottom: activeTab === tab ? '3px solid #4f46e5' : '3px solid transparent'
                                }}>
                                    {tab}
                                </div>
                            ))}
                        </div>

                        <div style={{ minHeight: 180 }}>
                            {activeTab === 'PEOPLE' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Share with collaborators</h3>
                                    <div style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, color: '#64748b' }}>Search for Someone</div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 16, background: '#fbbf24', overflow: 'hidden' }}><BrandIcons.AvatarMan width="100%" /></div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>Eric Johanson</div>
                                    </div>
                                    <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: 14, borderRadius: 8, textAlign: 'center', fontWeight: 'bold' }}>Invite to collaborate</div>
                                </div>
                            )}
                            {activeTab === 'EMAIL' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div><h3 style={{ fontSize: 16, fontWeight: 700 }}>Share by email</h3><div style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, color: '#64748b' }}>Johanson.eric@gmail.com</div></div>
                                    <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: 14, borderRadius: 8, textAlign: 'center', fontWeight: 'bold' }}>Send Invitations</div>
                                </div>
                            )}
                            {activeTab === 'LINK' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div><h3 style={{ fontSize: 16, fontWeight: 700 }}>Share via a private link</h3><div style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, color: '#64748b' }}>https://app.fronter.io/h/j34yTp</div></div>
                                    <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: 14, borderRadius: 8, textAlign: 'center', fontWeight: 'bold' }}>Copy link to clipboard</div>
                                </div>
                            )}
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* 4. CURSOR & RIPPLES */}
            {clickFrames.map((cf, i) => <ClickRipple key={i} frame={frame} triggerFrame={cf} x={cursorKeyframes.find(k => k.f === cf)?.x || 0} y={cursorKeyframes.find(k => k.f === cf)?.y || 0} />)}

            <Cursor
                size={48}
                style={{
                    position: 'absolute',
                    left: cursorX,
                    top: cursorY,
                    transform: `scale(${cursorScale}) translateX(-8px) translateY(-4px)`,
                    zIndex: 2000,
                    filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))'
                }}
            />

            <style>{`
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                @keyframes float { 0% { transform: translateY(0px); } 100% { transform: translateY(-20px); } }
            `}</style>
        </AbsoluteFill>
    );
};
