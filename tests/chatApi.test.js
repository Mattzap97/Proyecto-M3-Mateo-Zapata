
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGenerateContent } = vi.hoisted(() => ({
    mockGenerateContent: vi.fn(),
}));

vi.mock("@google/generative-ai", () => ({
    GoogleGenerativeAI: class {
        getGenerativeModel() {
            return {
                generateContent: mockGenerateContent,
            };
        }
    },
}));

import handler from "../api/chat.js";

function createResponse() {
    const res = {
        statusCode: null,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        },
    };

    return res;
}

describe("API de chat con Lucy", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GEMINI_API_KEY = "test-api-key";
    });

    it("rechaza métodos diferentes de POST", async () => {
        const req = { method: "GET", body: {} };
        const res = createResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(405);
        expect(res.body.error).toBe("Método no permitido");
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it("rechaza contents vacío o inválido", async () => {
        const req = { method: "POST", body: { contents: [] } };
        const res = createResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(
            "Contents es requerido y no debe estar vacío."
        );
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it("devuelve la respuesta de Gemini correctamente", async () => {
        const geminiResponse = {
            candidates: [{
                content: {
                    parts: [{ text: "¡Hola! Soy Lucy." }],
                    role: "model",
                },
            }],
        };

        mockGenerateContent.mockResolvedValue({
            response: geminiResponse,
        });

        const req = {
            method: "POST",
            body: {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: "Hola, Lucy" }],
                    },
                ],
                systemInstruction: {
                    parts: [{ text: "Interpreta a Lucy Heartfilia" }],
                },
                generationConfig: {
                    temperature: 0.9,
                },
            },
        };

        const res = createResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(geminiResponse);
        expect(mockGenerateContent).toHaveBeenCalledWith({
            contents: req.body.contents,
        });
    });

    it("maneja los límites de solicitudes con estado 429", async () => {
        mockGenerateContent.mockRejectedValue({ status: 429 });

        const req = {
            method: "POST",
            body: { contents: [{ role: "user", parts: [{ text: "Hola" }] }] },
        };

        const res = createResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(429);
        expect(res.body.retryAfterSeconds).toBe(10);
    });

    it("maneja errores inesperados con estado 500", async () => {
        mockGenerateContent.mockRejectedValue(new Error("Fallo simulado"));

        const req = {
            method: "POST",
            body: { contents: [{ role: "user", parts: [{ text: "Hola" }] }] },
        };

        const res = createResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Error interno del servidor");
    });
});
