import { ComponentOverride } from '../../../types/SceneDirector';

export interface WidgetProps {
    data: ComponentOverride;
    frame: number; // Current frame for animation sync
}
