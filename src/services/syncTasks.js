// src/services/syncTasks.js
import { getLocalTareas, saveLocalTarea, updateLocalTarea, deleteLocalTarea } from './localStorage';
import { createTarea, updateTarea, deleteTarea } from './api';
import { isOnline } from './networkStatus';

export const syncTasks = async () => {
    if (await isOnline()) {
        const tareas = await getLocalTareas();
        for (const tarea of tareas) {
            try {
                if (tarea.needsSync) {
                    if (tarea.deleted) {
                        await deleteTarea(tarea.id);
                    } else if (tarea.updated) {
                        await updateTarea(tarea);
                    } else {
                        await createTarea(tarea);
                    }
                    tarea.needsSync = false;
                    await updateLocalTarea(tarea);
                }
            } catch (error) {
                console.error('Error syncing task:', error);
            }
        }
    }
};
