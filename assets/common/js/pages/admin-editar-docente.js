let pageSelected="admin-docentes.html";

function changeSelectEstado() {
    let target = this;
    let value = target.value;
    const porDocente = document.getElementById("por-docente");
    const porCurso = document.getElementById("por-curso");

    porDocente.style.display="none";
    porCurso.style.display="none";

    document.getElementById(value).style.display="block";

}
document.getElementById("select-tipo").addEventListener("change", changeSelectEstado);

/*============================================================/*
                    VALIDACIÓN BOOTSTRAP                            
/*============================================================*/
(() => {
    'use strict'  
    const forms = document.querySelectorAll('.needs-validation')
      Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  })();
/*============================================================/*
                    VALIDACIÓN BOOTSTRAP                            
/*============================================================*/