/*============================================================/*
                           DASHBOARD                            
/*============================================================*/
const sidebar = document.getElementById('sidebar');
const sidebarCollapse = document.getElementById('sidebarCollapse');
const sidebarToggle = document.getElementById('sidebarToggle');
const closeSidebar = document.getElementById('closeSidebar');

sidebarCollapse.addEventListener('click', function () {
    sidebar.classList.toggle('active');
});

sidebarToggle.addEventListener('click', function () {
    document.body.classList.toggle('hide-sidebar');
});

closeSidebar.addEventListener('click', function () {
    sidebar.classList.remove('active');
});
/*============================================================/*
                           DASHBOARD                            
/*============================================================*/

/* AGREGANDO ACTIVE */
function addActive(url=window.location.href)
{
    const aTags = sidebar.querySelectorAll("a");
    for (const aTag of aTags) {   
        if (aTag.href === url) {
            let parent = aTag.parentNode;
            parent.classList.add("active");
        }
    }
}
addActive();
/* AGREGANDO ACTIVE */

/* HABILITANDOI TOOLTIPS */
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
/* HABILITANDOI TOOLTIPS */


