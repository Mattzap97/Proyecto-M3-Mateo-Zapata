import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

const routes = {
    "/": renderHome,
    "/chat": renderChat,
    "/about": renderAbout,
    
}

export function router () {
    const path = window.location.pathname;
    const render = routes[path] || renderNotFound;

    render();
}