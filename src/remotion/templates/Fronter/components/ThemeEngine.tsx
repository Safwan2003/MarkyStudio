

export interface ThemeStyles {
    fontFamily: string;
    borderRadius: number;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        success: string;
        warning: string;
        error: string;
        slate: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
    };
    typography: {
        h1: React.CSSProperties;
        h2: React.CSSProperties;
        body: React.CSSProperties;
    };
}

export const getThemeStyles = (brandColor: string = '#2563EB'): ThemeStyles => {
    return {
        fontFamily: 'Inter, sans-serif',
        borderRadius: 24,
        colors: {
            primary: brandColor,
            secondary: '#0F172A', // Deep Navy
            accent: '#3B82F6',
            background: '#FFFFFF',
            surface: '#F8FAFC',
            text: '#0F172A',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            slate: {
                50: '#F8FAFC',
                100: '#F1F5F9',
                200: '#E2E8F0',
                300: '#CBD5E1',
                400: '#94A3B8',
                500: '#64748B',
                600: '#475569',
                700: '#334155',
                800: '#1E293B',
                900: '#0F172A',
            }
        },
        typography: {
            h1: { fontSize: 80, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#0F172A' },
            h2: { fontSize: 50, fontWeight: 800, letterSpacing: '-0.02em', color: '#1E293B' },
            body: { fontSize: 24, fontWeight: 500, lineHeight: 1.5, color: '#475569' },
        },
    };
};

export default getThemeStyles;
