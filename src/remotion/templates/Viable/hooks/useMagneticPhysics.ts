import { interpolate, spring, useVideoConfig } from 'remotion';
import { ComponentOverride, InteractionMap } from '../../types/SceneDirector';

interface MagneticOptions {
    intensity?: number; // 0 to 1
    range?: number; // px radius
    type?: 'attract' | 'repel';
}

export const useMagneticPhysics = (
    frame: number,
    componentId: string,
    componentCoords: { x: number, y: number },
    interactionMap?: InteractionMap,
    options: MagneticOptions = {}
) => {
    const { fps } = useVideoConfig();
    const { intensity = 0.5, range = 400, type = 'attract' } = options;

    if (!interactionMap || !interactionMap.events) return { x: 0, y: 0 };

    // Find the current cursor position from the interaction map
    // We look for the most recent cursor_move event before the current frame
    const moveEvents = interactionMap.events
        .filter(e => e.type === 'cursor_move' && e.timestamp <= frame)
        .sort((a, b) => b.timestamp - a.timestamp);

    const currentMove = moveEvents[0];
    if (!currentMove || !currentMove.coords) return { x: 0, y: 0 };

    const cursorX = currentMove.coords.x;
    const cursorY = currentMove.coords.y;

    // Calculate distance
    const dx = cursorX - componentCoords.x;
    const dy = cursorY - componentCoords.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > range) return { x: 0, y: 0 };

    // Calculate displacement intensity based on distance (inverse)
    const power = interpolate(distance, [0, range], [1, 0], {
        extrapolateRight: 'clamp'
    }) * intensity;

    const multiplier = type === 'attract' ? 1 : -1;

    // Apply smooth spring physics to the displacement so it doesn't snap
    const springX = spring({
        frame: frame - currentMove.timestamp,
        fps,
        config: { damping: 15, stiffness: 60 }
    });

    const offsetX = dx * power * multiplier * springX;
    const offsetY = dy * power * multiplier * springX;

    return { x: offsetX, y: offsetY };
};
