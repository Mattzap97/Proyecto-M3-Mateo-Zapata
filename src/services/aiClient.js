import { send as sendToMock } from "./mockLucyApi.js";
import { LUCY_HEARTFILIA_SYSTEM_PROMPT } from "./prompts.js";
import { buildPayload, normalizeAIResponse, getTrimmedHistory } from "../transform/chatPayload.js";


export async function getCharacterReply(uiMessages) {
    //1. RECORTAR HISTORIAL PARA CONTROLAR TOKENS
    const trimmed = getTrimmedHistory(uiMessages);

    //2. CONSTRUIR PAYLOAD CON SHAPE DE GEMINI
    const payload = buildPayload({
        systemPrompt: LUCY_HEARTFILIA_SYSTEM_PROMPT,
        uiMessages: trimmed,
    })

    //3. LLAMAR AL MOCK (FETCH A api/chat.js)
    const rawResponse = await sendToMock(payload);

    //4. NOTMALIZAR LA RESPUESTA A STRING LIMPIO
    const text = normalizeAIResponse(rawResponse);

    const usage = rawResponse?.usageMetadata;
    if(usage) {
        console.log(`[tokens] input: ${usage.promptTokenCount}, output: ${usage.candidatesTokenCount}`);

    }


    return text;

}