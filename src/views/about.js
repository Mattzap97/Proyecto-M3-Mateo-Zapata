
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
                    Su aventura comienza al unirse al gremio Fairy Tail, donde descubre
                    el valor de la amistad, la confianza y el trabajo en equipo.

                </p>

                <p>
                    <strong>Natsu Dragneel:</strong>
                    Mago de Fairy Tail y Dragon Slayer de Fuego, conocido por su valentía,
                    su espíritu impulsivo y su inquebrantable lealtad hacia sus amigos.
                </p>

                <p>
                    <strong>Happy:</strong>
                    Aunque suele aportar humor a las aventuras, también demuestra
                    valentía y una gran lealtad cuando sus amigos lo necesitan.
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
