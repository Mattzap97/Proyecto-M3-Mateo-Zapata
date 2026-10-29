
import { 
    LUCY_HEARTFILIA_SYSTEM_PROMPT,
} from "./prompts.js";

import { buildPayload, normalizeAIResponse, getTrimmedHistory } from "../transform/chatPayload.js";
import { fetchJson } from "./fetchJson.js";

const CHAT_ENDPOINT = "/api/chat";



export async function getCharacterReply(uiMessages, systemPrompt = LUCY_HEARTFILIA_SYSTEM_PROMPT) {
    //1. RECORTAR HISTORIAL PARA CONTROLAR TOKENS
    const trimmed = getTrimmedHistory(uiMessages);

    //2. CONSTRUIR PAYLOAD CON SHAPE DE GEMINI
    const payload = buildPayload({
        systemPrompt,
        uiMessages: trimmed,
    })

    //3. LLAMAR A SERVERLESS FUNCTION
    let rawResponse;
    try {
        rawResponse = await fetchJson(CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        
    } catch (error) {
        if(error.status === 429 && error.body?.retryAfterSeconds) {
            error.retryAfterSeconds = error.body.retryAfterSeconds;
        }

        throw error;

        
    }  

    //4. NORMALIZAR LA RESPUESTA A STRING LIMPIO
    const text = normalizeAIResponse(rawResponse);

    const usage = rawResponse?.usageMetadata;
    if(usage) {
        console.log(`[tokens] input: ${usage.promptTokenCount}, output: ${usage.candidatesTokenCount}`);

    }


    return text;

}