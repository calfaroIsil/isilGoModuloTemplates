import auth from '../modules/Auth.js';

document.addEventListener('DOMContentLoaded', async () => {   
    
    
    const response = await fetch('templates/sidebar.html');
    const menuContent = await response.text();
    const navPlaceholders = document.querySelectorAll('#sidebar-container');
    navPlaceholders.forEach((placeholder) => {
        placeholder.innerHTML = menuContent;

        if (auth.isAuthenticated()) {
            const uData = JSON.parse(auth.getUser());
            const labelNombresCompletos = document.getElementById("labelNombresCompletos");
            const labelCargo = document.getElementById("labelCargo");
            const userImage = document.getElementById("imagenDeUsuario");
            labelNombresCompletos.innerHTML = `${uData.nombre} ${uData.apellido}`;
            labelCargo.innerHTML = uData.cargo;
            userImage.setAttribute("src", uData.imagen);
         }
        
        /*============================================================/*
                      RESPONSIVE BUTTONS                            
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
                            RESPONSIVE BUTTONS                            
        /*============================================================*/

        addActive();
    });
});

/* AGREGANDO ACTIVE */
function addActive(url = window.location.href) {
    const aTags = sidebar.querySelectorAll("a");
    for (const aTag of aTags) {
        if (aTag.href === url) {
            let parent = aTag.parentNode;
            parent.classList.add("active");
        }
    }
}

/* AGREGANDO ACTIVE */