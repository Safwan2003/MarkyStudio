"use server";

import { groq } from "@/lib/groq";
import { generateAudio } from "@/lib/tts";
import { VideoScript, Scene } from "@/lib/types";

export async function generateVideoScript(prompt: string): Promise<VideoScript> {
    const systemPrompt = `You are a creative director for high-end SaaS explainer videos.
  Your goal is to generate a JSON script for a 30-60s video based on the user's input.
  
  The video should follow a standard "Problem -> Solution -> Features -> CTA" flow.
  The visual style should be "Agency Quality" - think Stripe, linear.app, or What a Story animations.
  
  Output ONLY valid JSON matching this schema:
  {
    "title": "String",
    "globalStyle": {
      "primaryColor": "Hex",
      "backgroundColor": "Hex",
      "fontFamily": "Inter" 
    },
    "scenes": [
      {
        "id": "uuid",
        "type": "Intro" | "Problem" | "Solution" | "Feature" | "CTA",
        "text": "Main Headline",
        "subText": "Secondary text",
        "voiceOverFragment": "Spoken text for this scene (approx 2 sentences)",
        "durationInSeconds": number,
        "visualCue": "Description of abstract visuals, e.g., 'Floating 3D icons', 'Kinetic typography blast'",
        "highlightColor": "Hex"
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

export async function generateVideoAudio(script: VideoScript): Promise<VideoScript> {
    // Parallelize audio generation for all scenes
    const updatedScenes = await Promise.all(
        script.scenes.map(async (scene) => {
            // Generate audio using the python wrapper
            // Voice could be parameterized later
            const audioUrl = await generateAudio(scene.voiceOverFragment, "en-US-ChristopherNeural"); // Deep male voice suitable for SaaS

            // We don't have an audioUrl field in the schema yet, let's assume we return the scene 
            // but maybe we need to extend the type? 
            // Actually, the Remotion composition needs the audio URL.
            // Let's attach it to the scene object.
            return { ...scene, audioUrl };
        })
    );

    return { ...script, scenes: updatedScenes as any };
}
