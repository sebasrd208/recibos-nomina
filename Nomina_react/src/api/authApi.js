import { crearAxios } from './axiosConfig';

const axiosConfig = crearAxios('http://192.168.1.69:8090/usuarios');
//const axiosConfig = crearAxios('http://localhost:8090/usuarios');

export const authApi = {

    listarUsuarios: async () => {
        const response = await axiosConfig.get('');
        return response.data;
    },

    buscarUsuarios: async (username) => {
        const response = await axiosConfig.get('/username', {
            params: { usuario: username }
        });
        return response.data;
    },

    login: async (usuario, password) => {
        const response = await axiosConfig.post('/login', null, {
            params: { usuario, password }
        });
        return response.data;
    },

    registrar: async (usuario) => {
        const response = await axiosConfig.post('/guardar', usuario);
        return response.data;
    },

    editar: async (usuario) => {
        const response = await axiosConfig.put('/editar', usuario);
        return response.data;
    },

    eliminar: async (username) => {
        const response = await axiosConfig.delete('/eliminar', {
            params: { username }
        });
        return response.data;
    },

    actualizarPassword: async (username, password) => {
        const response = await axiosConfig.put('/actualizar-password', null, {
            params: { username, password }
        });
        return response.data;
    }
};
