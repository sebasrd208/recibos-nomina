import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

function Registro() {
    const navigate = useNavigate();

    const [nombreCompleto, setNombreCompleto] = useState('');
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!loading) {
            setDots('');
            return;
        }

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);

        return () => clearInterval(interval);
    }, [loading]);

    const handleRegistro = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            await authApi.registrar({
                nombreCompleto,
                usuario,
                password,
                rol: 'USER'
            });

            navigate('/login');
        } catch (err) {
            setError(
                err.response?.data || 'No fue posible registrar el usuario'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleRegistro}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
            >
                <h1 className="text-2xl font-bold text-center mb-6">
                    Registro de usuario
                </h1>

                <label className="block font-medium mb-2">
                    Nombre completo:
                </label>
                <input
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-2"
                    placeholder="Ingresa tu nombre completo"
                    required
                />

                <label className="block font-medium mb-2">
                    Usuario:
                </label>
                <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-2"
                    placeholder="Ingresa un nombre de usuario"
                    required
                />

                <label className="block font-medium mb-2">
                    Contraseña:
                </label>
                <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-2"
                    placeholder="Ingresa tu contraseña"
                    required
                />

                <label className="block font-medium mb-2">
                    Confirmar contraseña:
                </label>
                <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-2"
                    placeholder="Confirma tu contraseña"
                    required
                />

                <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={mostrarPassword}
                        onChange={(e) => setMostrarPassword(e.target.checked)}
                        className="h-4 w-4 accent-blue-600"
                    />
                    Mostrar contraseñas
                </label>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg
                     hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Registrando'+dots : 'Registrarme'}                    
                </button>

                <p className="text-center text-gray-500 mt-5">
                    ¿Ya tienes una cuenta?{' '}
                    <a
                        onClick={() => navigate('/login')}
                        className="font-bold text-blue-600 cursor-pointer hover:underline"
                    >
                        Inicia sesión
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Registro;