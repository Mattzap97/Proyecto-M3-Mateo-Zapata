//Filtra posibles errores técnicos (status HTTP, errores de red,) que pueden aparecer

export function getUserMessage (error) {

    if(error?.status >= 500) {
        return "Algo falló dentro del servidor. Intenta de nuevo en unos minutos.";
    }

    if(error?.status === 429) {
        return "La IA está saturada. Intenta de nuevo en un minuto."
    }

    if(error?.name === "TypeError" && error.message.includes("fetch")) {
        return "No pudimos conectar con el servidor. Revisa tu conexión a internet.";
    }

    return "Algo salió mal con la comunicación que conecta nuestros mundos. Intenta de nuevo.";
}