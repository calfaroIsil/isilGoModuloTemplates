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