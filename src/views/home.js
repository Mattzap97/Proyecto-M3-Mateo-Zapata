export function renderHome () {
    const app = document.querySelector("#app");

    app.innerHTML = `
        <section class="view view--home">
            <h1>Chatea con Lucy Heartfilia</h1>
            <img src="./src/Documentacion/assets/Lucy.jpeg" alt="Lucy Heartfilia">
            <p>Talentosa maga celestial de Fairy Tail que destaca por su gran empatía e inteligencia.</p>
            <a class="btn btn--primary"  href="/chat">Chatear con Lucy</a>
        </section>
    `;
}
