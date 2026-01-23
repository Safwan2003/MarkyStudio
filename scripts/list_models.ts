
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function listModels() {
    try {
        const models = await groq.models.list();
        console.log("Available Models:");
        models.data.forEach(m => console.log(`- ${m.id}`));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
