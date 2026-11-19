
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servidorApiMethods } from '../api/servidorApi';

const EditarCompania = () => {
    const navigate = useNavigate();

    const [company, setCompany] = useState({
        idCompania: 0,
        nombre: '',
        apellido: '',
        numEmpleado: '',
        rfc: '',
        compania: '',
        nota: '',
        trimestre: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        buscar();
    }, []);

    const buscar = async () => {
        const id = localStorage.getItem('compania_key');

        if (!id) {
            setMensaje('No se encontró la compañía que deseas editar.');
            setTipoMensaje('error');
            setCargando(false);
            return;
        }

        try {
            const dato = await servidorApiMethods.buscarCompania(id);
            setCompany(dato);
            setMensaje(`${dato.numEmpleado} cargado exitosamente.`);
            setTipoMensaje('success');
        } catch (error) {
            setMensaje('No se pudo cargar la información de la compañía.');
            setTipoMensaje('error');
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCompany(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const editar = async (e) => {
        e.preventDefault();

        if (
            !company.nombre ||
            !company.apellido ||
            !company.numEmpleado ||
            !company.rfc ||
            !company.compania ||
            !company.trimestre
        ) {
            setMensaje('Completa todos los campos obligatorios.');
            setTipoMensaje('error');
            return;
        }

        setMensaje('Actualizando compañía...');
        setTipoMensaje('loading');

        try {
            await servidorApiMethods.guardarCompania(company);

            sessionStorage.setItem(
                'updateMessage',
                `La compañía ${company.compania} fue actualizada exitosamente.`
            );

            navigate('/listar-companias');
        } catch (error) {
            if (error.response?.status === 400) {
                setMensaje(
                    typeof error.response.data === 'string'
                        ? error.response.data
                        : 'Error al actualizar la compañía.'
                );
            } else if (error.response?.status === 401) {
                setMensaje('No estás autenticado.');
            } else if (error.response?.status === 403) {
                setMensaje('No tienes permiso de ADMINISTRADOR.');
            } else {
                setMensaje('No se pudo actualizar la compañía.');
            }

            setTipoMensaje('error');
        }
    };

    const cancelar = () => {
        navigate('/listar-companias');
    };


    return (
        <>
            {/* ================================================== */}
            {/*              DISEÑO DE ESCRITORIO                  */}
            {/* ================================================== */}

            <div className="hidden md:flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">

                <div className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    {/* TÍTULO */}
                    <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
                        EDITAR COMPAÑÍA
                    </h2>

                    {/* MENSAJES */}
                    {mensaje && (
                        <div
                            className={`mb-4 rounded-lg p-3 text-sm ${tipoMensaje === 'success'
                                    ? 'bg-green-50 text-green-700'
                                    : tipoMensaje === 'error'
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-blue-50 text-blue-700'
                                }`}
                        >
                            {mensaje}
                        </div>
                    )}

                    {cargando ? (
                        <p className="py-4 text-center text-sm text-gray-500">
                            Cargando información...
                        </p>
                    ) : (
                        <form onSubmit={editar} className="space-y-4">

                            {/* NOMBRE */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={company.nombre}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                                />
                            </div>

                            {/* APELLIDO */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={company.apellido}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                                />
                            </div>

                            {/* NÚMERO DE EMPLEADO */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Número de empleado
                                </label>
                                <input
                                    type="text"
                                    name="numEmpleado"
                                    value={company.numEmpleado}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                                />
                            </div>

                            {/* RFC */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    RFC
                                </label>
                                <input
                                    type="text"
                                    name="rfc"
                                    value={company.rfc}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* COMPAÑÍA */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Compañía
                                </label>
                                <input
                                    type="text"
                                    name="compania"
                                    value={company.compania}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* NOTA */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nota
                                </label>
                                <textarea
                                    name="nota"
                                    value={company.nota}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* TRIMESTRE */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Trimestre
                                </label>
                                <select
                                    name="trimestre"
                                    value={company.trimestre}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="1">ENERO-MARZO</option>
                                    <option value="2">ABRIL-JUNIO</option>
                                    <option value="3">JULIO-SEPTIEMBRE</option>
                                    <option value="4">OCTUBRE-DICIEMBRE</option>
                                </select>
                            </div>

                            {/* BOTONES */}
                            <div className="flex gap-3 pt-2">

                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Actualizar
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelar}
                                    className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>

                            </div>

                        </form>
                    )}

                </div>
            </div>


            {/* ================================================== */}
            {/*                    DISEÑO MÓVIL                    */}
            {/* ================================================== */}

            <div className="md:hidden min-h-[calc(100vh-76px)] w-full px-4 py-5">

                <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                    {/* TÍTULO */}
                    <h2 className="mb-5 text-center text-xl font-bold text-gray-800">
                        EDITAR COMPAÑÍA
                    </h2>

                    {/* MENSAJES */}
                    {mensaje && (
                        <div
                            className={`mb-4 rounded-lg p-3 text-sm break-words ${tipoMensaje === 'success'
                                    ? 'bg-green-50 text-green-700'
                                    : tipoMensaje === 'error'
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-blue-50 text-blue-700'
                                }`}
                        >
                            {mensaje}
                        </div>
                    )}

                    {cargando ? (
                        <p className="py-6 text-center text-sm text-gray-500">
                            Cargando información...
                        </p>
                    ) : (
                        <form onSubmit={editar} className="space-y-5">

                            {/* NOMBRE */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={company.nombre}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-500"
                                />
                            </div>

                            {/* APELLIDO */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={company.apellido}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-500"
                                />
                            </div>

                            {/* NÚMERO DE EMPLEADO */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Número de empleado
                                </label>
                                <input
                                    type="text"
                                    name="numEmpleado"
                                    value={company.numEmpleado}
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-500"
                                />
                            </div>

                            {/* RFC */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    RFC
                                </label>
                                <input
                                    type="text"
                                    name="rfc"
                                    value={company.rfc}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* COMPAÑÍA */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Compañía
                                </label>
                                <input
                                    type="text"
                                    name="compania"
                                    value={company.compania}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* NOTA */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nota
                                </label>
                                <textarea
                                    name="nota"
                                    value={company.nota}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* TRIMESTRE */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Trimestre
                                </label>
                                <select
                                    name="trimestre"
                                    value={company.trimestre}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="1">ENERO-MARZO</option>
                                    <option value="2">ABRIL-JUNIO</option>
                                    <option value="3">JULIO-SEPTIEMBRE</option>
                                    <option value="4">OCTUBRE-DICIEMBRE</option>
                                </select>
                            </div>

                            {/* BOTONES */}
                            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5">

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Actualizar
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelar}
                                    className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>

                            </div>

                        </form>
                    )}

                </div>
            </div>

        </>
    );
};

export default EditarCompania;
