
const characters = [
    {
        id: "lucy",
        name: "Lucy Heartfilia",
        description: "Maga celestial, amable, valiente y curiosa.",
        greeting: "¡Hola! Soy Lucy. ¿De qué te gustaría hablar?",
        image: "https://placehold.co/300x360?text=Lucy",
    },
    {
        id: "natsu",
        name: "Natsu Dragneel",
        description: "Dragon Slayer de fuego, enérgico y aventurero.",
        greeting: "¡Hey! Soy Natsu. ¿Listo para una aventura?",
        image: "https://placehold.co/300x360?text=Natsu",
    },
    {
        id: "happy",
        name: "Happy",
        description: "Gato azul alado, alegre y bromista.",
        greeting: "¡Aye! Soy Happy. ¿Trajiste pescado?",
        image: "https://placehold.co/300x360?text=Happy",
    },
];

export function renderCharacters() {
    const app = document.querySelector("#app");

    app.innerHTML = `
        <section class="view characters">
            <h1>Elige tu personaje</h1>
            <p>¿Con quién te gustaría conversar hoy?</p>

            <div class="characters__grid">
                ${characters.map((character) => `
                    <article class="characterCard">
                        <img
                            class="characterCard__image"
                            src="${character.image}"
                            alt="${character.name}"
                        />

                        <h2>${character.name}</h2>
                        <p>${character.description}</p>

                        <button
                            class="btn btn--primary"
                            type="button"
                            data-character="${character.id}"
                        >
                            Chatear
                        </button>
                    </article>
                `).join("")}
            </div>
        </section>
    `;

    app.querySelectorAll("[data-character]").forEach((button) => {
        button.addEventListener("click", () => {
            const character = characters.find(
                (item) => item.id === button.dataset.character
            );

            if (!character) return;

            sessionStorage.setItem(
                "selectedCharacter",
                JSON.stringify(character)
            );

            window.history.pushState({}, "", "/chat");
            window.dispatchEvent(new PopStateEvent("popstate"));
        });
    });
}
