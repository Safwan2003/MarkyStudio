"use client";

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img } from 'remotion';
import { CursorAnimation } from './CursorAnimation';
import { ZoomCamera } from './ZoomCamera';
import { HighlightRing } from './HighlightRing';
import { TypingAnimation } from './TypingAnimation';

/**
 * InteractiveScreen Component
 * 
 * Combines all motion graphics elements into a single scene:
 * - Screenshot/frame display
 * - Zoom camera effects
 * - Cursor animation
 * - Element highlights
 * - Typing animation (NEW)
 * - State transitions (NEW)
 * 
 * This is the main compositor for product demo scenes.
 */

interface CursorMovement {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    startFrame: number;
    durationFrames: number;
    clickAtEnd?: boolean;
    hoverEffect?: boolean;
}

interface ZoomKeyframe {
    frame: number;
    x: number;
    y: number;
    scale: number;
    rotation?: number;
}

interface HighlightConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    startFrame: number;
    durationFrames: number;
    style?: 'pulse' | 'glow' | 'outline' | 'spotlight';
    color?: string;
    borderRadius?: number | string;
}

interface TypingConfig {
    text: string;
    x: number;
    y: number;
    startFrame: number;
    durationFrames: number;
}

interface StateChange {
    frame: number;
    screenshotUrl: string;
}

import { InteractionMap, LayoutPlan } from '../../../types/SceneDirector';
import { WidgetRenderer } from '../Widgets/WidgetRenderer';

interface InteractiveScreenProps {
    // Content
    screenshotUrl?: string;
    frameSequence?: string[];        // For animated captures
    backgroundColor?: string;

    // Motion data
    cursorMovements?: CursorMovement[];
    zoomKeyframes?: ZoomKeyframe[];
    highlights?: HighlightConfig[];

    // Styling
    cursorColor?: string;
    showCursor?: boolean;
    containerStyle?: 'laptop' | 'phone' | 'browser' | 'none';
    accentColor?: string;
    director?: { layoutPlan: LayoutPlan; interactionMap?: InteractionMap };
}

// Helper to map interaction events to internal motion formats
const mapDirectorToInternal = (map: InteractionMap) => {
    const cursor: CursorMovement[] = [];
    const highlights: HighlightConfig[] = [];
    const typing: TypingConfig[] = [];
    const stateChanges: StateChange[] = [];

    let lastX = 960;
    let lastY = 540;

    map.events.forEach(event => {
        if (event.coords) {
            cursor.push({
                startX: lastX,
                startY: lastY,
                endX: event.coords.x,
                endY: event.coords.y,
                startFrame: event.timestamp - (event.duration || 30),
                durationFrames: event.duration || 30,
                clickAtEnd: event.type === 'click',
                hoverEffect: event.type === 'hover'
            });
            lastX = event.coords.x;
            lastY = event.coords.y;
        }

        // Auto-highlight for clicks if no coordinates provided (for component-based highlighting)
        if (event.type === 'click' && event.coords) {
            highlights.push({
                x: event.coords.x,
                y: event.coords.y,
                width: 100, // Pulse size
                height: 100,
                startFrame: event.timestamp,
                durationFrames: 30,
                style: 'pulse'
            });
        }

        // Typing events
        if (event.type === 'typing' && event.value && event.coords) {
            typing.push({
                text: event.value,
                x: event.coords.x,
                y: event.coords.y,
                startFrame: event.timestamp,
                durationFrames: event.duration || 30
            });
        }

        // State changes
        if (event.screenshotUrl) {
            stateChanges.push({
                frame: event.timestamp + (event.duration || 30), // Change AFTER interaction
                screenshotUrl: event.screenshotUrl
            });
        }
    });

    return { cursor, highlights, typing, stateChanges };
};

// Browser Chrome
const BrowserChrome: React.FC<{ children: React.ReactNode; url?: string; accentColor?: string }> = ({
    children, url = 'example.com', accentColor = '#6366f1'
}) => (
    <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 50px 100px rgba(0,0,0,0.3)',
    }}>
        {/* Browser header */}
        <div style={{
            background: '#1a1a2e',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
        }}>
            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            </div>

            {/* URL bar */}
            <div style={{
                flex: 1,
                background: '#0a0a14',
                borderRadius: 8,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>
                <span style={{ color: '#22c55e', fontSize: 12 }}>🔒</span>
                <span style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'monospace' }}>{url}</span>
            </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a14' }}>
            {children}
        </div>
    </div>
);

export const InteractiveScreen: React.FC<InteractiveScreenProps> = ({
    screenshotUrl,
    frameSequence,
    backgroundColor = '#0a0a14',
    cursorMovements = [],
    zoomKeyframes = [],
    highlights = [],
    cursorColor = '#1a1a2e',
    showCursor = true,
    containerStyle = 'browser',
    accentColor = '#6366f1',
    director
}) => {
    const frame = useCurrentFrame();

    // Extract motions from director if available
    const directorData = director?.interactionMap ? mapDirectorToInternal(director.interactionMap) : { cursor: [], highlights: [], typing: [], stateChanges: [] };
    const finalCursor = director?.interactionMap ? directorData.cursor : cursorMovements;
    const finalHighlights = [...highlights, ...directorData.highlights];
    const finalTyping = directorData.typing;
    const stateChanges = directorData.stateChanges;

    // Determine current screenshot based on state changes
    let activeScreenshot = screenshotUrl;
    if (stateChanges.length > 0) {
        const pastChanges = stateChanges.filter(c => c.frame <= frame);
        if (pastChanges.length > 0) {
            // Use the most recent change
            activeScreenshot = pastChanges[pastChanges.length - 1].screenshotUrl;
        }
    }

    // For frame sequences (animated captures), select current frame (overrides screenshotUrl)
    if (frameSequence && frameSequence.length > 0) {
        activeScreenshot = frameSequence[Math.min(frame, frameSequence.length - 1)];
    }

    // Render content
    const renderContent = () => (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: backgroundColor,
        }}>
            {/* Screenshot/Frame */}
            {activeScreenshot ? (
                <Img
                    src={activeScreenshot}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%)',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
                        <div style={{ color: '#64748b', fontSize: 16 }}>No Screenshot Available</div>
                        <div style={{ color: '#475569', fontSize: 12, marginTop: 8 }}>Provide a product URL to capture</div>
                    </div>
                </div>
            )}

            {/* V4: Scene Director Widgets Overlay */}
            {director?.layoutPlan && (
                <WidgetRenderer
                    components={director.layoutPlan.components}
                    interactionMap={director.interactionMap}
                    frame={frame}
                />
            )}

            {/* Highlights layer */}
            {finalHighlights.map((highlight, i) => (
                <HighlightRing
                    key={i}
                    x={highlight.x}
                    y={highlight.y}
                    width={highlight.width}
                    height={highlight.height}
                    startFrame={highlight.startFrame}
                    durationFrames={highlight.durationFrames}
                    style={highlight.style}
                    color={highlight.color || accentColor}
                    borderRadius={highlight.borderRadius}
                />
            ))}

            {/* Typing Animation Layer (NEW) */}
            {finalTyping.map((typeEvent, i) => (
                <TypingAnimation
                    key={`typing_${i}`}
                    x={typeEvent.x}
                    y={typeEvent.y}
                    text={typeEvent.text}
                    startFrame={typeEvent.startFrame}
                    durationFrames={typeEvent.durationFrames}
                    color="#1f2937"
                    fontSize={18}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 4,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
            ))}

            {/* Cursor & Highlights layer (Only if NOT using Director which has its own WidgetRenderer) */}
            {!director && (
                <>
                    {finalHighlights.map((highlight, i) => (
                        <HighlightRing
                            key={i}
                            x={highlight.x}
                            y={highlight.y}
                            width={highlight.width}
                            height={highlight.height}
                            startFrame={highlight.startFrame}
                            durationFrames={highlight.durationFrames}
                            style={highlight.style}
                            color={highlight.color || accentColor}
                            borderRadius={highlight.borderRadius}
                        />
                    ))}

                    {showCursor && finalCursor.length > 0 && (
                        <CursorAnimation
                            movements={finalCursor}
                            cursorColor={cursorColor}
                            cursorStyle="pointer"
                            frame={frame}
                        />
                    )}
                </>
            )}
        </div>
    );

    // Wrap in zoom camera
    const contentWithZoom = zoomKeyframes.length > 0 ? (
        <ZoomCamera keyframes={zoomKeyframes} easing="smooth">
            {renderContent()}
        </ZoomCamera>
    ) : (
        renderContent()
    );

    // Apply container style
    return (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
            {containerStyle === 'browser' ? (
                <BrowserChrome accentColor={accentColor}>
                    {contentWithZoom}
                </BrowserChrome>
            ) : containerStyle === 'none' ? (
                <div style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }}>
                    {contentWithZoom}
                </div>
            ) : (
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.3)',
                }}>
                    {contentWithZoom}
                </div>
            )}
        </AbsoluteFill>
    );
};

export default InteractiveScreen;
