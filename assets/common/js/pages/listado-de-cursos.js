import api from '../modules/API.js';
import auth from '../modules/Auth.js';
import Comisiones from '../modules/Cursos.js';

var dataTableInstance;

document.addEventListener('DOMContentLoaded', async () => {

    if (!auth.isAuthenticated()) {
        redireccionarAPagina("login.html");
        return;
    }

    ejecutarSiExiste(removePreloader);

    mostrarTodosLasComisiones(); 

    const inputBusqueda = document.getElementById("inputBusqueda");
    const btnFiltrar = document.getElementById("btnFiltrar");    
    btnFiltrar.addEventListener('click', busquedaDeComisiones);

    const btnEliminarFiltros= document.getElementById("btnEliminarFiltros");
    btnEliminarFiltros.addEventListener('click', eliminarFiltros);

    dibujarGraficos();
});

function eliminarFiltros()
{
    inputBusqueda.value = "";
    btnEliminarFiltros.style.display="none";    

    //destruimos simple-datatables
    if(dataTableInstance !== null) dataTableInstance.destroy();
    dataTableInstance = null; 

    //mostramos cargando en la tabla
    const comisionesContainer = document.getElementById("comisionesContainer");
    comisionesContainer.innerHTML = `<tr><td colspan="4" class="text-center">Cargando...</td></tr>`;

    mostrarTodosLasComisiones();
}

async function mostrarTodosLasComisiones()
{
    const user = JSON.parse(auth.getUser());
    const token = auth.getToken();
    const comisiones = new Comisiones(api);
    try {
        const todasLasComisiones = await comisiones.listAllComisiones(user.id, token);
        renderTablaComisiones(todasLasComisiones);        
    }
    catch (error) {
        console.error('Error: ', error);
        alert("Error al cargar las comisiones");
    }
}

async function busquedaDeComisiones() {

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
    const comisiones = new Comisiones(api);
    try {
        const resultadoBusqueda = await comisiones.buscarComisiones(user.id, token, inputValue);
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

function renderTablaComisiones(todasLasComisiones) {

    const comisionesContainer = document.getElementById("comisionesContainer");
    if(typeof todasLasComisiones.products== "undefined")// CAMBIAR AQUI CUANDO EL API DE ISIL ESTÉ LISTO.
    {
        comisionesContainer.innerHTML = `<tr><td colspan="4" class="text-center">Aún no tienes comisiones.</td></tr>`;
        return;
    }   
    const listaTodasLasComisiones = todasLasComisiones.products; //---> CAMBIAR AQUI CUANDO EL API DE ISIL ESTE LISTA

    console.log(listaTodasLasComisiones);
    comisionesContainer.innerHTML = "";
    listaTodasLasComisiones.forEach(comision => {
        comisionesContainer.innerHTML += `
        <!-- TABLE ITEM -->
            <tr>
                <td>
                    <span class="fst-italic">vendido el ${comision.rating}</span>
                    <p class="fw-bold mb-0">${comision.title}</p>
                </td>
                <td>
                    <div class="fw-bold small text-center w-100">${comision.category}</div>
                </td>
                <td>
                    <div class="text-center">
                        <span class="fst-italic">Costo del curso:</span>
                        <h4 class="mb-0 text-dark-blue">
                            ${comision.price}
                        </h4>
                    </div>

                </td>
                <td>
                    <div class="text-center">
                        <span class="fst-italic">Comisión:</span>
                        <h4 class="mb-0 text-secondary text-nowrap">S/ ${comision.discountPercentage}</h4>
                    </div>
                </td>
            </tr>
        <!-- TABLE ITEM -->`;
    });

    /* creando simple data tables */
    crearSimpleDataTables();
    /* creando simple data tables */
}

function renderResultadosDeBusqueda(resultadoBusqueda)
{
    if(dataTableInstance !== null) dataTableInstance.destroy();
    dataTableInstance = null; 

    const comisionesContainer = document.getElementById("comisionesContainer");
    const listaResultadoComisiones = resultadoBusqueda.products; //---> CAMBIAR AQUI CUANDO EL API DE ISIL ESTE LISTA
    if(listaResultadoComisiones.length == 0)
    {
        comisionesContainer.innerHTML = `<tr><td colspan="4" class="text-center">No se encontraron resultados.</td></tr>`;
        return;
    }

    comisionesContainer.innerHTML = "";
    listaResultadoComisiones.forEach(comision => {
        comisionesContainer.innerHTML += `
        <!-- TABLE ITEM -->
            <tr>
                <td>
                    <span class="fst-italic">vendido el ${comision.rating}</span>
                    <p class="fw-bold mb-0">${comision.title}</p>
                </td>
                <td>
                    <div class="fw-bold small text-center w-100">${comision.category}</div>
                </td>
                <td>
                    <div class="text-center">
                        <span class="fst-italic">Costo del curso:</span>
                        <h4 class="mb-0 text-dark-blue">
                            ${comision.price}
                        </h4>
                    </div>

                </td>
                <td>
                    <div class="text-center">
                        <span class="fst-italic">Comisión:</span>
                        <h4 class="mb-0 text-secondary text-nowrap">S/ ${comision.discountPercentage}</h4>
                    </div>
                </td>
            </tr>
        <!-- TABLE ITEM -->`;
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
            info: " ",
            noResults: "No results match your search query",
        }
    });
    dataTableInstance.on('datatable.page', function (page) {
        console.log("cambiando");
    });
}

