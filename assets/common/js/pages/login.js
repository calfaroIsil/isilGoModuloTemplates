import api from '../modules/API.js';
import auth from '../modules/Auth.js';

document.addEventListener('DOMContentLoaded', () => {

    if (auth.isAuthenticated()) {
       redireccionarAPaginaPrincipal();
    }

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const buttonSubmit = loginForm.querySelector("button[type='submit']");
        buttonSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>`;
        buttonSubmit.innerHTML += `<span role="status">Loading...</span>`;
        buttonSubmit.disabled = true;

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const APIresponse = await api.login(username, password);
            if (APIresponse.message != undefined && APIresponse.message == "Invalid credentials") {
                alert("Usuario y/o contraseña inválidos, por favor intente denuevo");
                buttonSubmit.innerHTML = `ACCEDER`;
                buttonSubmit.disabled = false;
            }
            else if (APIresponse.token != undefined) {
                alert("bienvenido");
                console.log(APIresponse.token);
                auth.setToken(APIresponse.token);
            }

            // Redirigir al usuario a la página correspondiente
        } catch (error) {
            // Mostrar mensaje de error al usuario
            alert(error);
        }
    });

    function redireccionarAPaginaPrincipal()
    {
        window.location.href="dashboard.html";
    }
});