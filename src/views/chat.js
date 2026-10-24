const state = {

    status: "idle",    // 'idle', 'loading', 'error'
    messages: [{ role: "character",
        text: "Hola! soy Lucy. ¿De qué te gustaría hablar?"
    }],
    error: null,

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
}