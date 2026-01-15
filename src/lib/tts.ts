import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { randomUUID } from "crypto";

const execPromise = promisify(exec);

export async function generateAudio(text: string, voice: string = "en-US-AriaNeural"): Promise<string> {
    const fileName = `${randomUUID()}.mp3`;
    const publicDir = path.join(process.cwd(), "public", "generated");
    const filePath = path.join(publicDir, fileName);

    // Ensure directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Path to the python executable in the venv
    const pythonPath = path.join(process.cwd(), "venv", "bin", "edge-tts");

    // Escape quotes in text to prevent CLI injection/errors
    const safeText = text.replace(/"/g, '\\"');

    const command = `${pythonPath} --voice ${voice} --text "${safeText}" --write-media "${filePath}"`;

    try {
        await execPromise(command);
        return `/generated/${fileName}`; // Return relative path for frontend
    } catch (error) {
        console.error("Error generating audio:", error);
        throw new Error("Failed to generate audio via edge-tts");
    }
}
