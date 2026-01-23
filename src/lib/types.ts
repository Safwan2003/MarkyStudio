export type SceneType = 'hook' | 'intro' | 'problem' | 'solution' | 'showcase' | 'social_proof' | 'social-proof' | 'cta' | 'kinetic_typo' | 'device_showcase' | 'bento_grid' | 'isometric_illustration' | 'cta_finale' | 'slot_transition' | 'title_card' | 'image_full' | 'dashboard' | 'transition_how';

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
