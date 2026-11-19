import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState(
    () => sessionStorage.getItem('logoutMessage') || ''
  );
  const [dots, setDots] = useState('');

  useEffect(() => {
    sessionStorage.removeItem('logoutMessage');
    if (!loading) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      await login(usuario, password);
      navigate('/inicio');
    } catch (err) {
      setMensaje('Error: ' + err.message);

      setUsuario('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Sistema de Nómina
        </h1>

        <label className="block mb-2 font-medium">Usuario</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Ingresa tu usuario"
          required
        />

        <label className="block mb-2 font-medium">Contraseña</label>
        <input
          type={mostrarPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-2"
          placeholder="Ingresa tu contraseña"
          required
        />

        <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={mostrarPassword}
            onChange={(e) => setMostrarPassword(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Mostrar contraseña
        </label>

        {mensaje && (
          <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión'+dots : 'Iniciar sesión'}          
        </button>
        <br />
        <div className="mt-6 flex flex-col items-center text-center">

          <p className="text-gray-500 mb-0">
            ¿No tiene una cuenta?{' '}
            <a
              onClick={() => navigate('/registro')}
              className="text-gray-900 font-bold cursor-pointer hover:underline"
              title="Registra un nuevo usuario"
            >
              Regístrate aquí
            </a>
          </p>

          <p className="text-gray-500 mt-4">
            <a
              onClick={() => navigate('/recuperar-password')}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
              title="Restaurar contraseña"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>

        </div>
      </form>
    </div>
  );
}

export default Login;