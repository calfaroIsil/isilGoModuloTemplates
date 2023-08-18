class Comisiones {
    constructor(api) {
        this.api = api;
    }

    async listComisiones(userId, token) {
        try {
            const comisiones = await this.api.getComisiones(userId, token);
            return comisiones;
        } catch (error) {
            throw new Error('Error al obtener las comisiones');
        }
    }

    async buscarComisiones(userId, token, query) {
        try {
            const comisiones = await this.api.getSearchComisiones(userId, token, query);
            return comisiones;
        } catch (error) {
            throw new Error('Error al obtener la busqueda');
        }
    }

    async listAllComisiones(userId, token) {
        try {
            const comisiones = await this.api.getAllComisiones(userId, token);
            return comisiones;
        } catch (error) {
            throw new Error('Error al obtener las comisiones');
        }
    }

    async deleteComision(productId, token) {
        try {
            await this.api.deleteComision(productId, token);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar');
        }
    }

    async editComision(productData, token) {
        try {
            await this.api.editComision(productData, token);
            return true;
        } catch (error) {
            throw new Error('Error al editar el comisiones');
        }
    }
}

export default Comisiones;
