import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    useCurrentFrame,
    spring,
    interpolate,
    Sequence,
    Easing
} from 'remotion';
import { 
    ChevronLeft, 
    ChevronRight, 
    PieChart, 
    Smartphone, 
    BarChart2,
    Clock,
    Target,
    Settings,
    Menu
} from 'lucide-react';

// --- Theme & Tokens ---

const THEME = {
    bg: '#8B237E', // Deep Viable Purple
    cardBg: '#F3E8FF', // Light lavender dashboard bg
    white: '#FFFFFF',
    textDark: '#1F2937',
    textGray: '#6B7280',
    primary: '#8B237E',
    red: '#DC2626',
    shadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3)',
    font: 'Inter, sans-serif'
};

// --- Sub-Components ---

const SidebarIcon = ({ icon: Icon, active }: any) => (
    <div style={{
        width: 40, height: 40, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? THEME.primary : '#9CA3AF',
        background: active ? '#FCE7F3' : 'transparent',
        borderRadius: 8, marginBottom: 20
    }}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
);

const MainDashboard = ({ style }: { style?: React.CSSProperties }) => (
    <div style={{
        width: 1200, height: 750,
        background: THEME.cardBg,
        borderRadius: 24,
        boxShadow: THEME.shadow,
        display: 'flex',
        overflow: 'hidden',
        fontFamily: THEME.font,
        ...style
    }}>
        {/* Sidebar */}
        <div style={{ width: 80, background: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: THEME.primary, marginBottom: 40 }} />
            <SidebarIcon icon={Target} active />
            <SidebarIcon icon={BarChart2} />
            <SidebarIcon icon={Settings} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 50, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 42, fontWeight: 800, color: THEME.textDark }}>Helpdesk & Chat Analysis</h1>
                    <div style={{ display: 'flex', gap: 60, marginTop: 30 }}>
                        <div>
                            <div style={{ fontSize: 42, fontWeight: 800, color: THEME.textDark }}>220</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: THEME.textGray }}>Datapoints Analyzed</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 42, fontWeight: 800, color: THEME.textDark }}>6.7%</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: THEME.textGray }}>Above Average This Week</div>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: THEME.red }}>Severe</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: THEME.textGray }}>Urgency</div>
                </div>
            </div>

            {/* Chart Container */}
            <div style={{ flex: 1, background: 'white', borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: THEME.textGray }}>Weekly Volume</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: THEME.primary }}>Last 8 weeks</span>
                </div>
                {/* Simulated Chart */}
                <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                    <svg viewBox="0 0 800 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="#F59E0B" stopOpacity="0.8"/>
                                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.8"/>
                            </linearGradient>
                        </defs>
                        <path d="M0,300 L0,250 C100,280 200,220 300,240 C400,260 500,100 600,150 C700,200 800,180 800,180 V300 Z" fill="url(#chartGrad)" />
                    </svg>
                    {/* Grid Lines */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        {[1,2,3,4].map(i => <div key={i} style={{ width: '100%', height: 1, background: '#E5E7EB' }} />)}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TLDRCard = ({ y, opacity, scale }: any) => (
    <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, margin: 'auto',
        width: 800, padding: 40,
        background: 'white', borderRadius: 24,
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
        fontFamily: THEME.font,
        zIndex: 20
    }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: THEME.textDark, marginBottom: 16 }}>TL;DR</h3>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#4B5563', margin: 0 }}>
            Users complain that their app's <span style={{ fontWeight: 700 }}>push notifications are not working</span>. 
            They've tried resetting their phone and reinstalling the app but it still doesn't work.
        </p>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: THEME.textDark }}>Urgency: </span>
            <span style={{ fontSize: 18, fontWeight: 800, color: THEME.red }}>Severe</span>
        </div>
    </div>
);

const MetaCard = ({ y, opacity, scale }: any) => (
    <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, margin: 'auto',
        width: 800, padding: 40,
        background: 'white', borderRadius: 24,
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
        fontFamily: THEME.font,
        zIndex: 30
    }}>
        <h3 style={{ fontSize: 28, fontWeight: 800, color: THEME.textDark, marginBottom: 10 }}>People Discussing This Theme</h3>
        <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 30 }}>Based on metadata, mostly iOS users in North America.</p>
        
        <div style={{ display: 'flex', gap: 40, marginBottom: 30 }}>
            <div style={{ flex: 1, background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Smartphone size={20} />
                    <span style={{ fontWeight: 700 }}>Platform</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: THEME.primary }}>iOS</div>
                <div style={{ fontSize: 14, color: THEME.textGray }}>92% of users</div>
            </div>
            <div style={{ flex: 1, background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <PieChart size={20} />
                    <span style={{ fontWeight: 700 }}>NPS</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: THEME.primary }}>Promoter</div>
                <div style={{ fontSize: 14, color: THEME.textGray }}>55% of users</div>
            </div>
        </div>

        {/* Table Mock */}
        <div style={{ borderTop: '1px solid #E5E7EB' }}>
            {[1, 2, 3].map((_, i) => (
                <div key={i} style={{ display: 'flex', padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ flex: 1, fontWeight: 600, color: '#374151' }}>Platform</div>
                    <div style={{ flex: 1, fontWeight: 600, color: THEME.textDark }}>iOS</div>
                    <div style={{ flex: 1, textAlign: 'right', color: '#6B7280' }}>86 count</div>
                    <div style={{ flex: 1, textAlign: 'right', color: '#6B7280' }}>60.1%</div>
                </div>
            ))}
        </div>
    </div>
);

// --- Main Scene ---

export const Showcase: React.FC = () => {
    const { width, height, fps } = useVideoConfig();
    const frame = useCurrentFrame();

    // 1. Dashboard Entrance (Slide Up)
    const dashboardY = spring({ frame, fps, config: { damping: 20 } });
    const dashboardScale = interpolate(frame, [0, 60], [1, 0.95]); // Slight zoom out to make room
    const dashboardBlur = interpolate(frame, [40, 60], [0, 10]); // Blur when cards appear

    // 2. TL;DR Card (Pop In -> Slide Up)
    const tldrEnter = spring({ frame: frame - 40, fps, config: { damping: 15 } });
    const tldrY = interpolate(tldrEnter, [0, 1], [height, height * 0.3]);
    const tldrExit = interpolate(frame, [100, 120], [1, 0.8]); // Fade out slightly
    const tldrMoveUp = interpolate(frame, [100, 120], [0, -200]); // Move up for next card

    // 3. Metadata Card (Pop In)
    const metaEnter = spring({ frame: frame - 110, fps, config: { damping: 15 } });
    const metaY = interpolate(metaEnter, [0, 1], [height, height * 0.4]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg, alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Dashboard Layer */}
            <div style={{
                transform: `translateY(${interpolate(dashboardY, [0, 1], [500, 0])}px) scale(${dashboardScale})`,
                filter: `blur(${dashboardBlur}px)`,
                opacity: interpolate(dashboardY, [0, 1], [0, 1])
            }}>
                <MainDashboard />
            </div>

            {/* TL;DR Card */}
            {frame > 40 && (
                <TLDRCard 
                    y={tldrY + tldrMoveUp} 
                    scale={tldrEnter} 
                    opacity={tldrEnter * tldrExit} 
                />
            )}

            {/* Metadata Card */}
            {frame > 110 && (
                <MetaCard 
                    y={metaY} 
                    scale={metaEnter} 
                    opacity={metaEnter} 
                />
            )}

        </AbsoluteFill>
    );
};
