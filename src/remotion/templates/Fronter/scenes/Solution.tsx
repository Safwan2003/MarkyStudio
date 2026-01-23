
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene } from '@/lib/types';
import { ThemeStyles } from '../components/ThemeEngine';
import { Plus, User, Calendar, Tag, ChevronDown, MousePointer2 } from 'lucide-react';

export const Solution = ({ scene, themeStyles }: { scene: Scene, themeStyles: ThemeStyles }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entrance
    const modalPop = spring({ frame, fps, config: { damping: 18 } });
    const contentFade = interpolate(frame, [10, 25], [0, 1]);

    // Cursor Animation
    const cursorX = interpolate(frame, [30, 60], [1200, 960], { extrapolateRight: 'clamp' });
    const cursorY = interpolate(frame, [30, 60], [800, 680], { extrapolateRight: 'clamp' });
    const cursorClick = spring({ frame: frame - 60, fps, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: '#ffbe0b' }}>

            {/* MODAL CONTAINER */}
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: 900, height: 750,
                    backgroundColor: 'white',
                    borderRadius: 40,
                    boxShadow: '0 60px 120px rgba(0,0,0,0.25)',
                    transform: `scale(${modalPop})`,
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                    opacity: modalPop
                }}>
                    {/* Header */}
                    <div style={{ padding: '40px 60px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: 40, fontWeight: 800, color: '#111827' }}>{scene.mainText || "Create project"}</h2>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Plus size={24} color="#9ca3af" />
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, padding: '40px 60px', display: 'flex', flexDirection: 'column', gap: 30, opacity: contentFade }}>
                        {/* Project Name */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <label style={{ fontSize: 18, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Name</label>
                            <div style={{ height: 75, backgroundColor: '#f9fafb', borderRadius: 16, border: '2px solid #f3f4f6', display: 'flex', alignItems: 'center', padding: '0 25px', fontSize: 28, color: '#111827', fontWeight: 600 }}>
                                Agency Website Redesign
                            </div>
                        </div>

                        {/* Meta Fields Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 30 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={{ fontSize: 18, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Assignee</label>
                                <div style={{ height: 70, backgroundColor: '#f9fafb', borderRadius: 16, border: '2px solid #f3f4f6', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
                                    <User size={24} color="#9ca3af" />
                                    <span style={{ fontSize: 22, color: '#4b5563' }}>Marketing Team</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={{ fontSize: 18, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Timeline</label>
                                <div style={{ height: 70, backgroundColor: '#f9fafb', borderRadius: 16, border: '2px solid #f3f4f6', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
                                    <Calendar size={24} color="#9ca3af" />
                                    <span style={{ fontSize: 22, color: '#4b5563' }}>3 Weeks</span>
                                </div>
                            </div>
                        </div>

                        {/* Tag Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <label style={{ fontSize: 18, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Tags</label>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ padding: '8px 20px', backgroundColor: '#eef2ff', color: '#6366f1', borderRadius: 100, fontSize: 18, fontWeight: 700 }}>HIGH PRIORITY</div>
                                <div style={{ padding: '8px 20px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: 100, fontSize: 18, fontWeight: 700 }}>URGENT</div>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div style={{ flex: 1 }} />

                        {/* Action Button */}
                        <div style={{
                            height: 90,
                            backgroundColor: themeStyles.colors.primary,
                            borderRadius: 20,
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: 'white', fontSize: 32, fontWeight: 900,
                            boxShadow: `0 20px 40px ${themeStyles.colors.primary}44`,
                            transform: `scale(${1 - cursorClick * 0.05})`
                        }}>
                            {scene.subText || "Start Project"}
                        </div>
                    </div>
                </div>
            </AbsoluteFill>

            {/* CURSOR */}
            <div style={{
                position: 'absolute',
                left: cursorX,
                top: cursorY,
                zIndex: 100,
                transform: `scale(${1 - cursorClick * 0.2}) rotate(-15deg)`,
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
            }}>
                <MousePointer2 size={60} fill="#111" color="white" strokeWidth={2.5} />
            </div>

        </AbsoluteFill>
    );
};
