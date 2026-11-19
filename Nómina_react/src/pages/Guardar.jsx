
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

import { servidorApiMethods } from '../api/servidorApi';

const Guardar = () => {

    const navigate = useNavigate();

    const [universal, setUniversal] = useState({
        nombre: '',
        apellido: '',
        numEmpleado: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
    };

    const registrar = async (e) => {
        e.preventDefault();

        setMensaje('');

        if (!universal.nombre || !universal.apellido || !universal.numEmpleado) {
            mostrarMensaje('Completa todos los campos.', 'warning');
            return;
        }

        try {
            setCargando(true);

            await servidorApiMethods.guardar(universal);

            mostrarMensaje('Registro exitoso.', 'success');

            setTimeout(() => {
                navigate('/listar-companias');
            }, 1500);

        } catch (error) {

            if (error.response?.status === 400) {
                mostrarMensaje(
                    typeof error.response.data === 'string'
                        ? error.response.data
                        : JSON.stringify(error.response.data),
                    'error'
                );
            } else if (error.response?.status === 401) {
                mostrarMensaje('No estás autenticado.', 'error');
            } else if (error.response?.status === 403) {
                mostrarMensaje(
                    'No tienes permiso de ADMINISTRADOR.',
                    'warning'
                );
            } else {
                mostrarMensaje('No se pudo registrar.', 'error');
            }

        } finally {
            setCargando(false);
        }
    };

    const cancelar = () => {
        navigate('/listar-companias');
    };

    return (
        <div className="flex justify-center px-4 py-8">

            <div className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-800">
                    REGISTRO
                </h1>

                {/* MENSAJES */}
                {mensaje && (
                    <div
                        className={`mb-5 rounded-lg border p-4 text-sm ${
                            tipoMensaje === 'success'
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : tipoMensaje === 'warning'
                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                        }`}
                    >
                        {mensaje}
                    </div>
                )}

                <form onSubmit={registrar} className="space-y-5">

                    {/* NOMBRE */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Nombre:
                        </label>

                        <input
                            type="text"
                            value={universal.nombre}
                            onChange={e => setUniversal({
                                ...universal,
                                nombre: e.target.value
                            })}
                            placeholder="Ingresa el nombre"
                            disabled={cargando}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* APELLIDO */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Apellido:
                        </label>

                        <input
                            type="text"
                            value={universal.apellido}
                            onChange={e => setUniversal({
                                ...universal,
                                apellido: e.target.value
                            })}
                            placeholder="Ingresa el apellido"
                            disabled={cargando}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* NÚMERO DE EMPLEADO */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Número de empleado:
                        </label>

                        <input
                            type="number"
                            value={universal.numEmpleado}
                            onChange={e => setUniversal({
                                ...universal,
                                numEmpleado: e.target.value
                            })}
                            placeholder="Ingresa el número de empleado"
                            disabled={cargando}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="space-y-3 border-t border-gray-200 pt-5">

                        <button
                            type="submit"
                            disabled={cargando}
                            title="Registrar empleado"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle size={18} />

                            {cargando ? 'Registrando...' : 'Registrar empleado'}
                        </button>

                        <button
                            type="button"
                            onClick={cancelar}
                            disabled={cargando}
                            title="Cancelar registro"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <XCircle size={18} />
                            Cancelar
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default Guardar;
