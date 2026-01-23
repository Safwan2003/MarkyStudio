
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

// Use 'gemini-2.0-flash-exp' as it handles high context well.
const VISION_MODEL = "gemini-2.0-flash-exp";

// --- PASS 1: MOTION AUDIT ---
const AUDIT_PROMPT = `You are a Lead Motion Director.
Analyze these keyframes of a SaaS UI animation.
Output a precise "Motion Specification" in JSON format.
Strictly describe:
1. **Layout**: Where elements are placed (flex, absolute, percentages).
2. **Hierarchy**: Usage of z-index, overlay, background.
3. **Typography**: Font sizes, weights, hierarchy (Heading vs Body).
4. **Color Palette**: Dominant colors, backgrounds, accent colors.
5. **Animation Curves**: Describe the movement (e.g., "stiff spring damping: 20", "linear interpolation 0->1").
6. **Assets**: Identify images, icons (lucide-react), or shapes.

Output JSON ONLY:
{
  "layout": "...",
  "hierarchy": "...",
  "typography": "...",
  "colors": "...",
  "animation": "...",
  "assets": "..."
}
`;

// --- PASS 2: IMPLEMENTATION ---
const IMPLEMENTATION_PROMPT = `You are a Principal Remotion Engineer.
You have a "Motion Specification" (from Pass 1) and the Reference Frames.
Write the PIXEL-PERFECT Remotion Component code.

**STRICT RULES:**
1.  **Exports**: Named Export ONLY (e.g., \`export const SceneName = ...\`).
2.  **Props**: Must accept \`({ scene, themeStyles }: { scene: Scene, themeStyles: ThemeStyles })\`.
3.  **Remotion API**:
    -   Use \`<AbsoluteFill>\` for layout.
    -   Use \`spring\` or \`interpolate\` for animations.
    -   Use \`<Img />\` (NOT \`<Image />\`) for images.
4.  **Data Injection**:
    -   Text: \`scene.mainText || 'Default'\`.
    -   Colors: \`themeStyles.colors.primary\`.
5.  **Icons**: Use \`lucide-react\` (e.g., \`Check\`, \`Star\`).

**Output**:
Return ONLY valid TSX code. No markdown fences.
`;

const naturalSort = (a: string, b: string) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

function getSmartSamples(paths: string[], maxSamples: number = 4): string[] { // Reduced to 4 for Reliability
    if (paths.length <= maxSamples) return paths;
    const samples = [];
    const count = paths.length;
    samples.push(paths[0]);
    const step = (count - 1) / (maxSamples - 1);
    for (let i = 1; i < maxSamples - 1; i++) {
        samples.push(paths[Math.round(i * step)]);
    }
    samples.push(paths[count - 1]);
    return samples;
}

function fileToPart(path: string, mimeType: string) {
    return {
        inlineData: {
            mimeType: mimeType,
            data: fs.readFileSync(path).toString("base64")
        }
    };
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(modelName: string, prompt: string, imageParts: any[], context: string): Promise<string> {
    let retries = 10;
    let delay = 60000; // Start with 60s wait (Reliable for Free Tier)

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // For @google/genai SDK v0.1+
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] as any }],
                config: { temperature: 0.1 }
            });
            return response.text?.() || "";
        } catch (error: any) {
            // Check for rate limits or quota issues
            const errMsg = error.message || JSON.stringify(error);
            const isRateLimit = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded");

            if (isRateLimit) {
                console.warn(`[Rate Limit] ${context} (Attempt ${attempt}/${retries}). Waiting ${delay / 1000}s...`);
                await wait(delay);
                delay *= 1.5; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
    throw new Error(`Failed after ${retries} attempts: ${context}`);
}

async function generateMotionAudit(sceneName: string, imagePaths: string[]): Promise<string> {
    console.log(`[Pass 1] Auditing ${sceneName} with ${imagePaths.length} frames...`);
    const imageParts = imagePaths.map(p => fileToPart(p, "image/png"));

    try {
        const text = await generateWithRetry(VISION_MODEL, AUDIT_PROMPT, imageParts, `Audit ${sceneName}`);
        console.log(`[Pass 1] Audit Complete.`);
        return text || "{}";
    } catch (e: any) {
        console.error(`[Pass 1] Audit Failed:`, e.message);
        return "{}";
    }
}

async function generateComponentCode(sceneName: string, imagePaths: string[], audit: string, templateName: string) {
    console.log(`[Pass 2] Implementing ${sceneName}...`);

    const imageParts = imagePaths.map(p => fileToPart(p, "image/png"));
    const promptText = IMPLEMENTATION_PROMPT + `\n\nMOTION SPECIFICATION:\n${audit}\n\nSCENE NAME: ${sceneName}`;

    try {
        const code = await generateWithRetry(VISION_MODEL, promptText, imageParts, `Implement ${sceneName}`);

        if (!code) throw new Error("Empty response from AI");

        const cleanCode = code.replace(/```tsx/g, '').replace(/```/g, '').trim();

        if (!cleanCode.includes(`export const ${sceneName}`)) {
            throw new Error(`Generated code missing export const ${sceneName}`);
        }

        const outputDir = path.join(process.cwd(), 'src', 'remotion', 'templates', templateName, 'scenes');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const filePath = path.join(outputDir, `${sceneName}.tsx`);
        fs.writeFileSync(filePath, cleanCode);

        console.log(`[Success] Generated ${filePath}`);

    } catch (error: any) {
        console.error(`[Fail] ${sceneName} could not be generated:`, error.message);
    }
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("Usage: npx tsx scripts/auto_template.ts <images_folder> <TemplateName>");
        process.exit(1);
    }

    const [inputFolder, templateName] = args;
    const fullInputPath = path.resolve(process.cwd(), inputFolder);

    if (!fs.existsSync(fullInputPath)) {
        console.error("Input folder not found:", fullInputPath);
        process.exit(1);
    }

    const files = fs.readdirSync(fullInputPath).filter(f => f.match(/\.(png|jpg|jpeg)$/i)).sort(naturalSort);
    const scenesMap = new Map<string, string[]>();

    for (const file of files) {
        const lowerFile = file.toLowerCase();
        let sceneName = "Unknown";

        if (lowerFile.includes('hook') || lowerFile.includes('intro')) sceneName = 'Intro';
        else if (lowerFile.includes('problem')) sceneName = 'Problem';
        else if (lowerFile.includes('solution')) sceneName = 'Solution';
        else if (lowerFile.includes('showcase') || lowerFile.includes('dashboard')) sceneName = 'Showcase';
        else if (lowerFile.includes('cta') || lowerFile.includes('finale')) sceneName = 'CTA';
        else if (lowerFile.includes('social') || lowerFile.includes('proof')) sceneName = 'SocialProof';
        else {
            const match = file.match(/^([a-zA-Z_]+)/);
            if (match) sceneName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        }

        if (!scenesMap.has(sceneName)) {
            scenesMap.set(sceneName, []);
        }
        scenesMap.get(sceneName)?.push(path.join(fullInputPath, file));
    }

    const sortedScenes = Array.from(scenesMap.entries());

    console.log(`Found scenes: ${sortedScenes.map(s => s[0]).join(', ')}`);
    for (const [sceneName, paths] of sortedScenes) {
        const selectedPaths = getSmartSamples(paths); // Uses default 4 (Reliable)
        const audit = await generateMotionAudit(sceneName, selectedPaths);
        await generateComponentCode(sceneName, selectedPaths, audit, templateName);

        console.log("Cooling down (5s)...");
        await wait(5000);
    }
}

main();
