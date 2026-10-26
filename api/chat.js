import { GoogleGenerativeAI } from "@google/generative-ai";

const RETRY_AFTER_FALLBACK_SECONDS = 10;

export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
    const { contents, systemInstruction, generationConfig } = req.body ?? {};

    if(!Array.isArray(contents) || contents.length === 0) {
        return res.status(400).json({ error: "Contents es requerido y no debe estar vacío." })
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-lite-latest",
        systemInstruction,
        generationConfig,
    });

    const result = await model.generateContent({contents});

    } catch (error) {
        console.error("Error en api/chat:", error);
        return res.status(500).json({ error: "Error interno del servidor" })
        
    }
}