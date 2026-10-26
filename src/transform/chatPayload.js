
const MAX_OUTPUT_TOKENS = 200;
const TEMPERATURE = 0.9   //Alta para que la personalidad de Lucy sea fiel al manga y anime
const MAX_TURNS_HISTORY = 12    //Historial que mandamos a Gemini como contexto


export function toApiMessages(uiMessages) {
    return uiMessages.map((msg) => ({

        role: msg.role === "character" ? "model" : "user",
        parts: [{ text: msg.text }],

    }));
}


export function buildPayload({ systemPrompt, uiMessages }) {
    return {
        systemInstruction: {
            parts: [{ text: systemPrompt }],
        },
        contents: toApiMessages(uiMessages),
        generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: TEMPERATURE,
        },
    };
}


export function normalizeAIResponse(raw) {
    const parts = raw?.candidates?.[0]?.content?.parts;
    if(!Array.isArray(parts)) return "";

    return parts
        .filter((p) => p && typeof p.text === "string")
        .map((p) => p.text)
        .join("")
        .trim();

}

// TIPO HELPERS PARA EXTRAER HISTORIAL, PUSH PARA MENSAJES DE USUARIO Y ASISTENTE
export function appendUserMessage(messages, text) {
    return [...messages, { role: "user", text }];
}

export function appendAssistantMessage (messages, text) {
    return [...messages, { role: "character", text }];
}

export function getTrimmedHistory(messages, maxTurns = MAX_TURNS_HISTORY) {
    return messages.slice(-maxTurns);
}