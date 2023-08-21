class Cursos {
    constructor(api) {
        this.api = api;
    }

    async listCursos(userId, token) {
        try {
            const cursos = await this.api.getCursos(userId, token);
            return cursos;
        } catch (error) {
            throw new Error('Error al obtener las cursos');
        }
    }

    async buscarCursos(userId, token, query) {
        try {
            const cursos = await this.api.getSearchCursos(userId, token, query);
            return cursos;
        } catch (error) {
            throw new Error('Error al obtener la busqueda');
        }
    }

    async listAllCursos(userId, token) {
        try {
            const cursos = await this.api.getAllCursos(userId, token);
            return cursos;
        } catch (error) {
            throw new Error('Error al obtener las cursos');
        }
    }

    async deleteCurso(productId, token) {
        try {
            await this.api.deleteCurso(productId, token);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar');
        }
    }

    async editCurso(productData, token) {
        try {
            await this.api.editCurso(productData, token);
            return true;
        } catch (error) {
            throw new Error('Error al editar el cursos');
        }
    }
}

export default Cursos;
