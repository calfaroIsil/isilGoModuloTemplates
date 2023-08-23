import api from '../modules/API.js';
import auth from '../modules/Auth.js';
import Docentes from '../modules/Docentes.js';

let pageSelected = "admin-docentes.html";
const nombres=null,apellidos=null,imagenDocente=null,cargo=null,email=null,dni=null,estado=null;

document.addEventListener('DOMContentLoaded', async () => {

  if (!auth.isAuthenticated()) {
    redireccionarAPagina("login-administrativos.html");
    return;
  }

  const param = obtenerParametrosDeUrl();
  const user = JSON.parse(auth.getUser());
  const token = auth.getToken();
  const docentes = new Docentes(api);

  try {
    const docente = await docentes.detalleDeDocente(token, param["dc"]);    
    leerDatosDocente(docente);
  }
  catch (error) {
    console.error('Error: ', error);
    alert("Error al cargar las comisiones");
  }

  ejecutarSiExiste(removePreloader);

  const formEditarDocente = document.getElementById('form-editar-docente');
  formEditarDocente.addEventListener('submit', async (event) => {
    event.preventDefault();

    const buttonSubmit = formEditarDocente.querySelector("button[type='submit']");
    buttonSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>`;
    buttonSubmit.innerHTML += `<span role="status">Guardando...</span>`;
    buttonSubmit.disabled = true;


   
  });


  /*const inputBusqueda = document.getElementById("inputBusqueda");
  const btnFiltrar = document.getElementById("btnFiltrar");    
  btnFiltrar.addEventListener('click', busquedaDeDocentes);

  const btnEliminarFiltros= document.getElementById("btnEliminarFiltros");
  btnEliminarFiltros.addEventListener('click', eliminarFiltros);*/


});

function leerDatosDocente(docente)
{
  console.log(docente);
  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const imagenDocente = document.getElementById("imagen-docente");
  const cargo = document.getElementById("cargo");
  const email = document.getElementById("email");
  const dni = document.getElementById("dni");
  const estado = document.getElementById("estado");

  nombres.value = docente.firstName;
  apellidos.value = docente.lastName;
  imagenDocente.setAttribute("src", docente.image);
  cargo.value = docente.company.title;
  email.value = docente.email;
  dni.value = parseInt(docente.ein);
}


function changeSelectEstado() {
  let target = this;
  let value = target.value;
  const porDocente = document.getElementById("por-docente");
  const porCurso = document.getElementById("por-curso");

  porDocente.style.display = "none";
  porCurso.style.display = "none";

  document.getElementById(value).style.display = "block";

}
document.getElementById("select-tipo").addEventListener("change", changeSelectEstado);