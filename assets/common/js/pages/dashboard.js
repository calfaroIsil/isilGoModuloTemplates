import api from '../modules/API.js';
import auth from '../modules/Auth.js';
import Comisiones from '../modules/Comisiones.js';

document.addEventListener('DOMContentLoaded', async () => {

    if (auth.isAuthenticated()) {
        ejecutarSiExiste(removePreloader);
        const user = JSON.parse(auth.getUser());
        const token = auth.getToken();
        const comisiones = new Comisiones(api);
        try {
            const comisionesList = await comisiones.listComisiones(user.id, token);
            renderComisionesRecientes(comisionesList);
            renderHeadCard(comisionesList);
           // console.log(comisionesList.carts[0].products);           
           console.log(comisionesList);
        }
        catch (error) {
            console.error('Error: ', error);
            alert("Error al cargar las comisiones");
        }

    } else {
        redireccionarAPagina("login.html");
        return;
    }
});

function renderComisionesRecientes(comisionesList) {
    const comisionesResientesContainer = document.getElementById("comisionesResientesContainer");
    const listaComisiones = comisionesList.carts[0].products; // CAMBIAR AQUI CUANDO EL API DE ISIL ESTÉ LISTO.

    comisionesResientesContainer.innerHTML = "";
    listaComisiones.forEach(comision => {
        comisionesResientesContainer.innerHTML += `
        <tr>
            <td>
                <span>vendido el ${comision.discountPercentage}</span>
                <p class="fw-bold">${comision.title}</p>
            </td>
            <td class="text-end">
                <span>Comisión:</span>
                <h4 class="mb-0 text-primary">S/ ${comision.total}</h4>
            </td>
        </tr>`;
    });
}

function renderHeadCard(comisionesList){
    const comisionesTotales = document.getElementById("comisionesTotales");
    const comisionesMesActual = document.getElementById("comisionesMesActual");
    const cursosVendidos = document.getElementById("cursosVendidos");
    const cursosTotales = document.getElementById("cursosTotales");

    // CAMBIAR AQUI CUANDO EL API DE ISIL ESTÉ LISTO.
    comisionesTotales.innerHTML = `S/ ${comisionesList.carts[0].total}`;
    comisionesMesActual.innerHTML = `S/ ${comisionesList.carts[0].discountedTotal}`;
    cursosVendidos.innerHTML = `${comisionesList.carts[0].totalProducts}`;
    cursosTotales.innerHTML = `/ ${comisionesList.carts[0].totalQuantity}Totales`;
}

/*============================================================/*
                           CHART                            
/*============================================================*/
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
let chart = new Chart(ctx, {
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
                    /*"display": false, */
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
                    display: true,
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
/*============================================================/*
                           CHART                            
/*============================================================*/