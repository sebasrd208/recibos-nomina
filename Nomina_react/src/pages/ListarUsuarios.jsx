import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    UserRound,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Trash2,
    Pencil
} from 'lucide-react';

import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const ListarUsuarios = () => {

    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [filtroRoles, setFiltroRoles] = useState('');
    const [sortColumn, setSortColumn] = useState('idUsuario');
    const [sortDirection, setSortDirection] = useState('asc');
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState(() => {
        const mensajeGuardado = sessionStorage.getItem('updateMessage');
        sessionStorage.removeItem('updateMessage');
        return mensajeGuardado || '';
    });

    useEffect(() => {
        listar();
    }, []);

    // Listar usuarios
    const listar = async () => {
        try {
            setCargando(true);

            const data = await authApi.listarUsuarios();

            if (isAdmin) {
                setUsuarios(
                    data.filter(
                        usuario => usuario.usuario !== user?.usuario
                    )
                );
            } else {
                setUsuarios(data);
            }

        } catch (error) {
            Swal.fire(
                'Error',
                'No se pudieron cargar los usuarios',
                'error'
            );
        } finally {
            setCargando(false);
        }
    };

    // Obtener nombre del rol
    const obtenerNombreRol = (rol) => {
        switch (rol) {
            case 'ADMIN':
                return 'Administrador';
            case 'USER':
                return 'Usuario';
            default:
                return 'Sin rol';
        }
    };

    // Ordenar usuarios
    const ordenarUsuarios = (columna) => {

        if (sortColumn === columna) {
            setSortDirection(prev =>
                prev === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setSortColumn(columna);
            setSortDirection('asc');
        }
    };

    // Filtrar y ordenar usuarios
    const usuariosFiltrados = useMemo(() => {

        const resultado = usuarios.filter(usuario =>
            filtroRoles === '' || usuario.rol === filtroRoles
        );

        resultado.sort((a, b) => {

            const valA = a[sortColumn];
            const valB = b[sortColumn];

            let comparacion;

            if (
                typeof valA === 'string' &&
                typeof valB === 'string'
            ) {
                comparacion = valA.localeCompare(valB);
            } else {
                comparacion = (valA ?? 0) - (valB ?? 0);
            }

            return sortDirection === 'asc'
                ? comparacion
                : -comparacion;
        });

        return resultado;

    }, [usuarios, filtroRoles, sortColumn, sortDirection]);

    // Icono de ordenamiento
    const iconoOrden = (columna) => {

        if (sortColumn !== columna) {
            return (
                <ArrowUpDown
                    size={14}
                    className="text-gray-400"
                />
            );
        }

        return sortDirection === 'asc'
            ? <ArrowUp size={14} />
            : <ArrowDown size={14} />;
    };

    // Encabezados de la tabla
    const encabezado = (columna, texto) => (
        <th
            onClick={() => ordenarUsuarios(columna)}
            className="cursor-pointer whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-200 hover:bg-gray-700"
        >
            <div className="flex items-center gap-2">
                {texto}
                {iconoOrden(columna)}
            </div>
        </th>
    );

    // Eliminar usuario
    const eliminar = async (username) => {

        const confirmacion = await Swal.fire({
            title: '¿Eliminar dato?',
            text: 'Esta acción no se puede deshacer',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {

            await authApi.eliminar(username);

            await Swal.fire(
                'Eliminado',
                'Dato eliminado correctamente',
                'success'
            );

            listar();

        } catch (error) {

            if (error.response?.status === 403) {
                Swal.fire(
                    'NO AUTORIZADO',
                    'No tienes permiso de ADMINISTRADOR',
                    'warning'
                );
                return;
            }

            Swal.fire(
                'Error',
                'No se pudo eliminar',
                'error'
            );
        }
    };

    // Editar usuario
    const editar = (usuario) => {

        localStorage.setItem(
            'usuario_key',
            usuario.usuario
        );

        navigate('/editar-usuarios');
    };

    // Texto del filtro
    const textoFiltro = () => {

        if (!filtroRoles) {
            return `Total: ${usuariosFiltrados.length}`;
        }

        return `${obtenerNombreRol(filtroRoles)}: ${usuariosFiltrados.length}`;
    };

    return (

        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                    USUARIOS
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Administración y consulta de usuarios del sistema
                </p>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Encabezado de tabla */}
                <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2">
                        <UserRound
                            size={20}
                            className="text-blue-600"
                        />

                        <h2 className="font-semibold text-gray-800">
                            Listado de usuarios
                        </h2>
                    </div>

                    {mensaje && (
                        <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {mensaje}
                        </p>
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                        <select
                            value={filtroRoles}
                            onChange={e => setFiltroRoles(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Todos</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="USER">Usuario</option>
                        </select>

                        <UserRound size={18} />
                        <span className="text-sm font-medium text-gray-500">
                            {textoFiltro()}
                        </span>

                    </div>

                </div>

                {/* Contenido */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px] divide-y divide-gray-200">

                        <thead className="bg-gray-800">
                            <tr>
                                {encabezado('idUsuario', '#')}
                                {encabezado('nombreCompleto', 'Nombre completo')}
                                {encabezado('usuario', 'Usuario')}
                                {encabezado('rol', 'Rol')}

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
                                        className="px-4 py-8 text-center text-sm text-gray-500"
                                    >
                                        Cargando usuarios...
                                    </td>
                                </tr>

                            ) : usuariosFiltrados.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-sm text-gray-500"
                                    >
                                        No hay usuarios registrados
                                    </td>
                                </tr>

                            ) : (

                                usuariosFiltrados.map(usuario => (

                                    <tr
                                        key={usuario.idUsuario}
                                        className="transition hover:bg-blue-50/50"
                                    >

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {usuario.idUsuario}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm font-medium text-gray-800">
                                            {usuario.nombreCompleto}
                                        </td>

                                        <td className="px-4 py-4 text-left text-sm text-gray-600">
                                            {usuario.usuario}
                                        </td>

                                        <td className="px-4 py-4 text-left">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                usuario.rol === 'ADMIN'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : usuario.rol === 'USER'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {obtenerNombreRol(usuario.rol)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">

                                                <button
                                                    onClick={() => eliminar(usuario.usuario)}
                                                    title="Eliminar usuario"
                                                    className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                                <button
                                                    onClick={() => editar(usuario)}
                                                    title="Actualizar usuario"
                                                    className="rounded-md bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pie de tabla */}
                <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">

                    <p className="text-xs text-gray-500">
                        Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ListarUsuarios;
