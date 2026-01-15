// Viable Template - Visual Style Guide (Light Mode)
// Dynamic color system - accent color comes from brand props

// Helper to generate color variants from an accent color
export const createColorPalette = (accentColor: string) => ({
    // Background Gradients (Light, clean theme)
    background: {
        start: '#f8fafc',
        mid: '#f1f5f9',
        end: '#e2e8f0',
        blobs: [
            `${accentColor}33`, // 20% opacity
            `${accentColor}11`, // 7% opacity
        ]
    },

    // Accent Colors (derived from brand)
    accent: {
        primary: accentColor,
        light: `${accentColor}ee`,
        glow: `${accentColor}40`,
        subtle: `${accentColor}1a`,
        text: accentColor
    },

    // Glass/UI Elements (Premium Light Mode)
    glass: {
        background: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        blur: 20,
        shadow: '0 20px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5)'
    },

    // Typography
    text: {
        primary: '#1e293b',    // Slate 800
        secondary: '#64748b',  // Slate 500
        accent: accentColor,
        muted: '#94a3b8'       // Slate 400
    }
});

// Default palette with violet accent
export const VIABLE_COLORS = createColorPalette('#8b5cf6');

export const VIABLE_TYPOGRAPHY = {
    fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    sizes: {
        hero: { size: 96, weight: 900, letterSpacing: '-3px' },
        headline: { size: 72, weight: 800, letterSpacing: '-2px' },
        title: { size: 56, weight: 800, letterSpacing: '-1.5px' },
        subtitle: { size: 28, weight: 600, letterSpacing: '0' },
        body: { size: 18, weight: 500, letterSpacing: '0' },
        small: { size: 14, weight: 700, letterSpacing: '0.05em' }
    }
};

export const VIABLE_ANIMATIONS = {
    spring: {
        gentle: { damping: 20, mass: 1.0, stiffness: 100 },
        snappy: { damping: 15, mass: 0.5, stiffness: 200 },
        bouncy: { damping: 10, mass: 0.8, stiffness: 150 },
        logo: { damping: 12, stiffness: 100 },
        card: { damping: 15, stiffness: 80 }
    },

    stagger: {
        letters: 2,   // frames between letters
        cards: 12,    // frames between cards
        elements: 8   // frames between elements
    }
};

export const VIABLE_EFFECTS = {
    glow: (color: string, intensity = 0.2) =>
        `0 0 40px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,

    cardShadow: (color: string) =>
        `0 30px 60px -12px rgba(0, 0, 0, 0.12), 0 0 30px ${color}15`,

    gradientText: (color: string) =>
        `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
};
