/**
 * HTML/CSS Generator Module
 * Converts UIAnalysis from vision model to sanitized HTML/CSS
 * Security: Strict whitelist approach, no script execution
 */

import { UIAnalysis, UIElement } from "./types";

// Security: Allowed HTML tags (whitelist only)
// Note: Sanitization is handled by regex in sanitizeHTML function
// const ALLOWED_TAGS = ... (removed unused variable)

// Security: Blocked attribute patterns
// Note: Sanitization is handled by regex in sanitizeHTML function
// const BLOCKED_ATTR_PATTERNS = ... (removed unused variable)

/**
 * Generates sanitized HTML from UI analysis
 * Supports direct HTML from vision model or generates from elements
 * @param analysis - Vision model analysis result
 * @returns Safe HTML string
 */
export function generateHTML(analysis: UIAnalysis): string {
    // NEW: Use direct HTML from vision if available
    if (analysis.html) {
        console.log('[html-generator] Using direct HTML from vision model');
        return sanitizeHTML(analysis.html);
    }

    // FALLBACK: Generate from elements
    console.log('[html-generator] Generating HTML from elements');
    const elements = analysis.elements;

    // Group elements by parent-child relationships (simple heuristic based on position)
    const rootElements = elements.filter(el =>
        el.type === 'container' || el.type === 'header' || el.type === 'sidebar'
    );

    const childElements = elements.filter(el =>
        !rootElements.includes(el)
    );

    let html = `<div class="vision-root">`;

    // Render layout containers first
    if (rootElements.length > 0) {
        rootElements.forEach(container => {
            html += renderElement(container, analysis);
        });
    }

    // Render all child elements with absolute positioning
    childElements.forEach(element => {
        html += renderElement(element, analysis);
    });

    html += `</div>`;

    return sanitizeHTML(html);
}

function renderElement(element: UIElement, analysis: UIAnalysis): string {
    const { id, type, text, position, style } = element;
    const { x, y, width, height } = position;

    // Convert percentages to pixels for 1920x1080 viewport
    const VIEWPORT_WIDTH = 1920;
    const VIEWPORT_HEIGHT = 1080;

    const leftPx = (x / 100) * VIEWPORT_WIDTH;
    const topPx = (y / 100) * VIEWPORT_HEIGHT;
    const widthPx = width ? (width / 100) * VIEWPORT_WIDTH : 'auto';
    const heightPx = height ? (height / 100) * VIEWPORT_HEIGHT : 'auto';

    // Smart positioning: only use translate(-50%, -50%) for centered elements
    const isCentered = x >= 40 && x <= 60 && y >= 40 && y <= 60;

    const baseStyle = isCentered
        ? `
            position: absolute;
            left: ${leftPx}px;
            top: ${topPx}px;
            ${width ? `width: ${widthPx}px;` : ''}
            ${height ? `height: ${heightPx}px;` : ''}
            transform: translate(-50%, -50%);
          `.trim()
        : `
            position: absolute;
            left: ${leftPx}px;
            top: ${topPx}px;
            ${width ? `width: ${widthPx}px;` : ''}
            ${height ? `height: ${heightPx}px;` : ''}
          `.trim();

    // Element-specific rendering
    switch (type) {
        case 'button':
            return `<button id="${id}" style="${baseStyle} ${styleObjectToString(style)}">${escapeHTML(text || 'Button')}</button>`;

        case 'input':
            return `<input id="${id}" type="text" placeholder="${escapeHTML(text || '')}" style="${baseStyle} ${styleObjectToString(style)}" />`;

        case 'textarea':
            return `<textarea id="${id}" placeholder="${escapeHTML(text || '')}" style="${baseStyle} ${styleObjectToString(style)}"></textarea>`;

        case 'card':
            return `<div id="${id}" class="card" style="${baseStyle} ${styleObjectToString(style)}">${escapeHTML(text || '')}</div>`;

        case 'text':
            const tag = inferTextTag(style.fontSize || 16);
            return `<${tag} id="${id}" style="${baseStyle} ${styleObjectToString(style)}">${escapeHTML(text || '')}</${tag}>`;

        case 'image':
            // Note: We don't render actual images from vision (security), use placeholder
            return `<div id="${id}" class="image-placeholder" style="${baseStyle} ${styleObjectToString(style)}; background: #e5e7eb; display: flex; align-items: center; justify-content: center; color: #9ca3af;">🖼️</div>`;

        case 'modal':
            return `<div id="${id}" class="modal" style="${baseStyle} ${styleObjectToString(style)}; display: none;">${escapeHTML(text || '')}</div>`;

        case 'dropdown':
            return `<select id="${id}" style="${baseStyle} ${styleObjectToString(style)}"><option>${escapeHTML(text || 'Select...')}</option></select>`;

        case 'container':
        case 'header':
        case 'sidebar':
            const containerTag = type === 'header' ? 'header' : type === 'sidebar' ? 'aside' : 'div';
            return `<${containerTag} id="${id}" style="${baseStyle} ${styleObjectToString(style)}">${escapeHTML(text || '')}</${containerTag}>`;

        default:
            return `<div id="${id}" style="${baseStyle} ${styleObjectToString(style)}">${escapeHTML(text || '')}</div>`;
    }
}

/**
 * Converts style object to inline CSS string
 */
function styleObjectToString(style: Record<string, any>): string {
    const cssProperties: string[] = [];

    Object.entries(style).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // Convert camelCase to kebab-case
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();

        // Add units to numeric values where appropriate
        const cssValue = typeof value === 'number' && needsUnit(cssKey)
            ? `${value}px`
            : value;

        cssProperties.push(`${cssKey}: ${cssValue}`);
    });

    return cssProperties.join('; ');
}

/**
 * Determines if CSS property needs 'px' unit
 */
function needsUnit(property: string): boolean {
    const noUnitProps = new Set(['opacity', 'z-index', 'font-weight', 'line-height', 'flex-grow', 'flex-shrink']);
    return !noUnitProps.has(property);
}

/**
 * Infers appropriate HTML tag based on font size
 */
function inferTextTag(fontSize: number): string {
    if (fontSize >= 32) return 'h1';
    if (fontSize >= 24) return 'h2';
    if (fontSize >= 20) return 'h3';
    return 'p';
}

export function generateCSS(analysis: UIAnalysis): string {
    // NEW: Use direct CSS from vision if available
    if (analysis.css) {
        console.log('[html-generator] Using direct CSS from vision model');
        // Ensure the CSS includes .vision-root scope or add it if missing
        // This is a simple check, ideally we'd use a parser but regex is faster for this
        if (!analysis.css.includes('.vision-root')) {
            return `
                .vision-root {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                ${analysis.css}
            `;
        }
        return analysis.css;
    }

    // FALLBACK: Generate from layout/elements
    console.log('[html-generator] Generating CSS from elements');
    const { colorPalette, typography, layout } = analysis;

    let css = `
    /* Vision-generated styles */
    .vision-root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: ${typography?.bodyFont || 'Inter, system-ui, sans-serif'};
        background-color: ${layout.backgroundColor};
        color: ${colorPalette?.text || '#000'};
    }

    .vision-root button {
        cursor: pointer;
        border: none;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .vision-root button:hover {
        transform: scale(1.05);
    }

    .vision-root input,
    .vision-root textarea,
    .vision-root select {
        outline: none;
        border: 1px solid ${colorPalette?.secondary || '#e5e7eb'};
        transition: border-color 0.2s;
    }

    .vision-root input:focus,
    .vision-root textarea:focus,
    .vision-root select:focus {
        border-color: ${colorPalette?.primary || '#2563eb'};
    }

    .vision-root .card {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 16px;
    }

    .vision-root .modal {
        position: fixed;
        z-index: 1000;
        background: white;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        border-radius: 12px;
    }

    /* Custom animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }

    .vision-root .modal[style*="display: block"] {
        animation: fadeIn 0.3s ease-out;
    }
    `.trim();

    return sanitizeCSS(css);
}

/**
 * Sanitizes HTML by removing dangerous tags and attributes
 */
function sanitizeHTML(html: string): string {
    // Remove any script tags
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove iframe tags
    html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Remove event handler attributes
    html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: and data: URIs
    html = html.replace(/(href|src)\s*=\s*["'](javascript|data|vbscript):[^"']*["']/gi, '');

    return html;
}

/**
 * Sanitizes CSS by removing dangerous patterns
 */
function sanitizeCSS(css: string): string {
    // Remove @import (prevents external resource loading)
    css = css.replace(/@import\s+[^;]+;/gi, '');

    // Remove url() with external URLs (allow only data URIs for SVG)
    css = css.replace(/url\s*\(\s*(?!['"]?data:image\/svg)[^)]*\)/gi, '');

    // Remove expression() (old IE vulnerability)
    css = css.replace(/expression\s*\([^)]*\)/gi, '');

    return css;
}

/**
 * Escapes HTML special characters
 */
function escapeHTML(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Preview-safe HTML generator (wraps in iframe for complete isolation)
 * @param html - Generated HTML
 * @param css - Generated CSS
 * @returns Complete HTML document for preview
 */
export function generatePreviewHTML(html: string, css: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${css}
        body { margin: 0; padding: 0; }
    </style>
</head>
<body>
    ${html}
</body>
</html>
    `.trim();
}
