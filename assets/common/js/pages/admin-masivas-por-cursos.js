let pageSelected="admin-tasas-masivas.html";

/*============================================================/*
                        SIMPLE-DATATABLE                            
/*============================================================*/
const dataTableElem = document.getElementById("myTable");
if (dataTableElem) {
    const dataTable = new simpleDatatables.DataTable("#myTable", {
        searchable: true,
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
        },
        columns: [{
            select: 1,
            sortable: false
        }

        ]
    });
    dataTable.on('datatable.page', function (page) {
        console.log("cambiando");
    });
}


function changeSelect() {
    var value = document.getElementById("tipo").value;
    window.location.href = value;
}
document.getElementById("tipo").addEventListener("change", changeSelect);
/*============================================================/*
                        SIMPLE-DATATABLE                            
/*============================================================*/