import { getCharacterReply } from "../services/aiClient.js";
import { debounce } from "../services/debounce.js";
import { wait } from "../services/debounce.js";
import { getUserMessage } from "../ui/messages.js";

import {
    LUCY_HEARTFILIA_SYSTEM_PROMPT,
    NATSU_DRAGNEEL_SYSTEM_PROMPT,
    HAPPY_SYSTEM_PROMPT,
} from "../services/prompts.js";




const characters = {
    Lucy: {
        name: "Lucy Heartfilia",
        subtitle: "Maga celestial y miembro de Fairy Tail",
        greeting: "¡Hola! Soy Lucy. ¿De qué te gustaría hablar?",
        prompt: LUCY_HEARTFILIA_SYSTEM_PROMPT,
    },
    Natsu: {
        name: "Natsu Dragneel",
        subtitle: "Dragon Slayer de fuego y miembro de Fairy Tail",
        greeting: "¡Hey! Soy Natsu. ¿Listo para una aventura?",
        prompt: NATSU_DRAGNEEL_SYSTEM_PROMPT,
    },
    Happy: {
        name: "Happy",
        subtitle: "Gato/Exceed azul alado y compañero de Natsu",
        greeting: "¡Aye! Soy Happy. ¿Trajiste pescado?",
        prompt: HAPPY_SYSTEM_PROMPT,
    },
};

/*==============================================================================================================================================
                        FUNCIÓN QUE PERMITE RECUPERAR EL HISTORIAL DE CONVERSACIÓN GUARDADO EN EL CHAT DEL PERSONAJE
================================================================================================================================================*/

function getConversation(characterId) {
    const saved = localStorage.getItem(`chatHistory_${characterId}`);

    if(saved) {

        try {
            
            const messages = JSON.parse(saved);

            if(Array.isArray(messages)) {
                return messages;
            }

        } catch (error) {
            console.error("Error al recuperar el historial:", error);
        }
    }

    return [{
        role: "character",
        text: characters[characterId].greeting,
    }];
}


/*================================================================================================================================================
                                        FUNCIÓN QUE GUARDA LOS MENSAJES DEL PERSONAJE EN EL NAVEGADOR
==================================================================================================================================================*/

function saveConversation(characterId, messages) {

    localStorage.setItem(
        `chatHistory_${characterId}`,
        JSON.stringify(messages),

    );
}



const selectedCharacter = sessionStorage.getItem("selectedCharacter");
const initialCharacter = characters[selectedCharacter] ? selectedCharacter : "Lucy";

const state = {

    character: initialCharacter,
    status: "idle",    // 'idle', 'loading', 'error'
    messages: getConversation(initialCharacter),
    error: null,
    lastUserMessage: null,
    retryCountdown: null,

}


function setState(updates) {

    Object.assign(state, updates);

    if (updates.messages) {
        saveConversation(state.character, state.messages);
    }

    renderChat();
}
    


export function renderChat () {
    const app = document.querySelector("#app");

    const selectedCharacter = sessionStorage.getItem("selectedCharacter");

    if (
        selectedCharacter &&
        characters[selectedCharacter] &&
        selectedCharacter !== state.character
    ) {
        state.character = selectedCharacter;
        state.messages = getConversation(selectedCharacter);
        state.status = "idle";
        state.error = null;
        state.lastUserMessage = null;
        state.retryCountdown = null;
}

    app.innerHTML = `
        <div class="chatApp">
            <header class="chatHeader">
                <h1 class="chatHeader__title">Chat con ${characters[state.character].name}</h1>
                <p class="chatHeader__subtitle">${characters[state.character].subtitle}</p>
                <button class ="chatHeader__clear" id="clearHistory" type="button">Borrar Historial</button>
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
                    autocomplete="off"
                    spellcheck="false"
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
    if(state.status === "loading" && state.retryCountdown !== null) {
        return `
            <div class="message message--character message--typing">
                Esperando para reintentar (${state.retryCountdown} segundos)...
            </div>
        `;

    }

    if(state.status === "loading") {
        return `<div class="message message--character message--typing">${characters[state.character].name} está escribiendo...</div>`;
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
    const $clearHistory = document.querySelector("#clearHistory");


    const debouncedSend = debounce(async () => {
        if(state.status === "loading") return;

        const text = $input.value.trim();
        if(!text) return;

        await sendMessage(text);
        $input.value = "";

        document.querySelector("#chatInput")?.focus();
    }, 200);

    $form.addEventListener("submit", async (event) => {
        event.preventDefault();
        debouncedSend();
        
    })

    $retry?.addEventListener("click", () => {
        if(state.status === "loading") return;
        if(state.lastUserMessage) {
            sendMessage(state.lastUserMessage, true);
        }
    })

    $input.focus();

//CÓDIGO PARA EL FUNCIONAMIENTO DEL BOTÓN PARA BORRAR HISTORIAL DE CONVERSACIÓN EN EL CHAT
    $clearHistory?.addEventListener("click", () => {
        const confirmed = window.confirm(
            `¿Quieres borrar la conversación de ${characters[state.character].name}?`
        );

        if (!confirmed) return;

        localStorage.removeItem(`chatHistory_${state.character}`);

        state.messages = [{
            role: "character",
            text: characters[state.character].greeting,
        }];

        state.status = "idle";
        state.error = null;
        state.lastUserMessage = null;
        state.retryCountdown = null;

        renderChat();

    });
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

            const reply = await getCharacterReply(
                nextMessages,
                characters[state.character].prompt
            );
            setState({
            messages: [... nextMessages, { role: "character", text: reply }],
            status: "idle",
            error: null,
            lastUserMessage: null,
        })
            
        } catch (error) {
            if(error.status === 429) {
                const seconds = error.retryAfterSeconds ?? 5;

                for (let s = seconds; s > 0; s--) {
                    setState({ status: "loading", retryCountdown: s });
                    await wait(1000);
                }

                try {
                    setState({ status: "loading", retryCountdown: null });

                    const reply = await getCharacterReply(
                        nextMessages,
                        characters[state.character].prompt
                    );
                    
                    setState({
                        messages: [...nextMessages, { role: "character", text: reply }],
                        status: "idle",
                        error: null,
                        lastUserMessage: null,
                    })
                    return;
                } catch (errRetry) {
                    setState({
                        status: "error",
                        error: getUserMessage(error),
                    })
                    return;
                }
            }




            setState({
                status: "error",
                error: getUserMessage(error),
            })
            
        }
        
}


function scrollToBottom () {
    
    const $messages = document.querySelector("#chatMessages");

    if($messages) {
        $messages.scrollTop = $messages.scrollHeight;
    }
    
}

