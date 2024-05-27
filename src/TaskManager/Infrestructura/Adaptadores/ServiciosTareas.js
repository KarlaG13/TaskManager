import axios from 'axios';

class ServiciosTareas {
    constructor() {
        this.apiUrl = 'https://documenter.getpostman.com/view/23463830/2sA3QqgsyA'; // Reemplaza con la URL base de tu API
    }

    async ObtenerTareas() {
        console.log("Obteniendo tareas...");
        try {
            const response = await axios.get(`${this.apiUrl}/tareas`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            throw error;
        }
    }

    async CrearTareas(tarea) {
        console.log(`Creando tarea: ${tarea}`);
        try {
            const response = await axios.post(`${this.apiUrl}/tareas`, { nombre: tarea });
            return response.data;
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            throw error;
        }
    }

    async ActualizarTareas(id, nombre, completado) {
        console.log(`Actualizando tarea ${id} con nombre ${nombre} y estado ${completado}`);
        try {
            const response = await axios.put(`${this.apiUrl}/tareas/${id}`, { nombre, completado });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            throw error;
        }
    }

    async EliminarTareas(id) {
        console.log(`Eliminando tarea con id ${id}`);
        try {
            const response = await axios.delete(`${this.apiUrl}/tareas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            throw error;
        }
    }
}

export default ServiciosTareas;
