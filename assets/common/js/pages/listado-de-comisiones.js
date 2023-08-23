import api from '../modules/API.js';
import auth from '../modules/Auth.js';
import Comisiones from '../modules/Comisiones.js';

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

function dibujarGraficos() {

    const ctx = document.getElementById('myChart').getContext('2d');
    const colors = {
        blue: {
            default: "rgba(51, 119, 255, 1)",
            half: "rgba(51, 119, 255, 0.5)",
            quarter: "rgba(51, 119, 255, 0.25)",
            zero: "rgba(51, 119, 255, 0)"
        }
    };

    const gradient = ctx.createLinearGradient(0, 25, 0, 400);
    gradient.addColorStop(0, colors.blue.half);
    gradient.addColorStop(0.8, colors.blue.quarter);
    gradient.addColorStop(1, colors.blue.zero);
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line', // also try bar or other graph types

        // The data for our dataset
        data: {
            labels: [, "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dec", ,],
            datasets: [{
                data: [, , "20", "10", "35", "36", "20", "18", "22", "33", "12", ,],
                type: "line",
                backgroundColor: gradient,
                borderColor: '#3377FF',
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3377FF',
                label: "Comisión (S/.)"
            },

            ]
        },

        // Configuration options
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 12,
                    left: 12,
                    bottom: 12,
                },
            },
            scales: {
                "yAxes": [{
                    "ticks": {
                        "display": false,
                        "beginAtZero": true,
                        "max": 80,
                        "min": 0,
                        "padding": 10
                    },
                    "gridLines": {
                        "display": true,
                        "lineWidth": 1,
                        "drawOnChartArea": true,
                        "color": "#f0f0f0",
                        "zeroLineColor": "#bcbcbc",
                        "zeroLineWidth": 1,
                        "drawTicks": true
                    },
                    "scaleLabel": {
                        display: false,
                        labelString: 'Comisión ganada(S/.)',
                        fontColor: '#545454',
                        fontSize: 14,
                    }

                }],
                "xAxes": {
                    "0": {
                        "gridLines": {
                            "display": true,
                            "lineWidth": 1,
                            "drawOnChartArea": true,
                            "color": "#e4e4e4",
                            "zeroLineColor": "#E2E2E2",
                            "zeroLineWidth": 1,
                            "drawTicks": true
                        },
                        "ticks": {
                            "display": true,
                            "beginAtZero": true
                        }
                    }
                }
            },
            legend: {
                display: false
            },

            title: {
                display: false
            },
            elements: {
                arc: {},
                point: {
                    radius: 5,
                    borderWidth: 2,
                },
                line: {
                    tension: 0.4,
                },
                rectangle: {
                    borderWidth: 3,
                },
            },
            tooltips: {
                displayColors: false,
                titleFontColor: '#00c8ff',
            },
            hover: {
                mode: 'nearest',
                animationDuration: 400,
            },
            animation: {
                easing: 'linear',
            },
        }
    });

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
            info: "Mostrando {rows} comisiones",
            noResults: "No results match your search query",
        }
    });
    dataTableInstance.on('datatable.page', function (page) {
        console.log("cambiando");
    });
}

