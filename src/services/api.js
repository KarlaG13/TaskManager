// src/services/api.js
import axios from 'axios';

const API_URL = 'https://your-api-url.com/tasks';

export const fetchTareas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTarea = async (tarea) => {
    const response = await axios.post(API_URL, tarea);
    return response.data;
};

export const updateTarea = async (tarea) => {
    const response = await axios.put(`${API_URL}/${tarea.id}`, tarea);
    return response.data;
};

export const deleteTarea = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
