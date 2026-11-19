import axios from 'axios';

export const crearAxios = (baseURL) => {

    const instancia = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    instancia.interceptors.request.use(config => {

        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        if (username && password) {
            config.headers.Authorization =
                'Basic ' + btoa(`${username}:${password}`);
        }

        return config;
    });

    return instancia;
};
