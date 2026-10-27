import { renderHome } from "./views/home.js";
import { renderChat, renderCharacterGallery } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js"



const routes = {
    "/": renderHome,
    "/chat": renderCharacterGallery,
    "/about": renderAbout,
    
}

export function router () {
    const path = window.location.pathname;
    
    // Detectar las rutas individuales de cada personaje
    const chatMatch = path.match(/^\/chat\/(Lucy|Natsu|Happy)\/?$/i);

    if (chatMatch) {
        const characterId =
            chatMatch[1].charAt(0).toUpperCase() +
            chatMatch[1].slice(1).toLowerCase();

        sessionStorage.setItem("selectedCharacter", characterId);
        renderChat();
        return;
    }

    // Resolver las demás rutas
    const render = routes[path] || renderNotFound;
    render();
}