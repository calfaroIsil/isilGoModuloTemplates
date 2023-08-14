function changeSelectEstado() {
    let target = this;
    let value = target.value;
    const porDocente = document.getElementById("por-docente");
    const porCurso = document.getElementById("por-curso");

    porDocente.style.display="none";
    porCurso.style.display="none";

    if(value=="por-docente")
    {
        porDocente.style.display="flex";
    }
    if(value=="por-curso")
    {
        porCurso.style.display="flex";
    }
}
document.getElementById("select-docente").addEventListener("change", changeSelectEstado);
document.getElementById("select-curso").addEventListener("change", changeSelectEstado);