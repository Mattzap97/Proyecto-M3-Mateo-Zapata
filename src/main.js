import { setupLinkInterception } from "./navigation.js";
import { router } from "./router.js";



//AJUSTE QUE PERMITE BORRAR HISTORIAL DE CONVERSACIÓN AL RECARGAR LA PÁGINA
const isReload = performance
    .getEntriesByType("navigation")[0]?.type === "reload";

if (isReload) {
    localStorage.removeItem("chatHistory_Lucy");
    localStorage.removeItem("chatHistory_Natsu");
    localStorage.removeItem("chatHistory_Happy");
}

setupLinkInterception();

window.addEventListener("popstate", router);

router();


