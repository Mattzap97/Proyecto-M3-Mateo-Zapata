import { getCharacterReply } from "../services/aiClient.js";

const state = {

    status: "idle",    // 'idle', 'loading', 'error'
    messages: [{ role: "character",
        text: "Hola! soy Lucy. ¿De qué te gustaría hablar?"
    }],
    error: null,
    lastUserMessage: null,

}


function setState(updates) {

    Object.assign(state, updates);
    renderChat();

}

export function renderChat () {
    const app = document.querySelector("#app");

    app.innerHTML = `
        <div class="chatApp">
            <header class="chatHeader">
                <h1 class="chatHeader__title">Chat</h1>
                <p class="chatHeader__subtitle">Con Lucy Heartfilia, miembro de Fairy Tail</p>
            </header>

            <main class="chatMessages" id="chatMessages" aria-live="polite">
                ${renderMessages()}
                ${renderStatus()}
            </main>

            <form class="chatComposer" id="chatComposer">
                <input
                    class="chatComposer__input"
                    id="chatInput"
                    type="text"
                    placeholder="Escribe un mensaje..."
                    aria-label="Escribe tu mensaje"
                    ${state.status === "loading" ? "disabled" : ""}
                />
                <button class="chatComposer__send" type="submit" ${state.status === "loading" ? "disabled" : ""}>
                    Enviar
                </button>
            </form>
        </div>
    `;

    setupChat();
    scrollToBottom();

}


function renderMessages () {

    return state.messages.map(
        (msg) => `
            <div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>
        `,
    ).join("");
}



function renderStatus () {

    if(state.status === "loading") {
        return `<div class="message message--character message--typing">Lucy está escribiendo...</div>`;
    }

    if(state.status === "error") {
        return `
        <div class="message message--error">
            ${state.error}
            <button class="message__retry" id="retryBtn" type="button">Reintentar</button>
        </div>
        `;
    }

    return "";

}



function escapeHtml(string) {

    const div = document.createElement("div");
    div.textContent = string;
    return div.innerHTML;

}


function setupChat () {

    const $form = document.querySelector("#chatComposer");
    const $input = document.querySelector("#chatInput");
    const $retry = document.querySelector("#retryBtn");

    $form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const text = $input.value.trim();
        if(!text) return;

        await sendMessage(text);
        $input.value = "";
    })

    $retry?.addEventListener("click", () => {
        if(state.lastUserMessage) {
            sendMessage(state.lastUserMessage, true);
        }
    })


    $input.focus();
}


async function sendMessage(text, isRetry = false) {
    const nextMessages = isRetry ? state.messages : [...state.messages, { role: "user", text }];

    setState({
        messages: nextMessages,
        status: "loading",
        error: null,
        lastUserMessage: isRetry ? state.lastUserMessage : text,
    })

    try {
            const reply = await getCharacterReply(nextMessages);
            setState({
            messages: [... nextMessages, { role: "character", text: reply }],
            status: "idle",
            error: null,
            lastUserMessage: null,
        })
            
        } catch (error) {

            setState({
                status: "error",
                error: "Ups, no te pude responder. Reintentalo.",
            })
            
        }
        
}


function scrollToBottom () {
    
    const $messages = document.querySelector("#chatMessages");

    if($messages) {
        $messages.scrollTop = $messages.scrollHeight;
    }
    
}

