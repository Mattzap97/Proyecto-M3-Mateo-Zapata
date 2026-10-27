
export function renderHome () {
    const app = document.querySelector("#app");

    const characters = [
        {
            id: "lucy",
            name: "Lucy Heartfilia",
            description: "Talentosa maga celestial de Fairy Tail que destaca por su gran empatía e inteligencia.",
            image: "./src/Documentacion/assets/Lucy.jpeg",
            button: "Chatear con Lucy",
        },
        {
            id: "natsu",
            name: "Natsu Dragneel",
            description: "Valiente Dragon Slayer de fuego, enérgico, impulsivo y siempre dispuesto a proteger a sus amigos.",
            image: "./src/Documentacion/assets/Natsu.jpeg",
            button: "Chatear con Natsu",
        },
        {
            id: "happy",
            name: "Happy",
            description: "Alegre gato azul alado, bromista y fiel compañero de Natsu, ¡siempre dispuesto a una aventura!",
            image: "./src/Documentacion/assets/Happy.jpeg",
            button: "Chatear con Happy",
        },
    ];

    app.innerHTML = `
        <section class="view view--home">
            <h1>Chatea con tu personaje favorito de Fairy Tail</h1>

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
                            ${character.button}
                        </button>
                    </article>
                `).join("")}
            </div>
        </section>
    `;

    app.querySelectorAll("[data-character]").forEach((button) => {
        button.addEventListener("click", () => {
            const characterId = button.dataset.character;

            sessionStorage.setItem("selectedCharacter", characterId);

            window.history.pushState({}, "", "/chat");
            window.dispatchEvent(new PopStateEvent("popstate"));
        });
    });
}
