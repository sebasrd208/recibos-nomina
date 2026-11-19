import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    KeyRound,
    LockKeyhole
} from 'lucide-react';

import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const ActualizarPassword = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const username = localStorage.getItem('usuario_key');

    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNuevo, setPasswordNuevo] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
    };

    const actualizar = async (e) => {
        e.preventDefault();

        setMensaje('');

        if (!username) {
            mostrarMensaje(
                'No se pudo recuperar el usuario autenticado.',
                'error'
            );
            return;
        }

        if (!passwordActual || !passwordNuevo || !confirmPassword) {
            mostrarMensaje('Completa todos los campos.', 'warning');
            return;
        }

        if (passwordNuevo !== confirmPassword) {
            mostrarMensaje(
                'La nueva contraseña y su confirmación no coinciden.',
                'warning'
            );
            return;
        }

        if (passwordActual === passwordNuevo) {
            mostrarMensaje(
                'La nueva contraseña debe ser diferente a la actual.',
                'warning'
            );
            return;
        }

        try {
            setCargando(true);

            // Verificar contraseña actual
            try {
                await authApi.login(username, passwordActual);
            } catch {
                mostrarMensaje(
                    'La contraseña actual no es válida.',
                    'error'
                );
                return;
            }

            // Buscar usuario
            const usuarioEncontrado = await authApi.buscarUsuarios(username);

            // Actualizar contraseña
            await authApi.actualizarPassword(
                usuarioEncontrado.usuario,
                passwordNuevo
            );

            // Confirmar cierre de sesión
            await Swal.fire({
                title: 'CONTRASEÑA ACTUALIZADA',
                text: 'Por seguridad, es necesario iniciar sesión nuevamente para verificar la contraseña actualizada.',
                icon: 'success',
                confirmButtonText: 'Cerrar sesión',
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            // Cerrar sesión
            logout();
            localStorage.removeItem('usuario_key');

            sessionStorage.setItem(
                'logoutMessage',
                'Tu contraseña fue actualizada y por seguridad cerramos tú sesión.'
            );

            navigate('/login', { replace: true });

        } catch (error) {
            mostrarMensaje(
                error.response?.data || 'No se pudo actualizar la contraseña.',
                'error'
            );
        } finally {
            setCargando(false);
        }
    };
    return (
        <>
            {/* ================================================== */}
            {/*              DISEÑO DE ESCRITORIO                  */}
            {/* ================================================== */}

            <div className="hidden md:block mx-auto w-full max-w-2xl px-4 py-8">

                {/* ENCABEZADO */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                        ACTUALIZAR CONTRASEÑA
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Cambia la contraseña de tu cuenta
                    </p>
                </div>

                {/* TARJETA PRINCIPAL */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    {/* INFORMACIÓN DE SEGURIDAD */}
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-5">

                        <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                            <KeyRound size={24} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-800">
                                Seguridad de la cuenta
                            </h2>

                            <p className="text-sm text-gray-500">
                                Usuario: {username}
                            </p>
                        </div>

                    </div>

                    {/* MENSAJES */}
                    {mensaje && (
                        <div
                            className={`mb-5 rounded-lg border p-4 text-sm ${tipoMensaje === 'success'
                                    ? 'border-green-200 bg-green-50 text-green-700'
                                    : tipoMensaje === 'warning'
                                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                }`}
                        >
                            {mensaje}
                        </div>
                    )}

                    <form onSubmit={actualizar} className="space-y-5">

                        {/* CONTRASEÑA ACTUAL */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contraseña actual
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={passwordActual}
                                    onChange={e => setPasswordActual(e.target.value)}
                                    placeholder="Ingresa tu contraseña actual"
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* NUEVA CONTRASEÑA */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Nueva contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={passwordNuevo}
                                    onChange={e => setPasswordNuevo(e.target.value)}
                                    placeholder="Ingresa tu nueva contraseña"
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* CONFIRMAR CONTRASEÑA */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirmar nueva contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* MOSTRAR CONTRASEÑAS */}
                        <div>
                            <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={mostrarPassword}
                                    onChange={e => setMostrarPassword(e.target.checked)}
                                    className="h-4 w-4 accent-blue-600"
                                />

                                Mostrar contraseñas
                            </label>
                        </div>

                        {/* BOTÓN */}
                        <div className="flex justify-end border-t border-gray-200 pt-5">
                            <button
                                type="submit"
                                disabled={cargando}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <KeyRound size={17} />

                                {cargando
                                    ? 'Actualizando...'
                                    : 'Actualizar contraseña'
                                }
                            </button>
                        </div>

                    </form>
                </div>
            </div>


            {/* ================================================== */}
            {/*                  DISEÑO MÓVIL                      */}
            {/* ================================================== */}

            <div className="md:hidden w-full px-4 py-5">

                {/* ENCABEZADO */}
                <div className="mb-5">
                    <h1 className="text-xl font-bold tracking-tight text-gray-800">
                        ACTUALIZAR CONTRASEÑA
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Cambia la contraseña de tu cuenta
                    </p>
                </div>

                {/* TARJETA PRINCIPAL */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                    {/* INFORMACIÓN DE SEGURIDAD */}
                    <div className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-4">

                        <div className="rounded-lg bg-blue-100 p-3 text-blue-600 shrink-0">
                            <KeyRound size={22} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-semibold text-gray-800">
                                Seguridad de la cuenta
                            </h2>

                            <p className="text-sm text-gray-500 truncate">
                                Usuario: {username}
                            </p>
                        </div>

                    </div>

                    {/* MENSAJES */}
                    {mensaje && (
                        <div
                            className={`mb-5 rounded-lg border p-3 text-sm break-words ${tipoMensaje === 'success'
                                    ? 'border-green-200 bg-green-50 text-green-700'
                                    : tipoMensaje === 'warning'
                                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                }`}
                        >
                            {mensaje}
                        </div>
                    )}

                    <form onSubmit={actualizar} className="space-y-5">

                        {/* CONTRASEÑA ACTUAL */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contraseña actual
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={passwordActual}
                                    onChange={e => setPasswordActual(e.target.value)}
                                    placeholder="Ingresa tu contraseña actual"
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* NUEVA CONTRASEÑA */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Nueva contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={passwordNuevo}
                                    onChange={e => setPasswordNuevo(e.target.value)}
                                    placeholder="Ingresa tu nueva contraseña"
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* CONFIRMAR CONTRASEÑA */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirmar nueva contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* MOSTRAR CONTRASEÑAS */}
                        <div>
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={mostrarPassword}
                                    onChange={e => setMostrarPassword(e.target.checked)}
                                    className="h-4 w-4 accent-blue-600"
                                />

                                Mostrar contraseñas
                            </label>
                        </div>

                        {/* BOTÓN */}
                        <div className="border-t border-gray-200 pt-5">
                            <button
                                type="submit"
                                disabled={cargando}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <KeyRound size={17} />

                                {cargando
                                    ? 'Actualizando...'
                                    : 'Actualizar contraseña'
                                }
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </>
    );
};

export default ActualizarPassword;
