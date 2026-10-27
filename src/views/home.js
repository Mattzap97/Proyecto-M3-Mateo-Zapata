
export function renderHome() {
    const app = document.querySelector("#app");

    

    app.innerHTML = `
        <section class="view view--welcome">
            <div class="welcome__content">
                <p class="welcome__eyebrow">¡El gremio te da la bienvenida!</p>

                <h1>¡Bienvenido a Fairy Tail!</h1>

                <p class="welcome__description">
                    Reúnete con tus personajes favoritos, conversa con ellos
                    y vive nuevas aventuras dentro del gremio.
                </p>

                <a href="/chat" class="btn btn--primary">
                    Conocer a los personajes
                </a>
            </div>
        </section>
    `;
}
