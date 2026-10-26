import { FinishReason } from "@google/generative-ai";

export default function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
    const { contents, systemInstruction, generationConfig } = req.body ?? {};

    if(!Array.isArray(contents) || contents.length === 0) {
        return res.status(400).json({ error: "Contents es requerido y no debe estar vacío." })
    }
    
    return res.status(200).json({
        candidates: [
            {
                content: {
                    parts: [{ text: "Mock desde la serverless. Cableado OK." }],
                    role: "model",
                },
                finishReason: "STOP",
            },
        ],
        usageMetadata : {
            promptTokenCount: 10,
            candidatesTokenCount: 10,
            totalTokenCount: 20,
        },
    });
    
    } catch (error) {
        console.error("Error en api/chat:", error);
        return res.status(500).json({ error: "Error interno del servidor" })
        
    }
}