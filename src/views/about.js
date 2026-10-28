
export function renderAbout() {
    const app = document.querySelector("#app");

    app.innerHTML = `
        <section class="view view--about">
            <h1>Sobre este proyecto</h1>

            <p class="about__intro">
                Aplicación web interactiva que permite conversar
                con personajes de Fairy Tail mediante inteligencia artificial.
            </p>

            <div class="about__card">
                <h2>Personajes</h2>

                <p>
                    <strong>Lucy Heartfilia:</strong>
                    Maga celestial inteligente y empática, capaz de invocar
                    espíritus estelares mediante sus llaves mágicas.
                </p>

                <p>
                    <strong>Natsu Dragneel:</strong>
                    Dragon Slayer de fuego, valiente y decidido,
                    siempre dispuesto a proteger a sus amigos.
                </p>

                <p>
                    <strong>Happy:</strong>
                    Gato azul alado, alegre y leal compañero de Natsu,
                    conocido por su humor y su frase «¡Aye!».
                </p>
            </div>

            <div class="about__card">
                <h2>Tecnologías</h2>

                <p>
                    <strong>Stack:</strong>
                    HTML, CSS y JavaScript vanilla con módulos ES nativos,
                    sin frameworks ni bundlers.
                </p>

                <p>
                    <strong>Inteligencia artificial:</strong>
                    Google Gemini, integrada mediante una función serverless
                    de Vercel que protege las credenciales.
                </p>
            </div>

            <div class="about__card">
                <h2>Créditos</h2>

                <p>
                    <strong>Desarrollado por:</strong> Mateo Zapata.
                </p>

                <p>
                    Los personajes de Fairy Tail pertenecen a sus respectivos
                    titulares. La obra original fue creada por Hiro Mashima.
                </p>
            </div>
        </section>
    `;
}
