
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, XCircle } from 'lucide-react';

import { servidorApiMethods } from '../api/servidorApi';

const EditarEmpleados = () => {

    const navigate = useNavigate();

    const [empleado, setEmpleado] = useState({
        idEmpleado: 0,
        nombre: '',
        apellido: '',
        numEmpleado: '',
        telefono: '',
        seccion: '',
        sueldo: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
    };

    // BUSCAR EMPLEADO
    useEffect(() => {
        const buscar = async () => {
            const id = localStorage.getItem('empleado_key');

            if (!id) {
                mostrarMensaje(
                    'No se pudo recuperar el identificador del empleado.',
                    'error'
                );
                setCargandoDatos(false);
                return;
            }

            try {
                const dato = await servidorApiMethods.buscarEmpleados(id);

                setEmpleado(dato);

                mostrarMensaje(
                    `${dato.numEmpleado} cargado exitosamente.`,
                    'success'
                );

            } catch (error) {
                mostrarMensaje(
                    error.response?.data || 'No se pudo cargar el empleado.',
                    'error'
                );
            } finally {
                setCargandoDatos(false);
            }
        };

        buscar();
    }, []);

    // ACTUALIZAR EMPLEADO
    const editar = async (e) => {
        e.preventDefault();

        setMensaje('');

        if (
            !empleado.telefono ||
            !empleado.seccion ||
            !empleado.sueldo
        ) {
            mostrarMensaje('Completa todos los campos.', 'warning');
            return;
        }

        try {
            setCargando(true);

            await servidorApiMethods.guardarEmpleado(empleado);

            sessionStorage.setItem(
                'updateMessage',
                `El empleado ${empleado.nombre} fue actualizado exitosamente.`
            );

            navigate('/listar-empleados');

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
                mostrarMensaje('No se pudo actualizar el empleado.', 'error');
            }

        } finally {
            setCargando(false);
        }
    };

    const cancelar = () => {
        navigate('/listar-empleados');
    };

    const inputDeshabilitado =
        'w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed';

    const inputEditable =
        'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

    return (
        <div className="flex justify-center px-4 py-8">

            <div className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <h1 className="mb-6 text-center text-xl font-bold tracking-tight text-gray-800">
                    ACTUALIZACIÓN DE EMPLEADOS
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

                {cargandoDatos ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                        Cargando empleado...
                    </div>
                ) : (
                    <form onSubmit={editar} className="space-y-5">

                        {/* ID EMPLEADO */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                ID del empleado:
                            </label>

                            <input
                                type="text"
                                value={empleado.idEmpleado}
                                disabled
                                className={inputDeshabilitado}
                            />
                        </div>

                        {/* NOMBRE */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Nombre:
                            </label>

                            <input
                                type="text"
                                value={empleado.nombre}
                                disabled
                                className={inputDeshabilitado}
                            />
                        </div>

                        {/* APELLIDO */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Apellido:
                            </label>

                            <input
                                type="text"
                                value={empleado.apellido}
                                disabled
                                className={inputDeshabilitado}
                            />
                        </div>

                        {/* NÚMERO DE EMPLEADO */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Número de empleado:
                            </label>

                            <input
                                type="number"
                                value={empleado.numEmpleado}
                                disabled
                                className={inputDeshabilitado}
                            />
                        </div>

                        {/* TELÉFONO */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Teléfono:
                            </label>

                            <input
                                type="number"
                                value={empleado.telefono}
                                onChange={e => setEmpleado({
                                    ...empleado,
                                    telefono: e.target.value
                                })}
                                placeholder="Ingresa el teléfono"
                                disabled={cargando}
                                className={inputEditable}
                            />
                        </div>

                        {/* EMPLEO */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Empleo:
                            </label>

                            <input
                                type="text"
                                value={empleado.seccion}
                                onChange={e => setEmpleado({
                                    ...empleado,
                                    seccion: e.target.value
                                })}
                                placeholder="Ingresa el empleo"
                                disabled={cargando}
                                className={inputEditable}
                            />
                        </div>

                        {/* SUELDO */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Sueldo:
                            </label>

                            <input
                                type="number"
                                value={empleado.sueldo}
                                onChange={e => setEmpleado({
                                    ...empleado,
                                    sueldo: e.target.value
                                })}
                                placeholder="Ingresa el sueldo"
                                disabled={cargando}
                                className={inputEditable}
                            />
                        </div>

                        {/* BOTONES */}
                        <div className="space-y-3 border-t border-gray-200 pt-5">

                            <button
                                type="submit"
                                disabled={cargando}
                                title="Actualizar empleado"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Pencil size={18} />
                                {cargando
                                    ? 'Actualizando...'
                                    : 'Actualizar empleado'
                                }
                            </button>

                            <button
                                type="button"
                                onClick={cancelar}
                                disabled={cargando}
                                title="Cancelar actualización"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <XCircle size={18} />
                                Cancelar
                            </button>

                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default EditarEmpleados;
