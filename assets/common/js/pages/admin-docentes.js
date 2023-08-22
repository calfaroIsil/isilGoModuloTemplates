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

    /*const inputBusqueda = document.getElementById("inputBusqueda");
    const btnFiltrar = document.getElementById("btnFiltrar");    
    btnFiltrar.addEventListener('click', busquedaDeComisiones);

    const btnEliminarFiltros= document.getElementById("btnEliminarFiltros");
    btnEliminarFiltros.addEventListener('click', eliminarFiltros);

    dibujarGraficos();*/
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

