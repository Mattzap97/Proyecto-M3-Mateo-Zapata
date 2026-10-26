
import { describe, it, expect } from "vitest";
import {
    toApiMessages,
    buildPayload,
    normalizeAIResponse,
    appendUserMessage,
    appendAssistantMessage,
    getTrimmedHistory,
} from "../src/transform/chatPayload.js";




describe ("toApiMessages", () => {

    it("Convierte los roles del chat al formato de Gemini", () => {
        const messages = [
            {role: "user", text: "Hola, Lucy"},
            {role: "character", text: "¡Hola!"},
        ]

        expect(toApiMessages(messages)).toEqual([
            { role: "user", parts: [{text: "Hola, Lucy"}] },
            { role: "model", parts: [{text: "¡Hola!"}] },
        ]);
    });
});




describe ("buildPayload", () => {

    it("Construye el payload con prompt, historial y configuración", () => {
        const payload = buildPayload({
            systemPrompt: "Eres Lucy Heartfilia",
            uiMessages: [
                { role: "user", text: "Hola"},
            ],
        });

        expect(payload.systemInstruction.parts[0].text)
            .toBe("Eres Lucy Heartfilia");

        expect(payload.contents).toEqual([
            { role: "user", parts: [{text: "Hola"}] },
        ]);

        expect(payload.generationConfig).toEqual({
            maxOutputTokens: 200,
            temperature: 0.9,

        });
    });
});




describe ("normalizeAIResponse", () => {

    it("Extrae y limpia el texto de la respuesta de Gemini", () => {
        const response = {
            candidates: [{
                content: {
                    parts: [{ text: " ¡Hola, aventurero! "}],
                },
            }],
        };

        expect(normalizeAIResponse(response))
            .toBe("¡Hola, aventurero!");

    });

    it("Devuelve una cadena vacía si no encuentra partes válidas", () => {
        expect(normalizeAIResponse({})).toBe("");
        expect(normalizeAIResponse({
            candidates: [{ content: { parts: [{ text: 123 }] } },]
        })).toBe("");
    });

    it("Combina el texto de varias partes", () => {
        const response = {
            candidates: [{
                content: {
                    parts: [
                        { text: "¡Hola! " },
                        { text: "Soy Lucy."},
                    ],
                },
            }],
        };

        expect(normalizeAIResponse(response)).toBe("¡Hola! Soy Lucy.");

    });
});




describe("appendUserMessage y appendAssistantMessage", () => {

    it("Agrega mensajes sin modificar el historial original", () => {
        const history = [{ role: "user", text: "Hola" }];


        const updated = appendAssistantMessage(history, "¡Hola!");

        expect(updated).toEqual([
            { role: "user", text: "Hola" },
            { role: "character", text: "¡Hola!" },

        ]);

        expect(history).toHaveLength(1);
    });

    it("Agrega un mensaje con el rol correcto", () => {
        const history = [];

        expect(appendUserMessage(history, "¿Cómo estás?")).toEqual([
            { role: "user", text: "¿Cómo estás?" },

        ]);
    });
});




describe("getTrimmedHistory", () => {
    
    it("Conserva solo los ultimos mensajes solicitados", () => {
        const messages = [
            { role: "user", text: "uno" },
            { role: "character", text: "dos" },
            { role: "user", text: "tres" },
        ];

        expect(getTrimmedHistory(messages, 2)).toEqual([
            { role: "character", text: "dos" },
            { role: "user", text: "tres" },
        ]);
    });

    it("No modifica el historial original", () => {
        const messages = [
            { role: "user", text: "Hola" },
            { role: "character", text: "¡Hola!" },
        ];

        getTrimmedHistory(messages, 1);

        expect(messages).toHaveLength(2);

    });
});