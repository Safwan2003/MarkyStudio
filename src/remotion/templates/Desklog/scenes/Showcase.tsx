import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Img,
    random,
    Easing,
} from 'remotion';
import {
    Check,
    MousePointer2,
    LayoutDashboard,
    Users,
    Settings,
    PieChart,
    Search,
    Bell,
    MoreHorizontal
} from 'lucide-react';

// Dynamic color palette is set inside the component based on props

import { Scene } from '@/lib/types';
import { ThemeStyles } from '../components/ThemeEngine';

export const Showcase = ({ scene, brand, themeStyles }: { scene: Scene, brand?: any, themeStyles: ThemeStyles }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // --- Dynamic Config ---
    // --- Dynamic Config ---
    const BRAND = brand?.primaryColor || themeStyles.colors?.primary || '#10b981';
    const BRAND_SOFT = `${BRAND}22`; // 22 is roughly 13% opacity
    const TEXT_MAIN = themeStyles.text.color || '#1e293b';
    const TEXT_SUB = themeStyles.colors?.secondary || '#64748b';
    const SURFACE = themeStyles.colors?.surface || '#ffffff';

    const title = scene.mainText || 'Pipeline';

    // Dynamic Kanban columns from scene.features or fallback
    const kanbanColumns = scene.features && scene.features.length >= 4
        ? scene.features.slice(0, 4).map(f => f.title)
        : ['Discovery', 'Test Drive', 'F&I', 'Closed'];

    // Dynamic hero card from scene.testimonials[0] or fallback
    const heroCard = scene.testimonials?.[0] || { author: 'Melissa Johnson', role: '2024 Model X • Finance' };

    // Dynamic success modal text
    const successTitle = scene.subText || 'Deal Closed!';
    const successDescription = scene.ctaText || 'Commission calculated and sent to payroll.';


    // --- Animation Orchestration ---

    // 1. Entrance (Float in with tilt)
    const entrance = spring({
        frame, fps,
        config: { stiffness: 60, damping: 14, mass: 1.2 }
    });

    // 2. Cursor Travel (Natural Arc)
    const cursorStart = 50;
    const cursorSpring = spring({
        frame: frame - cursorStart, fps,
        config: { stiffness: 40, damping: 16 }
    });

    // 3. Click (Snap)
    const clickStart = 95;
    const isClicked = frame >= clickStart;
    const clickAnim = spring({
        frame: frame - clickStart, fps,
        config: { stiffness: 300, damping: 20 }
    });

    // 4. Success Reveal (Pop)
    const successStart = 105;
    const successShow = spring({
        frame: frame - successStart, fps,
        config: { stiffness: 120, damping: 12 }
    });

    // --- Dynamic Values ---

    // Window 3D
    const rotX = interpolate(entrance, [0, 1], [15, 0]);
    const winY = interpolate(entrance, [0, 1], [200, 0]);
    const sheenPos = interpolate(frame, [0, 120], [-100, 200]); // Light reflection moving across

    // Cursor Path (Bézier Curve simulation)
    const cx = interpolate(cursorSpring, [0, 1], [width * 0.8, width * 0.65]);
    const cyBase = interpolate(cursorSpring, [0, 1], [height * 0.9, height * 0.58]);
    const cyArc = Math.sin(cursorSpring * Math.PI) * 40; // The "lift" of the mouse hand
    const cy = cyBase - cyArc;

    return (
        <AbsoluteFill style={{
            backgroundColor: '#f8fafc',
            perspective: 2000,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            {/* 1. PREMIUM BACKGROUND */}
            <AbsoluteFill>
                {/* Soft Mesh Gradient */}
                <div style={{
                    position: 'absolute', inset: -200,
                    background: `
            radial-gradient(circle at 10% 20%, #d1fae5 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, #e0f2fe 0%, transparent 40%)
          `,
                    opacity: 0.8,
                    transform: `rotate(${frame * 0.05}deg) scale(1.1)`
                }} />

                {/* Dot Grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `radial-gradient(${TEXT_SUB}22 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                }} />
            </AbsoluteFill>

            {/* 2. MAIN WINDOW (Shadow & Depth) */}
            <div style={{
                width: 1300, height: 800,
                backgroundColor: SURFACE,
                borderRadius: 24,
                boxShadow: `
          0 0 0 1px rgba(0,0,0,0.04), 
          0 20px 50px -10px rgba(0,0,0,0.1),
          0 50px 100px -20px rgba(16, 185, 129, 0.1)
        `,
                display: 'flex', flexDirection: 'column',
                transform: `translateY(${winY}px) rotateX(${rotX}deg) scale(${entrance})`,
                opacity: entrance,
                overflow: 'hidden',
                position: 'relative'
            }}>

                {/* Shimmer Effect (The "Premium" Shine) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, transparent 50%)',
                    transform: `translateX(${sheenPos}%)`,
                    zIndex: 20, pointerEvents: 'none'
                }} />

                {/* A. Window Chrome */}
                <div style={{
                    height: 56, borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', padding: '0 24px',
                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2e8f0' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e2e8f0' }} />
                    </div>
                    <div style={{
                        flex: 1, margin: '0 40px', maxWidth: 500, height: 36,
                        background: '#f8fafc', borderRadius: 8,
                        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
                        color: TEXT_SUB, fontSize: 13, border: '1px solid #e2e8f0'
                    }}>
                        <Search size={14} />
                        <span>Search deals...</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Bell size={18} color={TEXT_SUB} />
                        <Img src="https://i.pravatar.cc/100?u=brooke" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                    </div>
                </div>

                {/* B. App Content */}
                <div style={{ flex: 1, display: 'flex', background: '#fcfcfc' }}>

                    {/* Sidebar */}
                    <div style={{ width: 240, borderRight: '1px solid #f1f5f9', padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                            <div style={{ width: 28, height: 28, background: BRAND, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{brand?.name ? brand.name[0] : 'D'}</div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_MAIN }}>{brand?.name || 'DeskLog'}</span>
                        </div>

                        {[
                            { i: LayoutDashboard, l: 'Dashboard' },
                            { i: Users, l: 'Customers' },
                            { i: PieChart, l: 'Pipeline', a: true },
                            { i: Settings, l: 'Settings' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                                background: item.a ? BRAND_SOFT : 'transparent',
                                color: item.a ? '#065f46' : TEXT_SUB,
                                fontWeight: item.a ? 600 : 500
                            }}>
                                <item.i size={18} />
                                <span>{item.l}</span>
                            </div>
                        ))}
                    </div>

                    {/* Kanban Board */}
                    <div style={{ flex: 1, padding: 32, background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT_MAIN, margin: 0 }}>{title}</h2>
                            <button style={{ background: TEXT_MAIN, color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>+ New Deal</button>
                        </div>

                        <div style={{ display: 'flex', gap: 20, height: '100%' }}>
                            {kanbanColumns.map((col, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_SUB, textTransform: 'uppercase' }}>{col}</div>

                                    {/* HERO CARD (Target) */}
                                    {i === 2 && (
                                        <div style={{
                                            background: 'white', borderRadius: 12, padding: 16,
                                            boxShadow: isClicked ? `0 0 0 2px ${BRAND}` : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                            transform: `scale(${interpolate(clickAnim, [0, 0.5, 1], [1, 0.96, 1])})`,
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            position: 'relative', overflow: 'hidden'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <span style={{ fontWeight: 600, color: TEXT_MAIN }}>{heroCard.author}</span>
                                                <MoreHorizontal size={16} color={TEXT_SUB} />
                                            </div>
                                            <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 16 }}>{heroCard.role || 'Verified Lead'}</div>

                                            <div style={{
                                                height: 36, borderRadius: 8,
                                                background: isClicked ? '#059669' : BRAND,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 600, fontSize: 13,
                                                boxShadow: isClicked ? 'none' : `0 4px 10px ${BRAND_SOFT}`,
                                                transition: 'background 0.2s'
                                            }}>
                                                {isClicked ? 'Approved' : 'Approve Deal'}
                                            </div>
                                        </div>
                                    )}

                                    {/* Background Cards */}
                                    {i !== 2 && (
                                        <>
                                            <div style={{ height: 80, background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.03)' }} />
                                            <div style={{ height: 100, background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.03)', opacity: 0.6 }} />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MOUSE CURSOR */}
            <div style={{
                position: 'absolute', left: 0, top: 0,
                transform: `translate(${cx}px, ${cy}px)`,
                zIndex: 100
            }}>
                <MousePointer2 size={48} fill="#1e293b" color="white" strokeWidth={1.5}
                    style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.15))' }}
                />
            </div>

            {/* 4. SUCCESS MODAL & CONFETTI */}
            {frame > successStart && (
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
                    {/* Backdrop */}
                    <AbsoluteFill style={{
                        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)',
                        opacity: interpolate(successShow, [0, 1], [0, 1])
                    }} />

                    {/* Modal */}
                    <div style={{
                        width: 400, padding: 40,
                        background: 'white', borderRadius: 24,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        transform: `scale(${successShow}) translateY(${interpolate(successShow, [0, 1], [40, 0])}px)`,
                        opacity: successShow
                    }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: BRAND_SOFT, color: BRAND,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 24
                        }}>
                            <Check size={40} strokeWidth={4} />
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT_MAIN, margin: 0 }}>{successTitle}</h2>
                        <p style={{ color: TEXT_SUB, textAlign: 'center', marginTop: 8 }}>
                            {successDescription}
                        </p>
                    </div>

                    {/* Physics Confetti */}
                    {[...Array(40)].map((_, i) => {
                        const r = random(i);
                        const angle = (r * Math.PI * 2);
                        const velocity = 15 + r * 20;
                        const t = frame - successStart;

                        // Gravity Physics
                        const x = width / 2 + Math.cos(angle) * velocity * t;
                        const y = height / 2 + Math.sin(angle) * velocity * t + (0.5 * 0.8 * t * t); // 0.8 = Gravity

                        const color = [BRAND, '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(r * 4)];

                        return (
                            <div key={i} style={{
                                position: 'absolute', left: x, top: y,
                                width: 8, height: 8, borderRadius: '50%',
                                background: color,
                                transform: `scale(${interpolate(t, [0, 10, 50], [0, 1, 0])})`,
                            }} />
                        )
                    })}
                </AbsoluteFill>
            )}

        </AbsoluteFill>
    );
};