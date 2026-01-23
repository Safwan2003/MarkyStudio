
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Scene } from '@/lib/types';
import { ThemeStyles } from '../components/ThemeEngine';
import { Users, AlertTriangle } from 'lucide-react';

export const Problem = ({ scene, themeStyles }: { scene: Scene, themeStyles: ThemeStyles }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entrance 
    const contentEntrance = spring({ frame, fps, config: { damping: 12 } });

    // Collaborators Data (Frame 10 style clusters)
    const collaborators = [
        { role: 'MANAGER', color: '#ff7d00', x: 400, y: 300, delay: 0 },
        { role: 'COPYWRITER', color: '#1e40af', x: 1400, y: 250, delay: 5 },
        { role: 'DESIGNER', color: '#9333ea', x: 1500, y: 800, delay: 10 },
        { role: 'DEVELOPER', color: '#10b981', x: 300, y: 850, delay: 15 },
        { role: 'CLIENT', color: '#f43f5e', x: 1700, y: 550, delay: 20 },
        { role: 'QA TESTER', color: '#3b82f6', x: 200, y: 600, delay: 25 },
    ];

    // The "Agitation" effect
    const agitation = Math.sin(frame / 2) * (frame > 60 ? 2 : 0);

    return (
        <AbsoluteFill style={{ backgroundColor: '#ffbe0b', overflow: 'hidden' }}>

            {/* AGITATION GRID OVERLAY */}
            <AbsoluteFill style={{ opacity: 0.1, pointerEvents: 'none' }}>
                <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: `scale(${1 + Math.sin(frame / 20) * 0.05}) rotate(${Math.sin(frame / 50) * 2}deg)`
                }} />
            </AbsoluteFill>

            {/* CENTRAL PROBLEM INDICATOR */}
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    transform: `scale(${contentEntrance}) translate(${agitation}px, ${agitation}px)`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    zIndex: 10
                }}>
                    <div style={{
                        width: 250, height: 250,
                        borderRadius: '50%',
                        backgroundColor: '#1f2937',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }}>
                        <Users size={120} color="white" />
                        {/* Warning Badge */}
                        <div style={{
                            position: 'absolute', top: 10, right: 10,
                            width: 70, height: 70, borderRadius: '50%',
                            backgroundColor: '#f43f5e', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                            transform: `scale(${spring({ frame: frame - 30, fps })})`
                        }}>
                            <AlertTriangle size={40} color="white" />
                        </div>
                    </div>

                    <div style={{ marginTop: 50, textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: 70, fontWeight: 900, color: '#111827',
                            lineHeight: 1.1, letterSpacing: '-0.02em',
                            fontFamily: themeStyles?.heading?.fontFamily || 'Inter, sans-serif'
                        }}>
                            {scene.mainText || "Too many cooks?"}
                        </h2>
                        <h2 style={{
                            fontSize: 70, fontWeight: 900, color: '#f43f5e',
                            lineHeight: 1.1, letterSpacing: '-0.02em',
                            fontFamily: themeStyles?.heading?.fontFamily || 'Inter, sans-serif'
                        }}>
                            {scene.subText || "Zero coordination."}
                        </h2>
                    </div>
                </div>
            </AbsoluteFill>

            {/* ROLE TAGS (Clustered around) */}
            {collaborators.map((c, i) => {
                const entrance = spring({ frame: frame - c.delay, fps, config: { damping: 15 } });
                const floatY = Math.sin((frame + i * 20) / 40) * 25;
                const floatX = Math.cos((frame + i * 25) / 50) * 15;

                return (
                    <div key={i} style={{
                        position: 'absolute', left: c.x, top: c.y,
                        transform: `translate(-50%, -50%) scale(${entrance}) translate(${floatX}px, ${floatY}px)`,
                        display: 'flex', alignItems: 'center', gap: 20,
                        zIndex: 5
                    }}>
                        {/* Avatar Circle */}
                        <div style={{
                            width: 130, height: 130,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            border: '8px solid white',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            overflow: 'hidden'
                        }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span style={{ fontSize: 40, fontWeight: 'bold', color: '#9ca3af' }}>{c.role[0]}</span>
                            </div>
                        </div>
                        {/* Tag label */}
                        <div style={{
                            backgroundColor: c.color,
                            padding: '12px 30px',
                            borderRadius: 100,
                            color: 'white',
                            fontWeight: 900,
                            fontSize: 26,
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            letterSpacing: '0.05em'
                        }}>
                            {c.role}
                        </div>
                    </div>
                );
            })}

        </AbsoluteFill>
    );
};
