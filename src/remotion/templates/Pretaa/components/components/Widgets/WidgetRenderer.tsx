import React from 'react';
import { AbsoluteFill, Img, useVideoConfig } from 'remotion';
import { HighlightRing } from '../MotionGraphics/HighlightRing';
import { CursorAnimation } from '../MotionGraphics/CursorAnimation';
import { ComponentOverride, InteractionMap, InteractionEvent } from '../../../types/SceneDirector';
import { useMagneticPhysics } from '../hooks/useMagneticPhysics';
import { ParallaxWrapper } from '../ParallaxWrapper';
import { FloatingBubble } from './FloatingBubble';
import { DataCard } from './DataCard';
import { NeonLine } from './NeonLine';
import { Cursor } from './Cursor';
import { FeatureDetail } from './FeatureDetail';

interface WidgetRendererProps {
    components: ComponentOverride[];
    interactionMap?: InteractionMap;
    frame: number;
}

const ComponentSwitcher: React.FC<{ component: ComponentOverride; frame: number; interactionMap?: InteractionMap }> = ({ component, frame, interactionMap }) => {
    // 🧲 Add Magnetic Physics
    const magneticOffset = useMagneticPhysics(
        frame,
        component.id,
        { x: component.style?.x || 0, y: component.style?.y || 0 },
        interactionMap,
        { intensity: 0.15, range: 500 }
    );

    const renderWidget = () => {
        const key = component.id;
        switch (component.type) {
            case 'Widget.FloatingBubble':
                return <FloatingBubble key={key} data={component} frame={frame} />;
            case 'Widget.DataCard':
                return <DataCard key={key} data={component} frame={frame} />;
            case 'Widget.NeonLine':
                return <NeonLine key={key} data={component} frame={frame} />;
            case 'Widget.Cursor':
                // Identify click events for the cursor
                const clickEvent = interactionMap?.events.find(e => e.type === 'click' && (e.targetId === component.id || !e.targetId));
                return <Cursor key={key} data={component} frame={frame} clickFrame={clickEvent?.timestamp} />;
            case 'Widget.Highlight':
                return (
                    <HighlightRing
                        key={key}
                        x={component.style?.x || 0}
                        y={component.style?.y || 0}
                        width={component.style?.width || 100}
                        height={component.style?.height || 50}
                        startFrame={component.entrance?.delay || 0}
                        durationFrames={component.entrance?.duration || 90}
                        style="pulse"
                        color={component.style?.color || '#6366f1'}
                        borderRadius={component.style?.borderRadius ?? 8}
                    />
                );
            case 'Widget.FeatureDetail':
                return <FeatureDetail key={key} data={component} frame={frame} />;
            case 'Image.Screenshot':
                if (component.style) {
                    return (
                        <div style={{
                            position: 'absolute',
                            left: component.style.x,
                            top: component.style.y,
                            width: component.style.width,
                            height: component.style.height,
                            opacity: component.style.opacity,
                            transform: `scale(${component.style.scale || 1})`,
                            zIndex: component.style.zIndex || 10
                        }}>
                            <Img
                                src={component.content?.imageUrl || ''}
                                style={{
                                    width: '100%',
                                    borderRadius: component.style.borderRadius ?? 16,
                                    boxShadow: component.style.boxShadow || '0 20px 50px rgba(0,0,0,0.2)'
                                }}
                            />
                        </div>
                    );
                }
                return null;
            default:
                return null;
        }
    };

    return (
        <div style={{
            transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
            transition: 'none',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
        }}>
            <ParallaxWrapper zIndex={component.style?.zIndex}>
                {renderWidget()}
            </ParallaxWrapper>
        </div>
    );
};

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ components, interactionMap, frame }) => {

    const getTriggerDelay = (componentId: string, baseDelay: number) => {
        if (!interactionMap) return baseDelay;

        for (const event of interactionMap.events) {
            if (event.triggers?.onStart?.includes(componentId)) {
                return event.timestamp;
            }
            if (event.triggers?.onComplete?.includes(componentId)) {
                const eventDuration = event.duration || 0;
                return event.timestamp + eventDuration;
            }
        }
        return baseDelay;
    };

    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {/* 🖱️ Global Interaction Cursor */}
            {interactionMap && interactionMap.events && (
                <CursorAnimation
                    movements={mapInteractionMapToMovements(interactionMap)}
                    cursorStyle="pointer"
                    cursorColor="#1a1a2e"
                    frame={frame}
                />
            )}

            {components.map((component) => {
                const baseDelay = component.entrance?.delay || 0;
                const effectiveDelay = getTriggerDelay(component.id, baseDelay);

                const dataWithTrigger = {
                    ...component,
                    entrance: {
                        ...component.entrance,
                        delay: effectiveDelay
                    }
                } as ComponentOverride;

                return (
                    <ComponentSwitcher
                        key={component.id}
                        component={dataWithTrigger}
                        frame={frame}
                        interactionMap={interactionMap}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

/**
 * Converts Director interaction events into CursorAnimation movements
 */
function mapInteractionMapToMovements(map: InteractionMap) {
    const movements: any[] = [];

    // Start cursor at a reasonable default if no events exist or for the first move
    let lastX = 960;
    let lastY = 540;

    map.events.forEach((event, i) => {
        if (!event.coords) return;

        movements.push({
            startX: lastX,
            startY: lastY,
            endX: event.coords.x,
            endY: event.coords.y,
            startFrame: event.timestamp - (event.duration || 30), // Start moving before the event timestamp
            durationFrames: event.duration || 30,
            clickAtEnd: event.type === 'click',
            hoverEffect: event.type === 'hover'
        });

        lastX = event.coords.x;
        lastY = event.coords.y;
    });

    return movements;
}
