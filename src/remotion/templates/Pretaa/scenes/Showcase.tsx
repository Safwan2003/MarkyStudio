import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Sequence
} from 'remotion';
import { Scene } from '@/lib/types';
import { GradientBlob } from '../components/GradientBlob';

// --- 1. Studio Design Tokens ---
const THEME = {
    bg: '#F8FAFC',       // Clean SaaS background
    primary: '#3B82F6',  // Annotation Blue
    textMain: '#0F172A', // Slate-900
    textSub: '#64748B',  // Slate-500
    success: '#10B981',  // Reference Green
    navy: '#1E1B4B',     // Customer Navy
    // Deep, high-end shadow for floating devices
    phoneShadow: '0 50px 100px -20px rgba(0,0,0,0.2), 0 30px 60px -30px rgba(0,0,0,0.1)',
};

// --- 2. High-Fidelity UI Components ---

const Tag = ({ text, color, bg }: { text: string; color: string; bg: string }) => (
    <span style={{
        fontSize: 9, fontWeight: 700, color: color,
        background: bg, padding: '3px 8px', borderRadius: 4,
        textTransform: 'uppercase', display: 'inline-block', letterSpacing: '0.02em'
    }}>
        {text}
    </span>
);

// Matches the card style in showcase_01.jpg
const ListCard = ({ title, sub, tag, time, type = 'default' }: any) => (
    <div style={{
        background: 'white', padding: 14, borderRadius: 12,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9',
        display: 'flex', flexDirection: 'column', gap: 4
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            {tag && <Tag
                text={tag}
                color={type === 'red' ? '#DC2626' : '#64748B'}
                bg={type === 'red' ? '#FEE2E2' : '#F1F5F9'}
            />}
            <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{time}</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: THEME.textMain }}>{title}</div>
        <div style={{ fontSize: 11, color: THEME.textSub, lineHeight: 1.4 }}>{sub}</div>
    </div>
);

// Matches the Center "Cadman Inc" Header
const ProfileHeader = () => (
    <div style={{
        background: 'white', padding: 20, borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9',
        textAlign: 'center'
    }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: THEME.textMain, margin: '0 0 12px 0' }}>Cadman Inc.</h2>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <div style={{ background: THEME.navy, color: 'white', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 100 }}>CUSTOMER</div>
            <div style={{ background: THEME.success, color: 'white', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 100 }}>REFERENCE</div>
        </div>
    </div>
);

// Matches the "Hustle Hint"
const HustleHint = () => (
    <div style={{
        background: 'white', padding: 16, borderRadius: 16,
        boxShadow: '0 10px 20px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: THEME.textMain, marginBottom: 6 }}>Hustle Hint</div>
        <p style={{ fontSize: 11, color: THEME.textSub, margin: '0 0 10px 0', lineHeight: 1.5 }}>
            Send email to customer service to find out what is going on using CS template.
        </p>
        <div style={{ fontSize: 11, fontWeight: 700, color: THEME.primary, cursor: 'pointer' }}>Send email &rarr;</div>
    </div>
);

// --- 3. The "Hero" Phone Frame ---

const PhoneFrame = ({ children, x, y, delay, isCenter }: any) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Smooth Entrance: Slide Up + Fade
    const slideUp = spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 20 } });

    // Idle Float Animation (Parallax)
    const float = Math.sin((frame + x) / 50) * 6;

    return (
        <div style={{
            position: 'absolute',
            left: x, top: y,
            width: 280, // BIGGER SIZE [Request: "mobile screen size bigger"]
            height: 580,
            transform: `translateY(${interpolate(slideUp, [0, 1], [300, 0]) + float}px)`,
            opacity: interpolate(slideUp, [0, 0.5], [0, 1]),
            zIndex: isCenter ? 20 : 10,
        }}>
            <div style={{
                width: '100%', height: '100%',
                background: '#F8FAFC',
                borderRadius: 44, // Match iOS curve
                boxShadow: THEME.phoneShadow, // Deep shadow
                border: `8px solid white`, // Thick bezel
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Notch & Status Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 40, background: 'white', zIndex: 30, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 100, height: 24, background: 'black', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }} />
                </div>

                {/* Screen Content */}
                <div style={{ padding: '50px 18px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'hidden' }}>
                    {children}
                </div>

                {/* Glass Reflection */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%)',
                    zIndex: 40
                }} />
            </div>
        </div>
    );
};

// --- 4. Animated Annotations ---

const Annotation = ({ start, end, label, delay, align = 'left', labelPos = 'bottom' }: any) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const draw = spring({ frame: frame - delay, fps, config: { stiffness: 60, damping: 20 } });
    const opacity = interpolate(draw, [0, 1], [0, 1]);

    // Path Logic: Draw elbow lines based on alignment
    // M start -> L elbow -> L end
    const elbowX = align === 'left' ? start.x - 40 : start.x + 40;
    const pathD = `M ${start.x} ${start.y} L ${elbowX} ${start.y} L ${elbowX} ${end.y} L ${end.x} ${end.y}`;

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path
                    d={pathD}
                    stroke={THEME.primary} strokeWidth="2.5" strokeDasharray="6 6" fill="none"
                    strokeDashoffset={interpolate(draw, [0, 1], [300, 0])}
                    opacity={opacity}
                />
                <circle cx={start.x} cy={start.y} r="4" fill={THEME.primary} opacity={opacity} />
            </svg>

            {/* Label Block */}
            <div style={{
                position: 'absolute',
                left: align === 'left' ? elbowX : elbowX,
                top: end.y + (labelPos === 'top' ? -40 : 10),
                transform: `translateX(${align === 'left' ? '-100%' : '0%'}) translateX(${align === 'left' ? '-15px' : '15px'})`,
                opacity: opacity,
                textAlign: align === 'left' ? 'right' : 'left',
                width: 140
            }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: THEME.textMain }}>{label.split(' ')[0]}</h3>
                <span style={{ fontSize: 14, color: THEME.textSub, fontWeight: 500 }}>{label.split(' ').slice(1).join(' ')}</span>
            </div>
        </div>
    );
};

// --- 5. Main Scene ---

// --- 5. Main Scene ---

export const Showcase: React.FC<{ scene: Scene }> = ({ scene }) => {
    const { width, height } = useVideoConfig();

    // --- Dynamic Data Injection ---
    const features = scene.features || [];

    // Helper to generic Mock Data if features are missing
    const getFeature = (idx: number, fallback: any) => {
        if (features[idx]) {
            return {
                title: features[idx].title || features[idx], // Handle string or object
                sub: features[idx].description || "Optimized for performance",
                tag: "FEATURE",
                time: "Now"
            };
        }
        return fallback;
    };

    // --- Dynamic Layout Calculations ---
    const phoneW = 280; // Scaled Up
    const gap = 50;
    const totalW = phoneW * 3 + gap * 2;
    const startX = (width - totalW) / 2;
    const centerY = height / 2 - 300;

    // Anchor points for annotations
    const anchors = {
        leftList: { x: startX + phoneW, y: centerY + 220 },
        centerRef: { x: startX + phoneW + gap + phoneW / 2 + 60, y: centerY + 140 },
        centerHustle: { x: startX + phoneW + gap + phoneW, y: centerY + 280 },
    };

    return (
        <AbsoluteFill style={{ backgroundColor: '#F8FAFC', overflow: 'hidden' }}>

            {/* Clean Studio Backdrop */}
            <GradientBlob color="#E0E7FF" x={width * 0.1} y={height * 0.4} size={1200} opacity={0.4} />
            <GradientBlob color="#DBEAFE" x={width * 0.9} y={height * 0.6} size={1200} opacity={0.4} />

            {/* --- PHONE 1: EVENTS (Left) --- */}
            <PhoneFrame x={startX} y={centerY + 30} delay={0} isCenter={false}>
                <div style={{ fontSize: 22, fontWeight: 800, color: THEME.textMain, marginBottom: 4 }}>{scene.mainText || 'Events'}</div>
                <ListCard {...getFeature(0, { title: "Champlin-Douglas", sub: "is now below average product use", tag: "PRODUCT", time: "2h ago" })} />
                <ListCard {...getFeature(1, { title: "Braun Inc.", sub: "is not yet operational. Avg is 15d.", tag: "ONBOARDING", time: "5m ago" })} />
                <ListCard {...getFeature(2, { title: "Dynamite", sub: "has just been acquired by Long Game Capital.", tag: "IN THE NEWS", time: "Now" })} />
            </PhoneFrame>

            {/* --- PHONE 2: PROFILE (Center - Elevated) --- */}
            <PhoneFrame x={startX + phoneW + gap} y={centerY - 20} delay={10} isCenter={true}>
                <div style={{ height: 10 }} />
                <ProfileHeader />
                <HustleHint />
                <ListCard {...getFeature(3, { title: "Dynamite", sub: "Acquired by Long Game Capital", tag: "IN THE NEWS", time: "Now" })} />
            </PhoneFrame>

            {/* --- PHONE 3: TIMELINE (Right) --- */}
            <PhoneFrame x={startX + (phoneW + gap) * 2} y={centerY + 30} delay={20} isCenter={false}>
                <div style={{ fontSize: 22, fontWeight: 800, color: THEME.textMain, marginBottom: 4 }}>Timeline</div>
                <ListCard {...getFeature(4, { title: "'Happy' rating submitted", sub: "by Emily Wastervaunt, Customer Support.", tag: "RATING", time: "Now" })} />
                <ListCard {...getFeature(5, { title: "Rating Follow up", sub: "@Nick Zaccheo good time for upsell.", tag: "LAUNCH", time: "3m ago" })} />
                <ListCard {...getFeature(6, { title: "Cadman Inc.", sub: "Reported as reference company.", tag: "POTENTIAL REFERENCE", time: "5m ago" })} />
            </PhoneFrame>

            {/* --- ANNOTATIONS --- */}

            <Annotation
                start={{ x: anchors.leftList.x - 20, y: anchors.leftList.y }}
                end={{ x: startX - 60, y: centerY + 100 }}
                label={features[0] ? "Feature Highlight" : "Company Health"}
                align="right"
                delay={40}
            />

            <Annotation
                start={{ x: anchors.centerRef.x - 40, y: anchors.centerRef.y - 15 }}
                end={{ x: anchors.centerRef.x + 100, y: centerY - 80 }}
                label={features[3] ? "Key Insight" : "Reference Customers"}
                align="left"
                labelPos="top"
                delay={55}
            />

            <Annotation
                start={{ x: anchors.centerHustle.x, y: anchors.centerHustle.y }}
                end={{ x: anchors.centerHustle.x + 80, y: centerY + 450 }}
                label={features[4] ? "Automated Action" : "Smart Suggestions"}
                align="left"
                delay={70}
            />

        </AbsoluteFill>
    );
};