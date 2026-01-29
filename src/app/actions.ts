"use server";

import { groq } from "@/lib/groq";
import { generateAudio } from "@/lib/tts";
import { VideoScript, Subscene, InteractionStep } from "@/lib/types";
import { analyzeScreenshotSequence } from "@/lib/vision";
import { generateHTML, generateCSS } from "@/lib/html-generator";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import getMP3Duration from "get-mp3-duration";

export type TemplateType = 'Pretaa' | 'Viable' | 'JustCall' | 'Desklog' | 'Fronter';

export async function generateVideoScript(prompt: string, template: TemplateType = 'Pretaa'): Promise<VideoScript> {
  // Dynamic Narrative Logic (Adaptive Pacing)
  // Instead of forcing a time, we guide the AI to fit the content to the right time.
  const narrativeInstructions = `
  **Dynamic Pacing Strategy (30s - 90s)**:
  - **Short (30-45s)**: Punchy, high-energy. Focus on Hook + Solution + CTA. (Best for social ads)
  - **Standard (45-60s)**: Balanced. Standard 6-part arc. (Best for landing pages)
  - **Deep Dive (60-90s)**: Detailed. Add multiple 'Showcase' or 'Social Proof' scenes. (Best for demos)
  
  **CRITICAL RULE**: Do NOT just stretch standard scenes to fill time. If the video needs to be longer, ADD MORE SCENES (e.g. break 'Showcase' into 3 separate feature scenes).
  
  **Visual Pacing**:
  - Scenes should generally be **3-6 seconds** for high energy.
  - 'Showcase' scenes can be **8-12 seconds** if there is complex voiceover.
  - NEVER make a scenes shorter than 3s (too chaotic) or longer than 15s (too boring).
  `;

  let narrativeStructure = `
  The video MUST follow an Agency Narrative Arc adapted to the input complexity:
  1. **Hook**: Grab attention.
  2. **Problem**: Agitate pain.
  3. **Solution**: Reveal hero.
  4. **Showcase**: Feature deep dives (Repeatable for longer videos).
  5. **Social Proof**: Trust signals.
  6. **CTA**: Final action.
  `;

  // Custom Override for JustCall (Kinetic Vibe)
  if (template === 'JustCall') {
    narrativeStructure = `
      **Tone**: High-Energy, Kinetic, "Commercial" feel.
      **Logic**: 
      - Use shorter, punchier sentences.
      - Favor more scenes with shorter durations over few long scenes.
      - *Example*: Instead of one 15s "Features" list, generate three 5s "Feature Highlight" scenes.
      `;
  }

  const systemPrompt = `You are a creative director for high-end SaaS explainer videos, specifically using the "${template}" design system.
  Your goal is to generate a JSON script for a video based on the user's input.
  
  ${narrativeInstructions}
  
  ${narrativeStructure}

  **Template Specifics**:
  - **Pretaa**: Isometric, 3D abstract, tech-heavy, dark mode.
  - **Viable**: Clean, flat, Apple-style, white/light mode.
  - **JustCall**: Kinetic typography, energetic transitions, commercial vibe.
  
  Output ONLY valid JSON matching this schema exactly (No markdown code blocks, just raw JSON):
  {
    "brandName": "String (Product Name)",
    "globalDesign": {
      "primaryColor": "Hex",
      "secondaryColor": "Hex",
      "accentColor": "Hex",
      "backgroundColor": "Hex",
      "textColor": "Hex",
      "headingFont": "Inter",
      "bodyFont": "Inter"
    },
    "scenes": [
      {
        "id": "number (sequentially 1, 2, 3...)",
        "type": "hook" | "problem" | "solution" | "showcase" | "social_proof" | "cta",
        "duration": number (In seconds. Keep it tight!),
        "mainText": "Main Headline (Short & Punchy)",
        "subText": "Secondary text",
        "voiceoverScript": "Spoken text (Short and energetic)",
        "features": [ { "title": "Feature 1", "description": "Desc" }, { "title": "Feature 2", "description": "Desc" } ] (Only for showcase),
        "testimonials": [ { "quote": "Amazing tool!", "author": "User Name" } ] (Only for social_proof),
        "ctaText": "Call to Action" (Only for cta),
        "ctaUrl": "product.com" (Only for cta)
      }
    ]
  }`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content generated");

  return JSON.parse(content) as VideoScript;
}

export async function generateVideoAudio(script: VideoScript, template: TemplateType = 'Pretaa'): Promise<VideoScript> {
  // Voice Selection logic
  const voice = template === 'JustCall'
    ? "en-US-EricNeural" // Energetic, friendly
    : "en-US-ChristopherNeural"; // Deep, professional (Default)

  console.log(`[Audio] Generating audio with voice: ${voice} for template: ${template}`);

  // Parallelize audio generation for all scenes
  const updatedScenes = await Promise.all(
    script.scenes.map(async (scene) => {
      // 1. Generate audio using the python wrapper (returns relative public path)
      const audioUrl = await generateAudio(scene.voiceoverScript || "Visual scene without audio", voice);

      // 2. Resolve absolute path to measure duration
      // audioUrl is like "/generated/uuid.mp3"
      const absolutePath = path.join(process.cwd(), "public", audioUrl);

      let durationOverride = scene.duration; // Fallback to LLM guess

      try {
        if (fs.existsSync(absolutePath)) {
          const buffer = fs.readFileSync(absolutePath);
          const durationMs = getMP3Duration(buffer);
          const audioDurationSec = durationMs / 1000;

          // 3. Audio-Driven Pacing Logic
          // "Solid and Reliable": Video length = Audio length + tiny buffer.
          // We impose a minimum of 3s to avoid glitchy/too-fast scenes.
          // We add 0.5s buffer for 'breathing room' at the end of speech.
          durationOverride = Math.max(3, audioDurationSec + 0.5);

          console.log(`[Audio Sync] Scene ${scene.id}: Audio=${audioDurationSec.toFixed(2)}s, LLM=${scene.duration}s -> Final=${durationOverride.toFixed(2)}s`);
        }
      } catch (err) {
        console.error("Error reading audio duration:", err);
      }

      // Return scene with BOTH audioUrl and the CORRECT synced duration
      return {
        ...scene,
        audioUrl,
        duration: durationOverride
      };
    })
  );

  return { ...script, scenes: updatedScenes as any };
}

/**
 * Analyzes uploaded screenshots and generates interactive subscenes
 * @param formData - FormData with uploaded screenshot files
 * @returns Array of subscenes with HTML/CSS and interaction timelines
 */
export async function analyzeScreenshotsAndCreateSubscenes(formData: FormData): Promise<Subscene[]> {
  try {
    console.log('[Screenshot Upload] Processing uploaded screenshots...');

    // 1. Extract files from FormData
    const files: File[] = [];
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key.startsWith('screenshot-') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      throw new Error('No screenshot files found in upload');
    }

    console.log(`[Screenshot Upload] Found ${files.length} files`);

    // 2. Save files to temporary directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedPaths: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = path.extname(file.name) || '.png';
      const filename = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, filename);

      // Convert File to Buffer and save
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer as any as Uint8Array);

      savedPaths.push(filePath);
      console.log(`[Screenshot Upload] Saved file ${i + 1}/${files.length}: ${filename}`);
    }

    // 3. Analyze screenshots using Vision LLM
    console.log('[Vision Analysis] Starting batch analysis...');
    const analyses = await analyzeScreenshotSequence(savedPaths);

    // 4. Generate subscenes from analyses
    const subscenes: Subscene[] = analyses.map((analysis, index) => {
      const html = generateHTML(analysis);
      const css = generateCSS(analysis);

      // Convert interaction suggestions to timed steps
      const fps = 30;
      const subsceneDuration = 5; // Default 5 seconds per subscene
      const interactionSteps: InteractionStep[] = [];

      // Allocate time evenly across interactions
      const framesPerInteraction = Math.floor((subsceneDuration * fps) / Math.max(analysis.interactions.length, 1));

      analysis.interactions.forEach((suggestion, idx) => {
        const startFrame = idx * framesPerInteraction;

        // Find target element position for cursor path
        const targetElement = analysis.elements.find(el => el.id === suggestion.targetId);
        const hasPosition = targetElement && targetElement.position;

        const cursorPath = hasPosition ? [
          { x: 50, y: 90, frame: startFrame },                  // Start from bottom center
          {
            x: targetElement?.position?.x ?? 50,
            y: targetElement?.position?.y ?? 50,
            frame: startFrame + framesPerInteraction - 10
          }
        ] : undefined;

        interactionSteps.push({
          frame: startFrame,
          action: suggestion.action,
          targetId: suggestion.targetId,
          description: suggestion.description,
          cursorPath,
          stateChange: suggestion.stateChange,
          duration: framesPerInteraction
        });
      });

      return {
        id: `subscene-${index + 1}`,
        duration: subsceneDuration,
        html,
        css,
        interactions: interactionSteps,
        voiceoverScript: `In this step, ${analysis.interactions.map(i => i.description).join(', then ')}`,
        metadata: {
          screenshotUrl: `/uploads/${path.basename(savedPaths[index])}`,
          analysisConfidence: 0.85 // Placeholder
        }
      };
    });

    console.log(`[Subscene Generation] Created ${subscenes.length} subscenes`);

    return subscenes;

  } catch (error) {
    console.error('[Screenshot Upload] Failed:', error);
    throw new Error(`Screenshot processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

