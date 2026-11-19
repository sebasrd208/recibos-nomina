import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');

        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const login = async (usuario, password) => {
        try {
            const response = await authApi.login(usuario, password);

            setUser(response);

            localStorage.setItem('user', JSON.stringify(response));
            localStorage.setItem('username', response.usuario);
            localStorage.setItem('password', password);

            return response;

        } catch (error) {
            const mensaje =
                error.response?.data || 'Error al intentar iniciar sesión';

            throw new Error(mensaje);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('password');

        setUser(null);
    };

    const getRoleName = () => {
        const roles = {
            ADMIN: 'Administrador',
            USER: 'Usuario'
        };

        return user ? roles[user.rol] || '' : '';
    };

    const value = {
        user,
        username: user?.usuario || '',
        role: user?.rol || null,
        login,
        logout,
        isLoggedIn: !!user,
        isAdmin: user?.rol === 'ADMIN',
        getRoleName
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider'
        );
    }

    return context;
};
