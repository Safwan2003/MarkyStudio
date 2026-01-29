export type SceneType = 'hook' | 'intro' | 'problem' | 'solution' | 'showcase' | 'interactive_showcase' | 'social_proof' | 'social-proof' | 'cta' | 'kinetic_typo' | 'device_showcase' | 'bento_grid' | 'isometric_illustration' | 'cta_finale' | 'slot_transition' | 'title_card' | 'image_full' | 'dashboard' | 'transition_how';

export interface SceneConfig {
    layoutVariant?: "centered" | "split" | "offset" | "default";
    animationStyle?: "fade" | "slide" | "zoom" | "typewriter" | "bounce" | "reveal";
    pacing?: "slow" | "medium" | "fast";
    emphasis?: "text" | "visual" | "balanced";
}

export interface Scene {
    id: string | number; // Support both for now, ideally string
    type: SceneType;
    duration: number; // In seconds (was durationInSeconds)
    audioUrl?: string; // Voiceover audio URL

    // Standardized Content Fields
    mainText?: string; // Replaces title, text, headline
    subText?: string;  // Replaces description, subtitle
    voiceoverScript?: string; // For TTS generation

    // Visual Assets
    screenshotUrl?: string; // For device showcases
    mobileScreenshotUrl?: string;
    icon?: string;

    // Structured Data
    features?: { title: string; subtitle?: string; description?: string; icon?: string }[];
    testimonials?: { quote: string; author: string; role?: string; avatar?: string }[];
    stats?: { value: string; label: string }[];

    // Action
    ctaText?: string;
    ctaUrl?: string; // Replaces domain

    // Styling & Behavior
    config?: SceneConfig;

    // Legacy/Template Specific (To be deprecated but kept for now if heavily used in components)
    // director?: any; // REMOVED: Strict Mode
    // theme?: any;    // REMOVED: Strict Mode
    // bentoItems?: any[]; // REMAPPED to features

    // Vision-powered interactive showcase (NEW)
    subscenes?: Subscene[];
}

export interface VideoScript {
    brandName: string;
    brandColor?: string; // Hex
    globalDesign: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        headingFont: string;
        bodyFont: string;
        borderRadius?: string;
        animationSpeed?: "slow" | "medium" | "fast";
        transitionStyle?: "slide" | "fade" | "wipe" | "zoom";
        backgroundStyle?: "gradient" | "solid" | "video";
        personality?: {
            industry?: string;
            tone?: string;
            targetEmotion?: string;
            visualMetaphor?: string;
        };
    };
    scenes: Scene[];
}

// Helper types for components
export interface ThemeStyles {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    headingFont: string;
    bodyFont: string;
    borderRadius: string;
}

export interface LayoutPlan {
    camera?: {
        initialZoom?: number;
        targetZoom?: number;
        panX?: number;
        panY?: number;
        type?: 'zoom' | 'pan' | 'static';
    };
    compositionPerspective?: string;
    components?: any[];
}

// Interaction & Widget Types
export interface InteractionEvent {
    type: 'click' | 'hover' | 'scroll';
    targetId?: string;
    timestamp: number;
    duration?: number;
    coords?: { x: number; y: number };
    triggers?: {
        onStart?: string[];
        onComplete?: string[];
    };
}

export interface InteractionMap {
    events: InteractionEvent[];
}

export interface ComponentOverride {
    id: string;
    type: string;
    content?: {
        text?: string;
        imageUrl?: string;
        [key: string]: any;
    };
    style?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        color?: string;
        backgroundColor?: string;
        opacity?: number;
        scale?: number;
        zIndex?: number;
        borderRadius?: number;
        boxShadow?: string;
        [key: string]: any;
    };
    entrance?: {
        type?: 'fade' | 'slide' | 'pop';
        delay?: number;
        duration?: number;
    };
    [key: string]: any;
}

// ============================================
// Vision-Powered Interactive Showcase Types
// ============================================

export interface UIElement {
    id: string;
    type: 'button' | 'input' | 'textarea' | 'card' | 'modal' | 'dropdown' | 'text' | 'image' | 'container' | 'header' | 'sidebar';
    text?: string;
    position: {
        x: number; // Percentage 0-100
        y: number; // Percentage 0-100
        width?: number;
        height?: number;
    };
    style: {
        backgroundColor?: string;
        color?: string;
        fontSize?: number;
        fontWeight?: number;
        borderRadius?: number;
        padding?: string;
        [key: string]: any;
    };
}

export interface UIAnalysis {
    // Direct HTML/CSS from vision model (new approach)
    html?: string;
    css?: string;

    layout: {
        type: 'sidebar' | 'centered' | 'grid' | 'split' | 'header-content';
        backgroundColor: string;
        mainColor?: string;
        accentColor?: string;
    };
    elements: UIElement[];
    interactions: InteractionSuggestion[];
    colorPalette?: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    typography?: {
        headingFont?: string;
        bodyFont?: string;
    };
}

export interface InteractionSuggestion {
    step: number;
    action: 'click' | 'hover' | 'type' | 'scroll';
    targetId: string;
    description: string;
    stateChange?: {
        type: 'modal-open' | 'modal-close' | 'dropdown-expand' | 'input-fill' | 'highlight' | 'navigate';
        elementId?: string;
        newHTML?: string;
        value?: string;
    };
}

export interface InteractionStep {
    frame: number; // Absolute frame number when to trigger
    action: 'click' | 'hover' | 'type' | 'scroll';
    targetId: string;
    description?: string;
    cursorPath?: Array<{ x: number; y: number; frame: number }>; // Bezier path points
    stateChange?: {
        type: 'modal-open' | 'modal-close' | 'dropdown-expand' | 'input-fill' | 'highlight' | 'navigate';
        elementId?: string;
        newHTML?: string;
        value?: string;
    };
    duration?: number; // Duration of the interaction in frames
}

export interface Subscene {
    id: string;
    duration: number; // In seconds
    html: string; // Generated from vision or user-provided
    css: string; // Scoped styles
    interactions: InteractionStep[];
    voiceoverScript?: string;
    audioUrl?: string;
    metadata?: {
        screenshotUrl?: string; // Original screenshot for reference
        analysisConfidence?: number; // 0-1 score from vision model
    };
}
