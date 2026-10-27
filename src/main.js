import { setupLinkInterception } from "./navigation.js";
import { router } from "./router.js";



//AJUSTE QUE PERMITE BORRAR HISTORIAL DE CONVERSACIÓN AL RECARGAR LA PÁGINA
const isReload = performance
    .getEntriesByType("navigation")[0]?.type === "reload";

if (isReload) {
    sessionStorage.removeItem("chatHistory_Lucy");
    sessionStorage.removeItem("chatHistory_Natsu");
    sessionStorage.removeItem("chatHistory_Happy");
}

setupLinkInterception();

window.addEventListener("popstate", router);

router();


