export default function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
    const { contents, systemInstruction, generationConfig } = req.body ?? {};
        
    } catch (error) {
        console.error("Error en api/chat:", error);
        return res.status(500).json({ error: "Error interno del servidor" })
        
    }
}