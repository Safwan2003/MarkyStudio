
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill, Easing } from 'remotion';
import { BrowserFrame } from '../components/BrowserFrame';
import { Cursor } from '../components/Cursor';
import { ThemeStyles } from '../components/ThemeEngine';
import { Scene } from '@/lib/types';
import { LayoutGrid, Plus, Search, Bell, Menu, MoreVertical, Folder, Image, FileText } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px', borderRadius: 8,
        backgroundColor: active ? '#eff6ff' : 'transparent',
        color: active ? '#2563EB' : '#64748b',
        fontWeight: active ? 600 : 500,
        marginBottom: 4, opacity: 0.8
    }}>
        <Icon size={18} />
        <span style={{ fontSize: 14 }}>{label}</span>
    </div>
);

const ProjectCard = ({ title, type, delay, themeStyles, mobile }: any) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const entrance = spring({ frame: frame - delay, fps, config: { damping: 14 } });

    if (mobile) {
        return (
            <div style={{
                transform: `scale(${entrance})`,
                backgroundColor: 'white', borderRadius: 12, padding: 16,
                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16,
                marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {type === 'folder' ? <Folder size={20} color="#64748b" /> : <Image size={20} color="#64748b" />}
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Updated 2m ago</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            transform: `scale(${entrance})`,
            backgroundColor: 'white', borderRadius: 16, padding: 20,
            border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16,
            height: 180, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {type === 'folder' ? <Folder size={24} color="#64748b" /> : <Image size={24} color="#64748b" />}
                </div>
                <MoreVertical size={20} color="#cbd5e1" />
            </div>
            <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Last edited by Sarah</div>
            </div>
            <div style={{ display: 'flex', gap: -8 }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', background: `hsl(${200 + i * 20}, 70%, 80%)`, marginLeft: i > 0 ? -10 : 0 }} />
                ))}
            </div>
        </div>
    );
};

export const Showcase: React.FC<{ scene: Scene, themeStyles: ThemeStyles }> = ({ scene, themeStyles }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // 1. Responsive Transition Logic
    const isMobileTransition = interpolate(frame, [150, 190], [0, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 1, 0.5, 1) });
    const browserWidth = interpolate(isMobileTransition, [0, 1], [1400, 420]);
    const browserHeight = interpolate(isMobileTransition, [0, 1], [900, 850]);

    // 2. Cursor Animation Path
    // Path: Start (low right) -> "New Project" (top right) -> Click -> "Select Image" (center) -> Click -> Hover sidebar
    const cursorX = interpolate(frame,
        [20, 50, 70, 90, 120],
        [1000, 1280, 1280, 700, 200],
        { extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );

    const cursorY = interpolate(frame,
        [20, 50, 70, 90, 120],
        [800, 120, 120, 450, 300],
        { extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );

    const isClick1 = frame >= 55 && frame <= 65;
    const isClick2 = frame >= 95 && frame <= 105;

    // 3. UI States (Modal Appear)
    const showNewProjectModal = frame > 60;
    const modalScale = spring({ frame: frame - 60, fps, config: { damping: 15 } });

    return (
        <AbsoluteFill style={{ backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' }}>

            {/* Background Decor */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />

            {/* BROWSER FRAME */}
            <div style={{ width: browserWidth, height: browserHeight, position: 'relative' }}>
                <BrowserFrame mobile={isMobileTransition > 0.5}>

                    {/* DESKTOP UI */}
                    <div style={{
                        opacity: 1 - isMobileTransition,
                        display: isMobileTransition > 0.8 ? 'none' : 'flex',
                        height: '100%', backgroundColor: '#f8fafc'
                    }}>
                        {/* Sidebar */}
                        <div style={{ width: 280, padding: 24, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: themeStyles.colors.primary, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: themeStyles.colors.primary }} />
                                Fronter
                            </div>
                            <SidebarItem icon={LayoutGrid} label="Dashboard" active />
                            <SidebarItem icon={Folder} label="Projects" />
                            <SidebarItem icon={Bell} label="Notifications" />
                            <div style={{ marginTop: 'auto', padding: 16, background: '#eff6ff', borderRadius: 12 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>Pro Plan</div>
                                <div style={{ fontSize: 12, color: '#60a5fa', marginTop: 4 }}>Example Team</div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div style={{ flex: 1, padding: 40, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Projects</h2>
                                <div style={{
                                    padding: '12px 24px', backgroundColor: themeStyles.colors.primary,
                                    color: 'white', borderRadius: 12, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    transform: isClick1 ? 'scale(0.95)' : 'scale(1)',
                                    transition: 'transform 0.1s'
                                }}>
                                    <Plus size={20} /> New Project
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                                <ProjectCard title="Website Redesign" type="folder" delay={10} />
                                <ProjectCard title="Q3 Marketing Assets" type="image" delay={15} />
                                <ProjectCard title="Mobile App v2" type="folder" delay={20} />
                                <ProjectCard title="Social Media Kit" type="image" delay={25} />
                            </div>
                        </div>

                        {/* NEW PROJECT MODAL OVERLAY */}
                        {showNewProjectModal && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                opacity: modalScale // Fade in backdrop
                            }}>
                                <div style={{
                                    width: 500, padding: 32,
                                    backgroundColor: 'white', borderRadius: 24,
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                    transform: `scale(${modalScale})`,
                                    display: 'flex', flexDirection: 'column', gap: 20
                                }}>
                                    <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Create New Project</h3>
                                    <input placeholder="Project Name" style={{
                                        width: '100%', padding: '16px', borderRadius: 12,
                                        border: '1px solid #e2e8f0', fontSize: 16, background: '#f8fafc'
                                    }} />
                                    <div style={{
                                        padding: 40, border: '2px dashed #cbd5e1', borderRadius: 16,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                                        cursor: 'pointer', backgroundColor: isClick2 ? '#eff6ff' : 'transparent'
                                    }}>
                                        <Image size={32} color={themeStyles.colors.primary} />
                                        <span style={{ color: '#64748b', fontWeight: 500 }}>Click to upload cover image</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                                        <div style={{ flex: 1, padding: 16, textAlign: 'center', fontWeight: 600, color: '#64748b' }}>Cancel</div>
                                        <div style={{ flex: 1, padding: 16, textAlign: 'center', fontWeight: 600, color: 'white', background: themeStyles.colors.primary, borderRadius: 12 }}>Create</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MOBILE UI (Fades In) */}
                    <div style={{
                        opacity: isMobileTransition,
                        display: isMobileTransition < 0.2 ? 'none' : 'flex',
                        flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc', padding: 20
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Menu size={24} color="#0f172a" />
                            <div style={{ fontSize: 18, fontWeight: 800 }}>Fronter</div>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#cbd5e1' }} />
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>My Projects</h2>

                        <ProjectCard title="Website Redesign" type="folder" delay={150} mobile />
                        <ProjectCard title="Q3 Marketing" type="image" delay={155} mobile />
                        <ProjectCard title="Mobile App" type="folder" delay={160} mobile />
                        <ProjectCard title="Social Kit" type="image" delay={165} mobile />
                    </div>

                </BrowserFrame>
            </div>

            {/* INTERACTIVE CURSOR */}
            <Cursor x={cursorX * (isMobileTransition > 0.1 ? 0.3 : 1)} y={cursorY * (isMobileTransition > 0.1 ? 0.8 : 1)} click={isClick1 || isClick2} />

        </AbsoluteFill>
    );
};
