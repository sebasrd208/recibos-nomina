import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Wallet,
  FileText,
  Users,
  Building2,
  UserRound,
  ChevronDown,
  LogOut,
  KeyRound,
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

function Navbar() {
  const {
    user,
    username,
    isLoggedIn,
    isAdmin,
    getRoleName,
    logout
  } = useAuth();

  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  if (!isLoggedIn) return null;

  // Opciones principales de navegación
  const opciones = [
    {
      nombre: 'Documentos',
      descripcion: 'Gestión de documentos',
      ruta: '/listar-documentos',
      icono: FileText
    },
    {
      nombre: 'Empleados',
      descripcion: 'Administrar empleados',
      ruta: '/listar-empleados',
      icono: Users
    },
    {
      nombre: 'Compañías',
      descripcion: 'Gestor de compañías',
      ruta: '/listar-companias',
      icono: Building2
    }
  ];

  // Solo los administradores pueden visualizar Usuarios
  if (isAdmin) {
    opciones.push({
      nombre: 'Usuarios',
      descripcion: 'Administrar usuarios',
      ruta: '/listar-usuarios',
      icono: UserRound
    });
  }

  const navegar = (ruta) => {
    if (ruta !== '/actualizar-password' && !isAdmin) {
      sessionStorage.setItem(
        'updateMessage',
        'No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.'
      );

      window.dispatchEvent(new Event('updateMessage'));
      return;
    }

    if (ruta === '/actualizar-password') {
      localStorage.setItem('usuario_key', username);
    }

    setPerfilAbierto(false);
    setMenuAbierto(false);
    navigate(ruta);
  };

  const cerrarSesion = async () => {
    const resultado = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
      sessionStorage.setItem(
        'logoutMessage',
        'Tu sesión ha sido finalizada correctamente'
      );

      logout();
      setMenuAbierto(false);
      setPerfilAbierto(false);
      navigate('/login', { replace: true });
    }
  };

  // Estilos de enlaces de escritorio
  const claseEnlace = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
      ? 'bg-blue-600 text-white shadow-md'
      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <>
      {/* ================================================== */}
      {/* DISEÑO DE ESCRITORIO */}
      {/* ================================================== */}

      <nav className="hidden md:block [@media(orientation:landscape)_and_(pointer:coarse)_and_(max-height:600px)]:!hidden sticky top-0 z-50 w-full bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[76px] flex items-center justify-between gap-4">

            {/* LOGOTIPO */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="text-white w-6 h-6" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-lg tracking-wide">
                  RECIBOS NÓMINA
                </span>
                <span className="text-gray-400 text-[10px] tracking-[2px]">
                  PANEL ADMINISTRATIVO
                </span>
              </div>
            </button>

            {/* NAVEGACIÓN DE ESCRITORIO */}
            <div className="flex items-center gap-1">
              {opciones.map((opcion) => {
                const Icono = opcion.icono;

                return (
                  <NavLink
                    key={opcion.ruta}
                    to={opcion.ruta}
                    className={claseEnlace}
                  >
                    <Icono size={19} />
                    <span className="text-sm font-medium">
                      {opcion.nombre}
                    </span>
                  </NavLink>
                );
              })}
            </div>

            {/* PERFIL DEL USUARIO */}
            <div className="relative">
              <button
                onClick={() => setPerfilAbierto(!perfilAbierto)}
                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <UserRound className="text-white" size={21} />
                  </div>

                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-white text-sm font-semibold">
                    {username}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {getRoleName()}
                  </span>
                </div>

                <ChevronDown
                  size={17}
                  className={`text-gray-400 transition-transform ${perfilAbierto ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* MENÚ DESPLEGABLE */}
              {perfilAbierto && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-gray-900 font-semibold text-sm">
                      {user?.nombreCompleto}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {getRoleName()}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => navegar('/actualizar-password')}
                      className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <KeyRound size={18} />
                      <span className="text-sm">
                        Actualizar contraseña
                      </span>
                    </button>

                    <button
                      onClick={() => navegar('/guardar')}
                      className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <UserPlus size={18} />
                      <span className="text-sm">
                        Agregar empleado
                      </span>
                    </button>

                    <div className="border-t border-gray-100 my-2" />

                    <button
                      onClick={cerrarSesion}
                      className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">
                        Cerrar sesión
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* ================================================== */}
      {/* DISEÑO MÓVIL HORIZONTAL */}
      {/* ================================================== */}

      {/* ENCABEZADO HORIZONTAL */}
      <div className="hidden [@media(orientation:landscape)_and_(pointer:coarse)_and_(max-height:600px)]:!flex sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="w-full px-3">
          <div className="min-h-[76px] flex items-center gap-3">

            {/* BOTÓN HAMBURGUESA */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-gray-300 hover:text-white p-2 shrink-0"
              aria-label="Abrir menú"
            >
              {menuAbierto ? (
                <X size={26} />
              ) : (
                <Menu size={26} />
              )}
            </button>

            {/* LOGOTIPO Y NOMBRE DEL SISTEMA */}
            <button
              onClick={() => navegar('/')}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="text-white w-6 h-6" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
                  RECIBOS NÓMINA
                </span>

                <span className="text-gray-400 text-[9px] tracking-[1.5px] whitespace-nowrap">
                  PANEL ADMINISTRATIVO
                </span>
              </div>
            </button>

            {/* NAVEGACIÓN HORIZONTAL CON DISEÑO DE ESCRITORIO */}
            <div className="flex items-center gap-1 ml-2 flex-1 min-w-0">
              {opciones.map((opcion) => {
                const Icono = opcion.icono;

                return (
                  <NavLink
                    key={opcion.ruta}
                    to={opcion.ruta}
                    className={claseEnlace}
                  >
                    <Icono size={19} />

                    <span className="text-sm font-medium whitespace-nowrap">
                      {opcion.nombre}
                    </span>
                  </NavLink>
                );
              })}
            </div>

          </div>
        </div>
      </div>


      {/* FONDO OSCURO DEL MENÚ HORIZONTAL */}
      {menuAbierto && (
        <div
          className="hidden [@media(orientation:landscape)_and_(pointer:coarse)_and_(max-height:600px)]:!block fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* MENÚ LATERAL HORIZONTAL */}
      <aside
        className={`hidden [@media(orientation:landscape)_and_(pointer:coarse)_and_(max-height:600px)]:!flex fixed top-0 left-0 z-50 h-screen w-72 max-w-[80vw] bg-gray-900 shadow-2xl transition-transform duration-300 flex-col overflow-hidden ${menuAbierto ? 'translate-x-0' : '-translate-x-full'
          }`}
      >

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="text-white w-5 h-5" />
            </div>

            <div>
              <p className="text-white font-bold text-sm">
                RECIBOS NÓMINA
              </p>
              <p className="text-gray-400 text-[9px] tracking-widest">
                PANEL ADMINISTRATIVO
              </p>
            </div>
          </div>

          <button
            onClick={() => setMenuAbierto(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Cerrar menú"
          >
            <X size={23} />
          </button>
        </div>

        {/* INFORMACIÓN DEL USUARIO */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <UserRound className="text-white" size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {username}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {user?.correo || user?.email || ''}
              </p>
              <p className="text-gray-400 text-xs">
                {getRoleName()}
              </p>
            </div>
          </div>
        </div>

        {/* OPCIONES DEL USUARIO */}
        <div className="flex-1 p-4">
          <div className="flex flex-col gap-2">

            <button
              onClick={() => {
                setMenuAbierto(false);
                navegar('/actualizar-password');
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <KeyRound size={19} />
              <span className="text-sm">
                Actualizar contraseña
              </span>
            </button>

            <button
              onClick={() => {
                setMenuAbierto(false);
                navegar('/guardar');
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <UserPlus size={19} />
              <span className="text-sm">
                Agregar empleado
              </span>
            </button>

            <button
              onClick={() => {
                setMenuAbierto(false);
                cerrarSesion();
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <LogOut size={19} />
              <span className="text-sm">
                Cerrar sesión
              </span>
            </button>

          </div>
        </div>
      </aside>


      {/* ================================================== */}
      {/* DISEÑO MÓVIL VERTICAL */}
      {/* ================================================== */}

      {/* BARRA SUPERIOR MÓVIL */}
      <div className="md:hidden portrait:block landscape:hidden sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="min-h-[76px] flex items-center px-4 gap-3">

          {/* BOTÓN HAMBURGUESA */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-gray-300 hover:text-white p-2 shrink-0"
            aria-label="Abrir menú"
          >
            {menuAbierto ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

          {/* NOMBRE DEL SISTEMA */}
          <div className="flex flex-col text-left flex-1">
            <span className="text-white font-bold text-base">
              RECIBOS NÓMINA
            </span>
            <span className="text-gray-400 text-[10px] tracking-[2px]">
              PANEL ADMINISTRATIVO
            </span>
          </div>

          {/* ICONO AZUL */}
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Wallet className="text-white w-6 h-6" />
          </div>

        </div>
      </div>

      {/* FONDO OSCURO DEL MENÚ */}
      {menuAbierto && (
        <div
          className="md:hidden portrait:block landscape:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* MENÚ LATERAL MÓVIL */}
      <aside
        className={`md:hidden portrait:flex landscape:hidden fixed top-0 left-0 z-50 h-screen w-72 max-w-[85vw] bg-gray-900 shadow-2xl transition-transform duration-300 flex-col overflow-hidden ${menuAbierto ? 'translate-x-0' : '-translate-x-full'
          }`}
      >

        {/* ENCABEZADO DEL MENÚ */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="text-white w-6 h-6" />
            </div>

            <div>
              <p className="text-white font-bold">
                RECIBOS NÓMINA
              </p>
              <p className="text-gray-400 text-[10px] tracking-widest">
                PANEL ADMINISTRATIVO
              </p>
            </div>
          </div>

          <button
            onClick={() => setMenuAbierto(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Cerrar menú"
          >
            <X size={25} />
          </button>
        </div>

        {/* INFORMACIÓN DEL USUARIO */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 px-3">
            <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <UserRound className="text-white" size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                {username}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {user?.correo || user?.email || ''}
              </p>
              <p className="text-gray-400 text-xs">
                {getRoleName()}
              </p>
            </div>
          </div>
        </div>

        {/* OPCIONES DE NAVEGACIÓN */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
          <div className="flex flex-col gap-2">
            {opciones.map((opcion) => {
              const Icono = opcion.icono;

              return (
                <NavLink
                  key={opcion.ruta}
                  to={opcion.ruta}
                  onClick={() => setMenuAbierto(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-4 rounded-xl transition-all ${isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <Icono size={25} />

                  <div className="flex flex-col">
                    <span className="text-base font-medium">
                      {opcion.nombre}
                    </span>
                    <span className="text-xs opacity-60">
                      {opcion.descripcion}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* ACCIONES DEL USUARIO */}
        <div className="p-4 border-t border-gray-800">

          <button
            onClick={() => navegar('/actualizar-password')}
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <KeyRound size={20} />
            <span>Actualizar contraseña</span>
          </button>

          <button
            onClick={() => navegar('/guardar')}
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <UserPlus size={20} />
            <span>Agregar empleado</span>
          </button>

          <button
            onClick={cerrarSesion}
            className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>

        </div>
      </aside>
    </>
  );
}

export default Navbar;
