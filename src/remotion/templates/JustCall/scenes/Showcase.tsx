import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Scene } from '@/lib/types';
import { ThemeStyles } from '../../Pretaa/components/ThemeEngine';

export const Showcase = ({ scene, themeStyles, brand }: { scene: Scene, themeStyles: ThemeStyles, brand: any }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entry animation
    const slideUp = spring({ frame, fps, config: { damping: 20 } });
    const y = interpolate(slideUp, [0, 1], [100, 0]);

    // Background movement
    const bgPan = interpolate(frame, [0, 300], [0, -30]);

    // Floating animation for the browser window
    const floatY = Math.sin(frame * 0.05) * 10;

    return (
        <AbsoluteFill className="bg-[#f8fafc] flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Pattern: Subtle Dots (Consistent) */}
            {/* 1. Dynamic "Focus" Background (Blue/Slate) */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Orb 1: Slate Structure */}
                <div
                    className="absolute top-[-30%] left-[10%] w-[900px] h-[900px] bg-[#64748b] rounded-full blur-[150px] opacity-10 mix-blend-multiply"
                    style={{
                        transform: `scale(${interpolate(frame, [0, 200], [0.9, 1.1])})`
                    }}
                />
                {/* Orb 2: Blue Depth */}
                <div
                    className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#3b82f6] rounded-full blur-[140px] opacity-15 mix-blend-multiply"
                    style={{
                        transform: `translate(${Math.cos(frame * 0.02) * 40}px, 0)`
                    }}
                />
            </div>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.3]"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    transform: `translateY(${bgPan}px)`
                }}
            />

            {/* Flash Transition Overlay (Start of scene) */}
            <div
                className="absolute inset-0 bg-white pointer-events-none z-50"
                style={{
                    opacity: interpolate(frame, [0, 8], [1, 0])
                }}
            />

            {/* Browser Window Construction */}
            <div
                className="w-[85%] h-[85%] bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden relative z-10"
                style={{
                    transform: `translateY(${y + floatY}px)`
                }}
            >
                {/* Browser Toolbar */}
                <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    {/* Fake URL Bar */}
                    <div className="flex-1 max-w-2xl mx-auto h-6 bg-white border border-gray-200 rounded-md flex items-center px-3">
                        <div className="w-3 h-3 text-gray-400">🔒</div>
                        <div className="ml-2 w-32 h-2 bg-gray-100 rounded-full" />
                    </div>
                </div>

                {/* Browser Content Area (Specific Dashboard Construction) */}
                <div className="flex-1 bg-[#f8fafc] flex p-6 gap-6 font-sans">
                    {/* Sidebar - Slide In */}
                    <div
                        className="w-16 flex flex-col items-center gap-6 pt-2"
                        style={{
                            transform: `translateX(${interpolate(spring({ frame: frame - 15, fps }), [0, 1], [-50, 0])}px)`,
                            opacity: interpolate(frame, [15, 25], [0, 1])
                        }}
                    >
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                        </div>
                        {[1, 2, 3, 4, 5].map((item, i) => (
                            <div
                                key={item}
                                className="w-8 h-8 rounded-lg text-slate-400 flex items-center justify-center bg-white shadow-sm transition-all"
                                style={{
                                    // Pop in + Continuous Float
                                    transform: `
                                        scale(${spring({ frame: frame - 20 - (i * 3), fps })}) 
                                        translateY(${Math.sin((frame + i * 10) * 0.05) * 3}px)
                                    `
                                }}
                            >
                                <div className="w-4 h-4 border-2 border-current rounded-sm opacity-50" />
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="flex-1 flex gap-6">
                        {/* Column 1: Stats Cards - Pop In */}
                        <div className="w-1/3 flex flex-col gap-6">
                            {/* Live Calls Card */}
                            <div
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center h-48 relative overflow-hidden"
                                style={{
                                    transform: `scale(${spring({ frame: frame - 25, fps, config: { damping: 12 } })})`,
                                    opacity: interpolate(frame, [25, 30], [0, 1])
                                }}
                            >
                                <div className="absolute top-0 inset-x-0 h-12 bg-blue-100/50 flex items-center justify-center text-blue-900 font-semibold text-sm">
                                    {scene.mainText || "Live Calls"}
                                </div>
                                <div className="text-7xl font-bold text-slate-800 mt-6">
                                    {scene.stats?.[0]?.value || "13"}
                                </div>
                            </div>

                            {/* Outbound Card */}
                            <div
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center h-32 relative overflow-hidden"
                                style={{
                                    transform: `scale(${spring({ frame: frame - 30, fps, config: { damping: 12 } })})`,
                                    opacity: interpolate(frame, [30, 35], [0, 1])
                                }}
                            >
                                <div className="absolute top-0 inset-x-0 h-10 bg-slate-100 flex items-center justify-between px-6 text-slate-600 font-medium text-xs">
                                    <span>{scene.stats?.[1]?.label || "Outbound"}</span>
                                    <span>Answered</span>
                                </div>
                                <div className="flex gap-8 mt-6">
                                    <div className="text-4xl font-bold text-slate-800">{scene.stats?.[1]?.value || "12"}</div>
                                    <div className="text-4xl font-bold text-slate-800">1</div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Agent List - Slide Up Staggered */}
                        <div
                            className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col"
                            style={{
                                transform: `translateY(${interpolate(spring({ frame: frame - 25, fps }), [0, 1], [50, 0])}px)`,
                                opacity: interpolate(frame, [25, 35], [0, 1])
                            }}
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-slate-800 text-lg">Live Calls</h3>
                                    <span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded-full font-bold">13</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: 'Anna Coxx', status: 'Live' },
                                    { name: 'Henry Stevens', status: 'Live' },
                                    { name: 'William Smith', status: 'Live' },
                                    { name: 'Elijah Nora', status: 'Live' },
                                    { name: 'Evelyn Lara', status: 'Live' },
                                ].map((agent, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between group"
                                        style={{
                                            transform: `translateX(${interpolate(spring({ frame: frame - 35 - (i * 3), fps }), [0, 1], [30, 0])}px)`,
                                            opacity: interpolate(frame, [35 + (i * 2), 40 + (i * 2)], [0, 1])
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`}
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-slate-700 text-sm">{agent.name}</span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full tracking-wider">
                                                {agent.status}
                                            </div>
                                            <div className="px-4 py-1.5 bg-[#4ade80] text-white text-xs font-semibold rounded hover:bg-[#22c55e] transition-colors cursor-pointer shadow-sm shadow-green-200">
                                                Monitor
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Bubbles - Rapid Fire */}
            {scene.features?.map((feature, i) => {
                const delay = 15 + (i * 5); // Fast stagger (5 frames apart)
                const bubbleScale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 200 } });
                if (frame < delay) return null;

                return (
                    <div key={i} style={{
                        position: 'absolute',
                        right: 80,
                        top: 250 + (i * 100),
                        transform: `scale(${bubbleScale})`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        zIndex: 20
                    }} className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold border-2 border-white">
                        {feature.title}
                    </div>
                );
            })}

        </AbsoluteFill>
    );
};
