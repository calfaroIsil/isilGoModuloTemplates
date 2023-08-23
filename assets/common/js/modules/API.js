class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, method, data, token) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            const responseData = await response.json();

            if (response.ok) {
                return responseData;
            }
            else if(response.status===400)
            {
                return responseData;
            }
            else {
                new Error('Error en la solicitud');
            }           
            //return responseData;

        } catch (error) {
            throw new Error('Error al comunicarse con el servidor');
        }
    }


    async login(username, password) {
        /*try {
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
        }*/

        const data = { username, password };
        return this.request('/auth/login', 'POST', data);

    }

    async getComisiones(userId, token) {
        return this.request(`/users/${userId}/carts`, 'GET', null, token);
    }

    async getAllComisiones(userId, token) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/products/`, 'GET', null, token);
    }

    async getSearchComisiones(userId, token, query) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/products/search?q=${query}`, 'GET', null, token);
    }

    async getCursos(userId, token) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/users/${userId}/carts`, 'GET', null, token);
    }

    async getCursoDetail(token, cursoId) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/products/${cursoId}`, 'GET', null, token);
    }

    async getSearchCursos(userId, token, query) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/products/search?q=${query}`, 'GET', null, token);
    }

    async getAllDocentes(userId, token) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/users`, 'GET', null, token);
    }

    async getSearchDocentes(userId, token, query) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/users/search?q=${query}`, 'GET', null, token);
    }
    async getDocenteDetail(token, docenteId) { //----------------> CAMBIAR CUANDO EL API DE ISIL ESTÉ LISTA
        return this.request(`/users/${docenteId}`, 'GET', null, token);
    }
}

const api = new API('https://dummyjson.com');
export default api;
