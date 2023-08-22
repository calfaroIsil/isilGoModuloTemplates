/* HABILITANDOI TOOLTIPS */
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
/* HABILITANDOI TOOLTIPS */

/* PRELOADER */
function removePreloader() {
    let preloader = document.getElementById("preloader");
    if(preloader==null) return;
    preloader.style.opacity = "0";
    setTimeout(function () {
        preloader.style.display = "none";
    }, 800);
}
/* PRELOADER */

function stringToAnchor(string) {
    const anchor = document.createElement("a");
    anchor.href = string;
    return anchor;
}

/* REDIRECCIONAR A PÁGINA */
function redireccionarAPagina(url) {
    window.location.href = url;
}
/* REDIRECCIONAR A PÁGINA */

/* METODO PARA EJECUTAR UNA FUNCION SI EXISTE */
function ejecutarSiExiste(nombreFuncion) {
    if (typeof nombreFuncion === "function") {
        nombreFuncion();
    }
}
/* METODO PARA EJECUTAR UNA FUNCION SI EXISTE */

/* METODO ELIMINA CARACTERES ESPECIALES */
function sanitizeInput(input) {
    var sanitizedInput = input.replace(/[^\w\s]/gi, '');
    return sanitizedInput;
}
/* METODO ELIMINA CARACTERES ESPECIALES */
