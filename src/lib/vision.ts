/**
 * Vision Analysis Module
 * Uses Google's Gemini 1.5 Pro vision model to analyze UI screenshots
 * and provide actionable code refinements.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { UIAnalysis, InteractionSuggestion } from "./types";
import fs from "fs";
import path from "path";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_NAME = "gemini-1.5-pro-latest";

/**
 * System prompt for vsual comparison
 */
const VISION_COMPARISON_PROMPT = `You are an expert Visual QA Engineer & Front-end Developer.
Your goal is to ensure the implementation matches the design exactly.

Compare the two images provided:
1. REFERENCE IMAGE (Target Design)
2. ACTUAL IMAGE (Current Render)

Identify specific discrepancies in:
- Layout & Spacing (padding, margins, alignment)
- Typography (font size, weight, family)
- Colors (backgrounds, gradients, shadows)
- Content (missing elements, wrong text)

## OUTPUT FORMAT (JSON)
Return pure JSON without markdown blocks.
{
    "matchScore": <0-100 integer>,
    "criticalDifferences": ["diff 1", "diff 2"],
    "suggestedFixes": [
        {
            "component": "guess the component name (e.g. Intro, Navbar, Hero)",
            "action": "move/resize/recolor",
            "details": "precise css/code instruction (e.g. 'increase padding-top to 40px')"
        }
    ]
}`;

/**
 * Compares a reference image against a current render using Gemini 1.5 Pro
 */
export async function compareImages(referencePath: string, actualPath: string): Promise<any> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }

        console.log(`[Vision] Comparing Ref: ${path.basename(referencePath)} vs Actual: ${path.basename(actualPath)}`);

        // Prepare images for Gemini
        const refPart = {
            inlineData: {
                data: fs.readFileSync(referencePath).toString("base64"),
                mimeType: getImageMimeType(referencePath),
            },
        };
        const actualPart = {
            inlineData: {
                data: fs.readFileSync(actualPath).toString("base64"),
                mimeType: getImageMimeType(actualPath),
            },
        };

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const result = await model.generateContent([
            VISION_COMPARISON_PROMPT,
            "Reference Image:",
            refPart,
            "Actual Render:",
            actualPart,
            "Compare and provide JSON feedback."
        ]);

        const responseText = result.response.text();
        if (!responseText) throw new Error("Empty response from Gemini");

        // Clean JSON formatting
        const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;

        return JSON.parse(jsonString.trim());

    } catch (error) {
        console.error("[Vision] Comparison failed:", error);
        throw error;
    }
}

/**
 * Determines MIME type from file extension
 */
function getImageMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
}

// Legacy exports for compatibility (can be updated to use Gemini if needed later)
export async function analyzeScreenshot(imagePath: string): Promise<UIAnalysis> {
    // Placeholder or implement single image analysis with Gemini if needed
    throw new Error("Single image analysis not yet implemented for Gemini migration");
}

/**
 * Batch analyze multiple screenshots and create subscene timeline
 * @param imagePaths - Array of screenshot file paths in sequence order
 * @returns Array of UI analyses
 */
export async function analyzeScreenshotSequence(imagePaths: string[]): Promise<UIAnalysis[]> {
    console.log(`[Vision] Starting batch analysis of ${imagePaths.length} screenshots`);
    const analyses: UIAnalysis[] = [];
    for (const path of imagePaths) {
        analyses.push(await analyzeScreenshot(path));
    }
    return analyses;
}

export function convertInteractionsToSteps(
    interactions: InteractionSuggestion[],
    startFrame: number = 0,
    fps: number = 30
): Array<{ frame: number; action: string; targetId: string; description?: string; stateChange?: any }> {
    return []; // Placeholder
}
