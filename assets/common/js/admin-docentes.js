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
            info: "{rows} Totales",
            noResults: "No results match your search query",
        }
    });
    dataTable.on('datatable.page', function (page) {
        console.log("cambiando");
    });
}
/*============================================================/*
                        SIMPLE-DATATABLE                            
/*============================================================*/