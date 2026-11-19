import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const EditarUsuarios = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        idUsuario: 0,
        usuario: '',
        password: '',
        nombreCompleto: '',
        rol: 'USER'
    });

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        buscar();
    }, []);

    const buscar = async () => {
        const username = localStorage.getItem('usuario_key');

        if (!username) {
            setMensaje('No se encontró el usuario que deseas editar.');
            setTipoMensaje('error');
            setCargando(false);
            return;
        }

        try {
            const dato = await authApi.buscarUsuarios(username);
            setUsuario(dato);
            setMensaje('Usuario cargado exitosamente.');
            setTipoMensaje('success');
        } catch (error) {
            setMensaje('No se pudo cargar la información del usuario.');
            setTipoMensaje('error');
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUsuario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const editar = async (e) => {
        e.preventDefault();

        if (!usuario.nombreCompleto || !usuario.usuario) {
            setMensaje('Completa todos los campos.');
            setTipoMensaje('error');
            return;
        }

        setMensaje('Actualizando usuario...');
        setTipoMensaje('loading');

        try {
            await authApi.editar(usuario);

            sessionStorage.setItem(
                'updateMessage',
                `El usuario ${usuario.usuario} fue actualizado exitosamente.`
            );

            navigate('/listar-usuarios');
        } catch (error) {
            if (error.response?.status === 400) {
                setMensaje(
                    typeof error.response.data === 'string'
                        ? error.response.data
                        : 'Error al actualizar el usuario.'
                );
            } else if (error.response?.status === 401) {
                setMensaje('No estás autenticado.');
            } else if (error.response?.status === 403) {
                setMensaje('No tienes permiso de ADMINISTRADOR.');
            } else {
                setMensaje('No se pudo actualizar el usuario.');
            }

            setTipoMensaje('error');
        }
    };

    const cancelar = () => {
        navigate('/listar-usuarios');
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
            <div className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
                    ACTUALIZAR DATOS DEL USUARIO
                </h2>

                <p className="mb-6 text-center text-sm text-gray-500">
                    Datos de {usuario.usuario}
                </p>

                {mensaje && (
                    <div className={`mb-4 rounded-lg p-3 text-sm ${
                        tipoMensaje === 'success'
                            ? 'bg-green-50 text-green-700'
                            : tipoMensaje === 'error'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                    }`}>
                        {mensaje}
                    </div>
                )}

                {cargando ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                        Cargando información...
                    </p>
                ) : (
                    <form onSubmit={editar} className="space-y-4">

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                ID:
                            </label>
                            <input
                                type="text"
                                value={usuario.idUsuario}
                                disabled
                                placeholder="Elige un id de usuario"
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                name="nombreCompleto"
                                value={usuario.nombreCompleto}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Usuario:
                            </label>
                            <input
                                type="text"
                                value={usuario.usuario}
                                disabled
                                placeholder="Elige un nombre de usuario"
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Rol:
                            </label>
                            <select
                                name="rol"
                                value={usuario.rol}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="ADMIN">Administrador</option>
                                <option value="USER">Usuario</option>
                            </select>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Actualizar
                            </button>

                            <button
                                type="button"
                                onClick={cancelar}
                                className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
                            >
                                Cancelar
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default EditarUsuarios;
