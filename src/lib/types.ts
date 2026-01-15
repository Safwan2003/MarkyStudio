export type SceneType = 'Intro' | 'Problem' | 'Solution' | 'Feature' | 'CTA' | 'Testimonial';

export interface Scene {
    id: string; // Unique ID for keys
    type: SceneType;
    text: string; // Main headline
    subText?: string; // Secondary text
    voiceOverFragment: string; // The part of the script spoken during this scene
    durationInSeconds: number; // Estimated duration
    visualCue?: string; // For abstract visuals (e.g. "Rising graph")
    highlightColor?: string; // Optional override
    audioUrl?: string; // Generated Audio Path
    // Enhanced fields for Pretaa/Viable
    title?: string;
    // subText already defined above
    mainText?: string; // often acts as title
    backgroundColor?: string;
    mainTextColor?: string;
    elements?: any[]; // Visual elements (badges, cards)
    config?: {
        layoutVariant?: "centered" | "split" | "offset" | "default";
        animationStyle?: "fade" | "slide" | "zoom" | "typewriter" | "bounce";
        pacing?: "slow" | "medium" | "fast";
        emphasis?: "text" | "visual" | "balanced";
    };
    // Specific props
    screenshotUrl?: string;
    mobileScreenshotUrl?: string;
    features?: { title: string; description: string; icon?: string }[];
    quote?: string;
    author?: string;
    ctaText?: string;
    domain?: string;
    // Legacy/Template-specific fields (Pretaa)
    director?: any;
    theme?: any;
    bentoItems?: any[];
    ctaUrl?: string;
    notificationText?: string;
}

export interface FloatingElement {
    type: 'notification' | 'stat_card' | 'feature_badge' | 'testimonial_bubble' | string;
    text?: string;
    label?: string;
    value?: string;
    color?: string;
    position: { top: string | number; left: string | number };
    delay?: number;
}

export interface LayoutPlan {
    components?: any[];
    camera?: any;
    compositionPerspective?: any;
}

export interface VideoScript {
    title: string;
    scenes: Scene[];
    globalStyle: {
        primaryColor: string;
        backgroundColor: string;
        fontFamily: string;
        accentColor?: string;
        secondaryColor?: string;
        textColor?: string;
        headingFont?: string;
        bodyFont?: string;
        borderRadius?: string;
    };
}
