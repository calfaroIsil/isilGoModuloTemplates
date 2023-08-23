import api from '../modules/API.js';
import auth from '../modules/Auth.js';
import Docentes from '../modules/Docentes.js';

var dataTableInstance;

document.addEventListener('DOMContentLoaded', async () => {

    if (!auth.isAuthenticated()) {
        redireccionarAPagina("login-administrativos.html");
        return;
    }

    ejecutarSiExiste(removePreloader);

    mostrarTodosLosDocentes(); 

    const inputBusqueda = document.getElementById("inputBusqueda");
    const btnFiltrar = document.getElementById("btnFiltrar");    
    btnFiltrar.addEventListener('click', busquedaDeDocentes);

    const btnEliminarFiltros= document.getElementById("btnEliminarFiltros");
    btnEliminarFiltros.addEventListener('click', eliminarFiltros);

   
});

function eliminarFiltros()
{
    inputBusqueda.value = "";
    btnEliminarFiltros.style.display="none";    

    //destruimos simple-datatables
    if(dataTableInstance !== null) dataTableInstance.destroy();
    dataTableInstance = null; 

    //mostramos cargando en la tabla
    const docentesContainer = document.getElementById("docentesContainer");
    docentesContainer.innerHTML = `<tr><td colspan="6" class="text-center">Cargando...</td></tr>`;

    mostrarTodosLosDocentes();
}

async function mostrarTodosLosDocentes()
{
    const user = JSON.parse(auth.getUser());
    const token = auth.getToken();
    const docentes = new Docentes(api);
    try {
        const todosLosDocentes = await docentes.listAllDocentes(user.id, token);
        console.log(todosLosDocentes);
        renderTablaDocentes(todosLosDocentes);        
    }
    catch (error) {
        console.error('Error: ', error);
        alert("Error al cargar los docentes");
    }
}

async function busquedaDeDocentes() {

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
    const docentes = new Docentes(api);
    try {
        const resultadoBusqueda = await docentes.buscarDocentes(user.id, token, inputValue);
        console.log(resultadoBusqueda); 
        renderResultadosDeBusqueda(resultadoBusqueda);

        //habilita boton de filtrar
        btnFiltrar.innerHTML = `Filtrar`;
        btnFiltrar.disabled = false;

        //habilita el boton de eliminar filtros
        btnEliminarFiltros.style.display="inline-block";
    }
    catch (error) {
        console.error('Error: ', error);
        alert("Error al cargar la busqueda");
    }
    // si todo esta correcto se buscamos en el API
}

function renderTablaDocentes(todosLosDocentes) {

    const docentesContainer = document.getElementById("docentesContainer");
    if(typeof todosLosDocentes.users== "undefined")// CAMBIAR AQUI CUANDO EL API DE ISIL ESTÉ LISTO.
    {
        docentesContainer.innerHTML = `<tr><td colspan="4" class="text-center">Aún no tienes comisiones.</td></tr>`;
        return;
    }   
    const listaTodasLosDocentes = todosLosDocentes.users; //---> CAMBIAR AQUI CUANDO EL API DE ISIL ESTE LISTA

    console.log(listaTodasLosDocentes);
    docentesContainer.innerHTML = "";
    listaTodasLosDocentes.forEach(user => {
        docentesContainer.innerHTML += `
        <tr>
            <td>
                <div class="d-flex justify-content-start flex-xl-row flex-column align-items-center">
                    <div class="d-inline-block me-xl-2 me-0 mb-xl-0 mb-3">
                        <img src="${user.image}" alt="docente-image"
                            class="image-table img-thumbnail rounded-circle">
                    </div>
                    <div class="d-inline-block">
                        <p class="fw-bold mb-0">${user.firstName} ${user.lastName}</p>
                        <span class="fst-italic">${user.company.title}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic"></span>
                    <span class="badge bg-success">Activo</span>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic d-xl-none d-inline-block ">Cursos:</span>
                    <h5 class="mb-0">${user.age}</h5>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic d-xl-none d-inline-block ">Tasa(%):</span>
                    <h5 class="mb-0 text-danger">${user.weight}%</h5>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic d-xl-none d-inline-block ">Comisiones
                        Totales:</span>
                    <h5 class="mb-0">S/ ${user.height}</h5>
                </div>
            </td>
            <td>
                <div class="d-flex justify-content-center">
                    <a href="admin-editar-docente?dc=${user.id}" class="btn btn-secondary rounded-1 me-2" data-bs-toggle="tooltip"
                        data-bs-placement="top" data-bs-title="Editar Docente">
                        <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="admin-listado-de-comisiones?dc=${user.id}" class="btn btn-success rounded-1" data-bs-toggle="tooltip"
                        data-bs-placement="top" data-bs-title="Ver comisiones">
                        <i class="fa-solid fa-rectangle-list"></i>
                    </a>
                </div>
            </td>
        </tr>`;
    });

    /* creando simple data tables */
    crearSimpleDataTables();
    /* creando simple data tables */
}

function renderResultadosDeBusqueda(resultadoBusqueda)
{
    if(dataTableInstance !== null) dataTableInstance.destroy();
    dataTableInstance = null; 

    const docentesContainer = document.getElementById("docentesContainer");
    const listaResultadoDocentes = resultadoBusqueda.users; //---> CAMBIAR AQUI CUANDO EL API DE ISIL ESTE LISTA
    if(listaResultadoDocentes.length == 0)
    {
        docentesContainer.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron resultados.</td></tr>`;
        return;
    }

    docentesContainer.innerHTML = "";
    listaResultadoDocentes.forEach(user => {
        docentesContainer.innerHTML += `
        <tr>
            <td>
                <div class="d-flex justify-content-start flex-xl-row flex-column align-items-center">
                    <div class="d-inline-block me-xl-2 me-0 mb-xl-0 mb-3">
                        <img src="${user.image}" alt="docente-image"
                            class="image-table img-thumbnail rounded-circle">
                    </div>
                    <div class="d-inline-block">
                        <p class="fw-bold mb-0">${user.firstName} ${user.lastName}</p>
                        <span class="fst-italic">${user.company.title}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic"></span>
                    <span class="badge bg-success">Activo</span>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic d-xl-none d-inline-block ">Cursos:</span>
                    <h5 class="mb-0">${user.age}</h5>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic d-xl-none d-inline-block ">Tasa(%):</span>
                    <h5 class="mb-0 text-danger">${user.weight}%</h5>
                </div>
            </td>
            <td>
                <div class="text-center">
                    <span class="fst-italic d-xl-none d-inline-block ">Comisiones
                        Totales:</span>
                    <h5 class="mb-0">S/ ${user.height}</h5>
                </div>
            </td>
            <td>
                <div class="d-flex justify-content-center">
                    <a href="admin-editar-docente.html" class="btn btn-secondary rounded-1 me-2" data-bs-toggle="tooltip"
                        data-bs-placement="top" data-bs-title="Editar Docente">
                        <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="admin-listado-de-comisiones.html" class="btn btn-success rounded-1" data-bs-toggle="tooltip"
                        data-bs-placement="top" data-bs-title="Ver comisiones">
                        <i class="fa-solid fa-rectangle-list"></i>
                    </a>
                </div>
            </td>
        </tr>`;
    });

    /* creando simple data tables */
    crearSimpleDataTables();
    /* creando simple data tables */

}

function crearSimpleDataTables()
{
    dataTableInstance = new simpleDatatables.DataTable("#myTable", {
        searchable: false,
        fixedHeight: false,
        destroyable: true,
        perPageSelect: false,
        perPage: 6,
        labels: {
            placeholder: "Escribe para filtrar...",
            searchTitle: "Search within table",
            pageTitle: "Page {page}",
            perPage: "entries per page",
            noRows: "No entries found",
            info: "Mostrando {rows} docentes encontrados",
            noResults: "No results match your search query",
        }
    });
    dataTableInstance.on('datatable.page', function (page) {
        console.log("cambiando");
    });
}

