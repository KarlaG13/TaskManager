// src/services/localStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TASKS';

export const getLocalTareas = async () => {
    const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
};

export const saveLocalTarea = async (tarea) => {
    const tareas = await getLocalTareas();
    tareas.push(tarea);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
};

export const updateLocalTarea = async (tarea) => {
    const tareas = await getLocalTareas();
    const index = tareas.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
        tareas[index] = tarea;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
    }
};

export const deleteLocalTarea = async (id) => {
    const tareas = await getLocalTareas();
    const newTareas = tareas.filter(t => t.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTareas));
};
