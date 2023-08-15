/*============================================================/*
                           CHART                            
/*============================================================*/
var ctx = document.getElementById('myChart').getContext('2d');
const colors = {
    blue: {
        default: "rgba(51, 119, 255, 1)",
        half: "rgba(51, 119, 255, 0.5)",
        quarter: "rgba(51, 119, 255, 0.25)",
        zero: "rgba(51, 119, 255, 0)"
    }
};

gradient = ctx.createLinearGradient(0, 25, 0, 400);
gradient.addColorStop(0, colors.blue.half);
gradient.addColorStop(0.8, colors.blue.quarter);
gradient.addColorStop(1, colors.blue.zero);
var chart = new Chart(ctx, {
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
/*============================================================/*
                           CHART                            
/*============================================================*/

/*============================================================/*
                        SIMPLE-DATATABLE                            
/*============================================================*/
const dataTableElem = document.getElementById("myTable");
if (dataTableElem) {
    const dataTable = new simpleDatatables.DataTable("#myTable", {
        searchable: false,
        fixedHeight: false,
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
    dataTable.on('datatable.page', function (page) {
        console.log("cambiando");
    });
}

function showFiltersResults()
{
    
    let op1 = document.getElementById("op1");
    let op2 = document.getElementById("op2");

    if(op1.style.display==="none")
    {
        op1.style.display="inline-block"
        op2.style.display="none"
    }
    else
    {
        op1.style.display="none"
        op2.style.display="inline-block"
    }
}
document.getElementById("btn-filtrar").addEventListener("click", showFiltersResults);
/*============================================================/*
                        SIMPLE-DATATABLE                            
/*============================================================*/