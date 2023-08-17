class Comisiones {
    constructor(api) {
        this.api = api;
    }

    async listComisiones(userId, token) {
        try {
            const comisiones = await this.api.getComisiones(userId, token);
            return comisiones;
        } catch (error) {
            throw new Error('Error al obtener los comisiones');
        }
    }

    async deleteComision(productId, token) {
        try {
            await this.api.deleteComision(productId, token);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el comisiones');
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
