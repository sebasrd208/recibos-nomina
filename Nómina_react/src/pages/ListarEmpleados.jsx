import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    FileText,
    Pencil,
    Trash2,
    Users,
    Filter
} from 'lucide-react';

import { servidorApiMethods } from '../api/servidorApi';
import { useAuth } from '../context/AuthContext';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

const ListarEmpleados = () => {

    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [empleados, setEmpleados] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [filtroSeccion, setFiltroSeccion] = useState('');
    const [sortColumn, setSortColumn] = useState('idEmpleado');
    const [sortDirection, setSortDirection] = useState('asc');
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState(() => {
        const mensajeGuardado = sessionStorage.getItem('updateMessage');
        sessionStorage.removeItem('updateMessage');
        return mensajeGuardado || '';
    });

    useEffect(() => {
        listar();
        const mostrarMensaje = () => {
            const mensajeGuardado = sessionStorage.getItem('updateMessage');

            if (mensajeGuardado) {
                setMensaje(mensajeGuardado);
                sessionStorage.removeItem('updateMessage');
            }
        };

        window.addEventListener('updateMessage', mostrarMensaje);

        return () => {
            window.removeEventListener('updateMessage', mostrarMensaje);
        };
    }, []);

    const listar = async () => {
        try {
            setCargando(true);

            const data = await servidorApiMethods.listarEmpleados();

            setEmpleados(data);
            setSecciones(
                [...new Set(data.map(e => e.seccion).filter(Boolean))]
                    .sort((a, b) => a.localeCompare(b))
            );

        } catch (error) {
            setMensaje('No se pudieron cargar los empleados');
        } finally {
            setCargando(false);
        }
    };

    //-------CONTROL DE ERRORES------

    const mostrarError = error => {
        if (error.response?.status === 409) {
            setMensaje(JSON.stringify(error.response.data));
        } else if (error.response?.status === 401) {
            setMensaje('No estás autenticado');
        } else if (error.response?.status === 403) {
            setMensaje('Necesitas permisos de ADMINISTRADOR para esto');
        } else {
            setMensaje('No se pudo obtener el documento');
        }
    };

    // ---------------- ORDENAMIENTO ----------------

    const ordenarEmpleados = (columna) => {
        if (sortColumn === columna) {
            setSortDirection(prev =>
                prev === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setSortColumn(columna);
            setSortDirection('asc');
        }
    };

    // ---------------- FILTRADO Y ORDENAMIENTO ----------------

    const empleadosFiltrados = useMemo(() => {

        let resultado = [...empleados];

        if (filtroSeccion) {
            resultado = resultado.filter(
                emp => emp.seccion === filtroSeccion
            );
        }

        resultado.sort((a, b) => {

            const valA = a[sortColumn];
            const valB = b[sortColumn];

            let comparacion;

            if (typeof valA === 'string' && typeof valB === 'string') {
                comparacion = valA.localeCompare(valB);
            } else {
                comparacion = (valA ?? 0) - (valB ?? 0);
            }

            return sortDirection === 'asc'
                ? comparacion
                : -comparacion;
        });

        return resultado;

    }, [empleados, filtroSeccion, sortColumn, sortDirection]);

    // ---------------- CONTADOR ----------------

    const textoFiltroEmpleados = filtroSeccion
        ? `${filtroSeccion}: ${empleadosFiltrados.length}`
        : `Total: ${empleadosFiltrados.length}`;

    // ---------------- ELIMINAR ----------------

    const eliminar = async (numEmpleado, nombre) => {
        if (!isAdmin) {
            setMensaje('No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.');
            return;
        }

        const result = await Swal.fire({
            title: '¿Eliminar empleado?',
            text: `Se eliminará el registro de ${nombre}. Esta acción no se puede deshacer.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626'
        });

        if (!result.isConfirmed) return;

        try {

            await servidorApiMethods.eliminar(numEmpleado);
            setMensaje('Empleado eliminado correctamente');
            listar();

        } catch (error) {
            mostrarError(error);
        }
    };

    // ---------------- OBTENER PDF ----------------

    const obtenerPDF = async (numEmpleado) => {
        try {

            const pdf = await servidorApiMethods.obtenerPDF(numEmpleado);

            const blob = new Blob([pdf], {
                type: 'application/pdf'
            });

            /*if (!Capacitor.isNativePlatform()) {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
                return;
            }*/
            if (!Capacitor.isNativePlatform()) {

                const url = window.URL.createObjectURL(blob);

                const esTelefono = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

                if (esTelefono) {

                    const enlace = document.createElement('a');
                    enlace.href = url;
                    enlace.download = 'recibo-' + numEmpleado + '.pdf';

                    document.body.appendChild(enlace);
                    enlace.click();
                    document.body.removeChild(enlace);

                    window.URL.revokeObjectURL(url);

                } else {

                    window.open(url, '_blank');

                }

                return;
            }

            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    const resultado = reader.result;
                    resolve(resultado.split(',')[1]);
                };

                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            const archivo = await Filesystem.writeFile({
                path: 'recibo-' + numEmpleado + '-' + Date.now() + '.pdf',
                data: base64,
                directory: Directory.Cache
            });

            await FileOpener.open({
                filePath: archivo.uri,
                contentType: 'application/pdf',
                openWithDefault: false
            });

        } catch (error) {

            mostrarError(error);
        }
    };

    // ---------------- EDITAR ----------------

    const editar = (empleado) => {
        if (!isAdmin) {
            setMensaje('No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.');
            return;
        }

        localStorage.setItem('empleado_key', empleado.numEmpleado);
        navigate('/editar-empleados');
    };

    // ---------------- ICONO ORDENAMIENTO ----------------

    const iconoOrden = (columna) => {

        if (sortColumn !== columna) {
            return <ArrowUpDown size={14} className="text-gray-400" />;
        }

        return sortDirection === 'asc'
            ? <ArrowUp size={14} />
            : <ArrowDown size={14} />;
    };

    // ---------------- FORMATO MONEDA ----------------

    const formatoMoneda = (cantidad) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(cantidad ?? 0);
    };

    // ---------------- ENCABEZADOS ----------------

    const encabezados = [
        { key: 'idEmpleado', label: 'ID' },
        { key: 'nombre', label: 'NOMBRE' },
        { key: 'apellido', label: 'APELLIDO' },
        { key: 'numEmpleado', label: 'NUM. EMPLEADO' },
        { key: 'seccion', label: 'SECCIÓN' },
        ...(isAdmin ? [{ key: 'sueldo', label: 'SALARIO' }] : [])
    ];

    return (

        <div className="w-full max-w-7xl mx-auto px-4 py-8">

            {/* ENCABEZADO */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800 text-dark">
                        EMPLEADOS
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Consulta y administración de empleados
                    </p>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2">
                        <Users size={19} className="text-blue-600" />
                        <h2 className="font-semibold text-gray-800">
                            Listado de empleados
                        </h2>
                    </div>

                    {mensaje && (
                        <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {mensaje}
                        </p>
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                        <select
                            value={filtroSeccion}
                            onChange={e => setFiltroSeccion(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Todas las secciones</option>

                            {secciones.map(sec => (
                                <option key={sec} value={sec}>
                                    {sec}
                                </option>
                            ))}
                        </select>
                        <Users size={18} />

                        <span className="text-sm font-medium text-gray-500">
                            {textoFiltroEmpleados}
                        </span>

                    </div>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1000px] divide-y divide-gray-200">

                        <thead className="bg-gray-800">
                            <tr>
                                {encabezados.map(columna => (
                                    <th
                                        key={columna.key}
                                        onClick={() => ordenarEmpleados(columna.key)}
                                        className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-200 cursor-pointer hover:bg-gray-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            {columna.label}
                                            {iconoOrden(columna.key)}
                                        </div>
                                    </th>
                                ))}

                                <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-200">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {cargando ? (
                                <tr>
                                    <td
                                        colSpan={encabezados.length + 1}
                                        className="px-4 py-12 text-center text-sm text-gray-500"
                                    >
                                        Cargando empleados...
                                    </td>
                                </tr>

                            ) : empleadosFiltrados.length > 0 ? (

                                empleadosFiltrados.map(empleado => (
                                    <tr
                                        key={empleado.idEmpleado}
                                        className="transition hover:bg-blue-50/50"
                                    >

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {empleado.idEmpleado}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm font-medium text-gray-800">
                                            {empleado.nombre}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {empleado.apellido}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {empleado.numEmpleado}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {empleado.seccion}
                                        </td>

                                        {isAdmin && (
                                            <td className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                                                {formatoMoneda(empleado.sueldo)}
                                            </td>
                                        )}

                                        <td className="px-4 py-4">

                                            <div className="flex items-center justify-center gap-2">

                                                <button
                                                    onClick={() => eliminar(empleado.numEmpleado, empleado.nombre)}
                                                    title={`Eliminar a ${empleado.nombre}`}
                                                    className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                                <button
                                                    onClick={() => obtenerPDF(empleado.numEmpleado)}
                                                    title={`Ver recibo de ${empleado.nombre}`}
                                                    className="rounded-md bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                                                >
                                                    <FileText size={17} />
                                                </button>

                                                <button
                                                    onClick={() => editar(empleado)}
                                                    title={`Editar información de ${empleado.nombre}`}
                                                    className="rounded-md bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))

                            ) : (
                                <tr>
                                    <td
                                        colSpan={encabezados.length + 1}
                                        className="px-4 py-12 text-center text-sm text-gray-500"
                                    >
                                        No hay empleados registrados
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>

                <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
                    <p className="text-xs text-gray-500">
                        Mostrando {empleadosFiltrados.length} de {empleados.length} empleados
                    </p>
                </div>

            </div>

        </div>
    );
};

export default ListarEmpleados;
