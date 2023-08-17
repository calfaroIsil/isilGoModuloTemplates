class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            });

            const responseData = await response.json();

            if (response.ok) {
                return responseData;
            }
            else if(response.status===400)
            {
                return (responseData);
            }
            else {
                new Error('Error en la solicitud');
            }
        } catch (error) {
            throw new Error('Error al comunicarse con el servidor');
        }
    }

    async getUsers() {
        // ... (código de getUsers)
    }
}

const api = new API('https://dummyjson.com');
export default api;
