import React from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

// Handle Google Fonts loading
export const BrandFontLoader: React.FC<{ fontName?: string }> = ({ fontName = 'Inter' }) => {
    const [handle] = React.useState(() => delayRender('Loading brand font: ' + fontName));

    React.useEffect(() => {
        const loadFont = async () => {
            try {
                // Construct Google Fonts URL
                const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700;800;900&display=swap`;

                // Create link element
                const link = document.createElement('link');
                link.href = fontUrl;
                link.rel = 'stylesheet';

                // Wait for load
                link.onload = () => {
                    console.log(`✅ Loaded brand font: ${fontName}`);
                    continueRender(handle);
                };

                link.onerror = () => {
                    console.error(`❌ Failed to load font: ${fontName}`);
                    continueRender(handle); // Don't block render on failure
                };

                document.head.appendChild(link);
            } catch (e) {
                console.error(e);
                continueRender(handle);
            }
        };

        loadFont();
    }, [fontName, handle]);

    return null;
};
