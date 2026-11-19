
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Building2, ArrowUp, ArrowDown, ArrowUpDown, Trash2, Pencil } from 'lucide-react';
import { servidorApiMethods } from '../api/servidorApi';
import { useAuth } from '../context/AuthContext';

const ListarCompanias = () => {

    const navigate = useNavigate();

    const [companias, setCompanias] = useState([]);
    const [sortColumn, setSortColumn] = useState('idCompania');
    const [sortDirection, setSortDirection] = useState('asc');
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState(() => {
        const mensajeGuardado = sessionStorage.getItem('updateMessage');
        sessionStorage.removeItem('updateMessage');
        return mensajeGuardado || '';
    });
    const { isAdmin } = useAuth();

    // ---------------- LISTAR ----------------

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

            const data = await servidorApiMethods.listarCompanias();
            setCompanias(data);

        } catch (error) {
            setMensaje('No se pudieron cargar las compañías');
        } finally {
            setCargando(false);
        }
    };

    // ---------------- ORDENAMIENTO ----------------

    const ordenarCompanias = (columna) => {

        if (sortColumn === columna) {
            setSortDirection(prev =>
                prev === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setSortColumn(columna);
            setSortDirection('asc');
        }
    };

    const companiasOrdenadas = useMemo(() => {

        const resultado = [...companias];

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

    }, [companias, sortColumn, sortDirection]);

    // ---------------- ICONO ORDENAMIENTO ----------------

    const iconoOrden = (columna) => {

        if (sortColumn !== columna) {
            return <ArrowUpDown size={14} className="text-gray-400" />;
        }

        return sortDirection === 'asc'
            ? <ArrowUp size={14} />
            : <ArrowDown size={14} />;
    };

    // ---------------- ENCABEZADO ----------------

    const encabezado = (columna, texto) => (
        <th
            onClick={() => ordenarCompanias(columna)}
            className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-200 cursor-pointer hover:bg-gray-700"
        >
            <div className="flex items-center gap-2">
                {texto}
                {iconoOrden(columna)}
            </div>
        </th>
    );

    // ---------------- ELIMINAR ----------------

    const eliminar = async (numEmpleado, nombre) => {

        if (!isAdmin) {
            setMensaje('No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.');
            return;
        }

        const result = await Swal.fire({
            title: '¿Eliminar compañía?',
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
            setMensaje('Compañía eliminada correctamente');
            listar();
        } catch (error) {
            setMensaje(error.response?.data || 'Ocurrió un problema al realizar la operación');            
        }
    };

    // ---------------- EDITAR ----------------

    const editar = (compania) => {
        if (!isAdmin) {
            setMensaje('No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.');
            return;
        }

        localStorage.setItem('compania_key', compania.numEmpleado);
        navigate('/editar-companias');
    };

    return (

        <div className="w-full max-w-7xl mx-auto px-4 py-8">

            {/* TÍTULO */}

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    COMPAÑÍAS
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Consulta y administración de compañías
                </p>
            </div>

            {/* TABLA */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 size={19} className="text-blue-600" />

                        <h2 className="font-semibold text-gray-800">
                            Listado de compañías
                        </h2>
                    </div>
                    {mensaje && (
                        <p className="mx-auto w-fit -translate-x-8 rounded-lg border border-green-400 bg-green-100 px-4 py-2 text-center text-green-700">
                            {mensaje}
                        </p>

                    )}

                </div>
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px] divide-y divide-gray-200">

                        <thead className="bg-gray-800">

                            <tr>
                                {encabezado('nombre', 'Nombre')}
                                {encabezado('apellido', 'Apellido')}
                                {encabezado('numEmpleado', 'Num. empleado')}
                                {encabezado('rfc', 'RFC')}

                                <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-200">
                                    Acciones
                                </th>
                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {cargando ? (

                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-sm text-gray-500"
                                    >
                                        Cargando compañías...
                                    </td>
                                </tr>

                            ) : companiasOrdenadas.length > 0 ? (

                                companiasOrdenadas.map(compania => (

                                    <tr
                                        key={compania.idCompania ?? compania.numEmpleado}
                                        className="transition hover:bg-blue-50/50"
                                    >

                                        <td className="px-4 py-4 text-left text-sm font-medium text-gray-800">
                                            {compania.nombre}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {compania.apellido}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {compania.numEmpleado}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {compania.rfc}
                                        </td>

                                        <td className="px-4 py-4">

                                            <div className="flex items-center justify-center gap-2">

                                                <button
                                                    onClick={() => eliminar(compania.numEmpleado, compania.nombre)}
                                                    title={`Eliminar a ${compania.nombre}`}
                                                    className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                                <button
                                                    onClick={() => editar(compania)}
                                                    title={`Actualizar información de ${compania.nombre}`}
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
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-sm text-gray-500"
                                    >
                                        No hay compañías registradas
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">

                    <p className="text-xs text-gray-500">
                        Mostrando {companiasOrdenadas.length} de {companias.length} compañías
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ListarCompanias;
