import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { agregarTarea, eliminarTarea, actualizarTarea, setTareas } from '../store/actions';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MainScreen = () => {
    const tareas = useSelector(state => state.tareas.tareas);
    const dispatch = useDispatch();
    const [tarea, setTarea] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                syncTareasWithApi();
            }
        });

        loadLocalTareas();

        return () => {
            unsubscribe();
        };
    }, []);

    const loadLocalTareas = async () => {
        const localTareas = await AsyncStorage.getItem('tareas');
        if (localTareas) {
            dispatch(setTareas(JSON.parse(localTareas)));
        }
    };

    const saveLocalTareas = async (tareas) => {
        await AsyncStorage.setItem('tareas', JSON.stringify(tareas));
    };

    const syncTareasWithApi = async () => {
        const localTareas = await AsyncStorage.getItem('tareas');
        if (localTareas) {
            try {
                const response = await axios.post('https://documenter.getpostman.com/view/23463830/2sA3QqgsyA', JSON.parse(localTareas));
                if (response.status === 200) {
                    // Assuming the API returns the updated list of tareas
                    dispatch(setTareas(response.data));
                    await AsyncStorage.removeItem('tareas'); // Clear local storage after syncing
                }
            } catch (error) {
                console.error('Error syncing with API:', error);
            }
        }
    };

    const handleAgregarTarea = async () => {
        let nuevasTareas;
        if (editMode) {
            nuevasTareas = tareas.map(t => t.id === editId ? { ...t, name: tarea } : t);
            dispatch(actualizarTarea({ id: editId, name: tarea, completed: false }));
            setEditMode(false);
            setEditId(null);
        } else {
            const nuevaTarea = { id: Date.now(), name: tarea, completed: false };
            nuevasTareas = [...tareas, nuevaTarea];
            dispatch(agregarTarea(nuevaTarea));
        }
        setTarea('');
        await saveLocalTareas(nuevasTareas);
        if (isConnected) {
            syncTareasWithApi();
        }
    };

    const handleEliminarTarea = async (id) => {
        const nuevasTareas = tareas.filter(t => t.id !== id);
        dispatch(eliminarTarea(id));
        await saveLocalTareas(nuevasTareas);
        if (isConnected) {
            syncTareasWithApi();
        }
    };

    const handleCompletarTarea = async (id) => {
        const nuevasTareas = tareas.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        const tarea = nuevasTareas.find(t => t.id === id);
        dispatch(actualizarTarea(tarea));
        await saveLocalTareas(nuevasTareas);
        if (isConnected) {
            syncTareasWithApi();
        }
    };

    const handleEditarTarea = (item) => {
        setTarea(item.name);
        setEditMode(true);
        setEditId(item.id);
    };

    return (
        <View>
            <Text>Gestor de Tareas</Text>
            <TextInput
                value={tarea}
                onChangeText={setTarea}
                placeholder="Nueva tarea"
            />
            <Button title={editMode ? "Actualizar Tarea" : "Agregar Tarea"} onPress={handleAgregarTarea} />

            <FlatList
                data={tareas}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                            {item.name}
                        </Text>
                        <TouchableOpacity onPress={() => handleCompletarTarea(item.id)}>
                            <Text style={{ color: 'green', marginLeft: 10 }}>
                                {item.completed ? "Marcar por hacer" : "Marcar como hecho"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEditarTarea(item)}>
                            <Text style={{ color: 'blue', marginLeft: 10 }}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEliminarTarea(item.id)}>
                            <Text style={{ color: 'red', marginLeft: 10 }}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default MainScreen;
