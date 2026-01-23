
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API KEY found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function main() {
    try {
        // There isn't a direct "listModels" on the instance in the node SDK roughly, 
        // but usually we can try a standard model request or look up docs.
        // Actually the SDK doesn't always expose listModels easily in the simplified client.
        // But let's try 'gemini-1.5-pro' text generation to confirm it works.

        console.log("Testing 'gemini-1.5-pro'...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const resultPro = await modelPro.generateContent("Hello");
        console.log("gemini-1.5-pro OK:", resultPro.response.text());

        console.log("Testing 'gemini-1.5-flash'...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Hello");
        console.log("gemini-1.5-flash OK:", resultFlash.response.text());

    } catch (e: any) {
        console.error("Error listing/testing models:", e.message);
    }
}

main();
