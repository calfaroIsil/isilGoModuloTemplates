class Docentes {
    constructor(api) {
        this.api = api;
    }

    async listDocentes(userId, token) {
        try {
            const docentes = await this.api.getDocentes(userId, token);
            return docentes;
        } catch (error) {
            throw new Error('Error al obtener las docentes');
        }
    }

    async detalleDeDocente(token, docenteId) {
        try {
            const docente = await this.api.getDocenteDetail(token, docenteId);
            
            return docente;
        } catch (error) {
            throw new Error('Error al obtener la busqueda');
        }
    }

    async buscarDocentes(userId, token, query) {
        try {
            const docentes = await this.api.getSearchDocentes(userId, token, query);
            return docentes;
        } catch (error) {
            throw new Error('Error al obtener la busqueda');
        }
    }

    async listAllDocentes(userId, token) {
        try {
            const docentes = await this.api.getAllDocentes(userId, token);
            return docentes;
        } catch (error) {
            throw new Error('Error al obtener las docentes');
        }
    }
}

export default Docentes;
