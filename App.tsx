
// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import MainScreen from './src/Vistas/MainScreen';
import Screen from './src/Vistas/Screen';

const App = () => (
    <Provider store={store}>
    <MainScreen/>
    </Provider>
);

export default App;
