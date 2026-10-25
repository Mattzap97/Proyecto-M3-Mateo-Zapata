
const CANNED_REPLIES = [

    "¡Oye! ¡No es una pregunta tonta! Aunque... ¡podrías haberlo dicho de una forma más amable!",
    "¡Por favor! Después de todas las aventuras que he vivido con Fairy Tail, créeme que he escuchado cosas mucho más extrañas.",
    "¡Jajaja! No tengo ni idea de qué estás hablando, pero estoy segura de que podemos resolverlo juntos.",
    "¡Un momento! ¿Por qué siempre termino metida en estas situaciones? ¡Natsu, Gray, esto también es culpa de ustedes!",
    "Bueno, quizá no tenga todas las respuestas, pero nunca me rindo cuando algo realmente me importa. ¡Ese es mi camino!"

];


function pickReply () {
    return CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
}

function buildOkResponse (replyText, inputTokens) {
    const outputTokens = Math.ceil(replyText.length / 4);

    return {
        candidates: [
            {
                content: {
                    parts: [{ text: replyText }],
                    role: "model",
                },
                finishReason: "STOP",
            },
        ],
        usageMetaData: {
            promptTokenCount: inputTokens,
            candidatesTokenCount: outputTokens,
            totalTokenCount: inputTokens + outputTokens,
        },
    };
}

function estimateInputTokens(payload) {
    const systemText = payload.systemInstruction?.parts?.[0]?.text ?? "";

    const messagesText = (payload.contents ?? [])
        .flatMap((c) => c.parts ?? [])
        .map((p) => p.text ?? "")
        .join(" ");

    return Math.ceil((systemText.length + messagesText.length) / 4);

}



export function send(payload) {

    return new Promise((resolve) => {
        const delay = 600 + Math.random() * 1000;

        setTimeout(() => {

            const inputTokens = estimateInputTokens(payload);
            const reply = pickReply();
            resolve(buildOkResponse(reply, inputTokens));

        }, delay);
    })
}