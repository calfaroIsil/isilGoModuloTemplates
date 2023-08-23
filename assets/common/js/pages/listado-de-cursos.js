import api from '../modules/API.js';
import auth from '../modules/Auth.js';
import Cursos from '../modules/Cursos.js';

var dataTableInstance;
var modalInstance;

document.addEventListener('DOMContentLoaded', async () => {

    if (!auth.isAuthenticated()) {
        redireccionarAPagina("login.html");
        return;
    }
    ejecutarSiExiste(removePreloader);

    /* CREANDO BOOTSTRAP MODAL */
    modalInstance = new bootstrap.Modal('#detalle-curso', {
        keyboard: false
    });
    /* CREANDO BOOTSTRAP MODAL */

    mostrarCursos();

    const inputBusqueda = document.getElementById("inputBusqueda");
    const btnFiltrar = document.getElementById("btnFiltrar");    
    btnFiltrar.addEventListener('click', busquedaDeCursos);

    const btnEliminarFiltros= document.getElementById("btnEliminarFiltros");
    btnEliminarFiltros.addEventListener('click', eliminarFiltros);
});

function eliminarFiltros() {
    inputBusqueda.value = "";
    btnEliminarFiltros.style.display = "none";

    //destruimos simple-datatables
    if (dataTableInstance !== null) dataTableInstance.destroy();
    dataTableInstance = null;

    //mostramos cargando en la tabla
    const cursosContainer = document.getElementById("cursosContainer");
    cursosContainer.innerHTML = `<tr><td colspan="5" class="text-center">Cargando...</td></tr>`;

    mostrarCursos();
}

async function mostrarCursos() {
    const user = JSON.parse(auth.getUser());
    const token = auth.getToken();
    const cursos = new Cursos(api);
    try {
        const todosLosCursos = await cursos.listCursos(user.id, token);
        console.log(todosLosCursos);
        renderTablaCursos(todosLosCursos);
    }
    catch (error) {
        console.error('Error: ', error);
        alert("Error al cargar las comisiones");
    }
}

async function busquedaDeCursos() {

    //boton filtar
    btnFiltrar.innerHTML = `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>`;
    btnFiltrar.innerHTML += `<span role="status">Buscando...</span>`;
    btnFiltrar.disabled = true;

    //si no está logueado redirecciona a login.html
    if (!auth.isAuthenticated()) {
        redireccionarAPagina("login.html");
        return;
    }

    // si el input de busqueda esta vacio
    inputBusqueda.classList.remove("is-invalid");
    let inputValue = (inputBusqueda.value).trim();
    inputValue = sanitizeInput(inputValue);
    if (inputValue === "") {
        inputBusqueda.classList.add("is-invalid");
        inputBusqueda.focus();

        //habilita boton de filtrar
        btnFiltrar.innerHTML = `Filtrar`;
        btnFiltrar.disabled = false;

        return;
    }


    // si todo esta correcto se buscamos en el API
    
    const user = JSON.parse(auth.getUser());
    const token = auth.getToken();
    const cursos = new Cursos(api);
    try {
        const resultadoBusqueda = await cursos.buscarCursos(user.id, token, inputValue);
        console.log(resultadoBusqueda);
        renderResultadosDeBusqueda(resultadoBusqueda);

        //habilita boton de filtrar
        btnFiltrar.innerHTML = `Filtrar`;
        btnFiltrar.disabled = false;

        //habilita el boton de eliminar filtros
        btnEliminarFiltros.style.display = "inline-block";
    }
    catch (error) {
        console.error('Error: ', error);
        alert("Error al cargar la busqueda");
    }
    // si todo esta correcto se buscamos en el API
}

function renderTablaCursos(todosLosCursos) {

    const cursosContainer = document.getElementById("cursosContainer");

    if (typeof todosLosCursos.carts[0] == "undefined")// CAMBIAR AQUI CUANDO EL API DE ISIL ESTÉ LISTO.
    {
        cursosContainer.innerHTML = `<tr><td colspan="4" class="text-center">No se encontraron cursos.</td></tr>`;
        return;
    }

    const listaTodasLosCursos = todosLosCursos.carts[0].products; //---> CAMBIAR AQUI CUANDO EL API DE ISIL ESTE LISTA

    console.log(listaTodasLosCursos);
    cursosContainer.innerHTML = "";
    listaTodasLosCursos.forEach(curso => {
        cursosContainer.innerHTML += `
        <!-- TABLE ITEM -->
        <tr>
            <td>
                <span class="fst-italic">Agregado el ${curso.discountPercentage}</span>
                <p class="fw-bold mb-0">${curso.title}</p>
            </td>
            <td>
                <div class="fw-bold text-center w-100">${curso.title}</div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic" onclick="test()">Costo del curso:</span>
                    <h4 class="mb-0">
                        <span class="text-decoration-line-through fs-6 me-2 text-orange">
                        S/ ${curso.discountedPrice}</span>
                        <span class="text-nowrap">S/ ${curso.price}</span>
                    </h4>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic">Vendidos:</span>
                    <h4 class="mb-0">${curso.total}</h4>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <button type="button"
                        class="border-0 badge bg-secondary text-decoration-none btnVerTodo" data-curso-id="${curso.id}">
                        <span class="fs-6 fw-normal">ver todo</span>
                        <i class="fa-solid fa-chevron-right ms-2"></i>
                    </button>
                </div>
            </td>
        </tr>
        <!-- TABLE ITEM -->`;
    });

    /* creando simple data tables */
    crearSimpleDataTables();
    /* creando simple data tables */
}

function renderResultadosDeBusqueda(resultadoBusqueda) {
    if (dataTableInstance !== null) dataTableInstance.destroy();
    dataTableInstance = null;

    const cursosContainer = document.getElementById("cursosContainer");
    cursosContainer.innerHTML = `<tr><td colspan="5" class="text-center">Cargando...</td></tr>`;
    
    const listaResultadoCursos = resultadoBusqueda.products; //---> CAMBIAR AQUI CUANDO EL API DE ISIL ESTE LISTA
    if (listaResultadoCursos.length == 0) {
        cursosContainer.innerHTML = `<tr><td colspan="4" class="text-center">No se encontraron resultados.</td></tr>`;
        return;
    }

    cursosContainer.innerHTML = "";
    listaResultadoCursos.forEach(curso => {
        cursosContainer.innerHTML += `
        <!-- TABLE ITEM -->
        <tr>
            <td>
                <span class="fst-italic">Agregado el ${curso.rating}</span>
                <p class="fw-bold mb-0">${curso.title}</p>
            </td>
            <td>
                <div class="fw-bold text-center w-100">${curso.title}</div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic" onclick="test()">Costo del curso:</span>
                    <h4 class="mb-0">
                        <span class="text-decoration-line-through fs-6 me-2 text-orange">
                        S/ ${curso.discountPercentage}</span>
                        <span class="text-nowrap">S/ ${curso.price}</span>
                    </h4>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic">Vendidos:</span>
                    <h4 class="mb-0">${curso.stock}</h4>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <button type="button"
                        class="border-0 badge bg-secondary text-decoration-none btnVerTodo" data-curso-id="${curso.id}">
                        <span class="fs-6 fw-normal">ver todo</span>
                        <i class="fa-solid fa-chevron-right ms-2"></i>
                    </button>
                </div>
            </td>
        </tr>
        <!-- TABLE ITEM -->`;
    });

    /* creando simple data tables */
    crearSimpleDataTables();
    /* creando simple data tables */

}

function crearSimpleDataTables() {
    dataTableInstance = new simpleDatatables.DataTable("#myTable", {
        searchable: false,
        fixedHeight: false,
        destroyable: true,
        perPageSelect: false,
        perPage: 4,
        labels: {
            placeholder: "Escribe para filtrar...",
            searchTitle: "Search within table",
            pageTitle: "Page {page}",
            perPage: "entries per page",
            noRows: "No entries found",
            info: "Mostrando {rows} cursos",
            noResults: "No results match your search query",
        }
    });
    dataTableInstance.on('datatable.page', function (page) {
        agregandoEventoClickABotones();
    });

    agregandoEventoClickABotones();
}

function agregandoEventoClickABotones() {
    /* AGREGANDO EVENTO CLICK AL BOTON "VER TODO" */
    // DATATABLES pierde el evento de click al cambiar de página
    // agreggo el evento cada vez que cambia la pàgina
    const btnVerTodo = document.querySelectorAll(".btnVerTodo");
    btnVerTodo.forEach(boton => {
        boton.addEventListener("click", function () { abrirDetalleCurso(boton.getAttribute("data-curso-id")) });
    });
}

async function abrirDetalleCurso(id) {
    modalInstance.show();

    const tituloCurso = document.getElementById("tituloCurso");
    const categoriaCurso = document.getElementById("categoriaCurso");
    const precioBase = document.getElementById("precioBase");
    const fechaCreadoCurso = document.getElementById("fechaCreadoCurso");
    const PrecioConDescuento = document.getElementById("PrecioConDescuento");
    const descripcionCurso = document.getElementById("descripcionCurso");
    const vecesCompradoCurso = document.getElementById("vecesCompradoCurso");
    const ultimaCompraCurso = document.getElementById("ultimaCompraCurso");
    const modalLoader = document.getElementById("modalLoader");

    tituloCurso.innerHTML = "";
    categoriaCurso.innerHTML = "";
    precioBase.innerHTML = "";
    fechaCreadoCurso.innerHTML = "";
    PrecioConDescuento.innerHTML = "";
    descripcionCurso.innerHTML = "";
    vecesCompradoCurso.innerHTML = "";
    ultimaCompraCurso.innerHTML = "";

    modalLoader.style.display = "flex";

    const token = auth.getToken();
    const cursos = new Cursos(api);
    try {
        const detalleDeCurso = await cursos.detalleDeCurso(token, id);
        console.log(detalleDeCurso);
        modalLoader.style.display = "none";

        tituloCurso.innerHTML = detalleDeCurso.title;
        categoriaCurso.innerHTML = detalleDeCurso.category;
        precioBase.innerHTML = "S/ " + detalleDeCurso.price;
        fechaCreadoCurso.innerHTML = detalleDeCurso.rating;
        PrecioConDescuento.innerHTML = "S/ " + detalleDeCurso.discountPercentage;
        descripcionCurso.innerHTML = detalleDeCurso.description;
        vecesCompradoCurso.innerHTML = detalleDeCurso.stock;
        ultimaCompraCurso.innerHTML = detalleDeCurso.rating;
    }
    catch (error) {
        console.error('Error: ', error);
        alert("Error al cargar el curso");
    }



}


