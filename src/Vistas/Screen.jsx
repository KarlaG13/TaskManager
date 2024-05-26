import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, VirtualizedList} from 'react-native'
import ControladorObtenerTareas from '../TaskManager/Infrestructura/Controladores/ControladorObtenerTareas'
import ServiciosTareas from '../TaskManager/Infrestructura/Adaptadores/ServiciosTareas'
import EliminarTareas from '../TaskManager/Aplicacion/CasoUso/EliminarTareas'
import CrearTareas from '../TaskManager/Aplicacion/CasoUso/CrearTareas'
import ActualizarTareas from '../TaskManager/Aplicacion/CasoUso/ActualizarTareas'
import AgregarTarea from '../components/AgregarTarea'

const Screen = () => {

    const [tareas, setTareas] = useState([])
    let port = new ServiciosTareas()
    let obtener = new ControladorObtenerTareas(port)
    let crear = new CrearTareas(port)
    let actualizar = new ActualizarTareas(port)
    let eliminar = new EliminarTareas(port)

    useEffect(() => {
        setTareas([...tareas, obtener.run()])
    }, [])    

    return (
        <View>
            {tareas.map(tarea => (
                <View>
                    <Text>{tarea}</Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({})



export default Screen;
