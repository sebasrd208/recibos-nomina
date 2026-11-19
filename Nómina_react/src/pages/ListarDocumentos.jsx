import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  CalendarCheck,
  CalendarClock,
  Trash2,
  Send,
  Pencil,
  ArrowUp,
  ArrowDown,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { servidorApiMethods } from '../api/servidorApi';


function ListarDocumentos() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [documentos, setDocumentos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [sortColumn, setSortColumn] = useState('idDocumento');
  const [sortDirection, setSortDirection] = useState('asc');
  const [fechaHoraMasiva, setFechaHoraMasiva] = useState('');
  const [programaciones, setProgramaciones] = useState({});
  const [cargando, setCargando] = useState(false);
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
      const data = await servidorApiMethods.listarDocumentos();
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(JSON.stringify(error));
      setMensaje('No se pudieron cargar los documentos.');
    }
  };

  const hayPendientes = documentos.some(
    documento => String(documento.status) === '0'
  );

  const pendientes = documentos.filter(
    documento => String(documento.status) === '0'
  ).length;

  const enviados = documentos.filter(
    documento => String(documento.status) === '1'
  ).length;

  const errores = documentos.filter(
    documento => String(documento.status) === '2'
  ).length;

  const documentosFiltrados = documentos
    .filter(documento =>
      filtroEstado === ''
        ? true
        : String(documento.status) === filtroEstado
    )
    .sort((a, b) => {
      const valorA = a[sortColumn] ?? '';
      const valorB = b[sortColumn] ?? '';

      const comparacion = String(valorA).localeCompare(
        String(valorB),
        undefined,
        { numeric: true, sensitivity: 'base' }
      );

      return sortDirection === 'asc' ? comparacion : -comparacion;
    });

  const ordenarDocumentos = columna => {
    if (sortColumn === columna) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columna);
      setSortDirection('asc');
    }
  };

  const obtenerProgramacion = numEmpleado =>
    programaciones[numEmpleado] || {
      numEmpleado,
      fechaHora: ''
    };

  const actualizarProgramacion = (numEmpleado, fechaHora) => {
    setProgramaciones(prev => ({
      ...prev,
      [numEmpleado]: {
        numEmpleado,
        fechaHora
      }
    }));
  };

  const mostrarError = error => {
    if (error.response?.status === 403) {
      setMensaje('No tienes permisos de ADMINISTRADOR.');
    } else {
      setMensaje(error.response?.data || 'Ocurrió un problema al realizar la operación.');
    }
  };

  const programarEnvio = async numEmpleado => {
    const envio = obtenerProgramacion(numEmpleado);

    if (!envio.fechaHora) {
      setMensaje('Selecciona cuándo deseas programar el envío.');
      return;
    }

    try {
      const respuesta = await servidorApiMethods.programarEnvio(envio);
      setMensaje(respuesta);

      const tiempoEspera =
        new Date(envio.fechaHora).getTime() - Date.now();

      if (tiempoEspera >= 0) {
        setTimeout(() => listar(), tiempoEspera + 15000);
      }
    } catch (error) {
      mostrarError(error);
    }
  };

  const programarEnvioMasivo = async () => {
    if (!fechaHoraMasiva) {
      setMensaje('Selecciona cuándo deseas ejecutar el envío masivo.');
      return;
    }

    try {
      const respuesta =
        await servidorApiMethods.programarEnvioMasivo(fechaHoraMasiva);
      setMensaje(respuesta);
    } catch (error) {
      mostrarError(error);
    }
  };

  const eliminar = async numEmpleado => {
    if (!isAdmin) {
      setMensaje('No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.');
      return;
    }
    
    const confirmacion = await Swal.fire({
      title: '¿Eliminar documento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await servidorApiMethods.eliminar(numEmpleado);
      setMensaje('Documento eliminado correctamente.');
      listar();
    } catch (error) {
      mostrarError(error);
    }
  };

  const enviar = async numEmpleado => {
    Swal.fire({
      title: 'Enviando correo...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const respuesta = await servidorApiMethods.enviarCorreo(numEmpleado);

      await Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        html: `
          <div style="text-align:left">
            <p><b>Empleado:</b> ${respuesta.numEmpleado}</p>
            <p><b>Correo:</b> ${respuesta.correoEnviado}</p>
            <p><b>Tiempo:</b> ${respuesta.tiempoEjecucionMs} ms</p>
          </div>
        `
      });

      listar();
    } catch (error) {
      mostrarError(error);
    }
  };

  const enviarPendientes = async () => {
    Swal.fire({
      title: 'Enviando correos...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const respuesta =
        await servidorApiMethods.enviarCorreosPendientes();

      const enviadosHtml = respuesta.correosEnviados?.length
        ? respuesta.correosEnviados.join('<br>')
        : 'Sin correos enviados';

      const fallidosHtml = respuesta.correosFallidos?.length
        ? respuesta.correosFallidos.join('<br>')
        : 'Sin errores';

      await Swal.fire({
        icon: 'success',
        title: 'Proceso finalizado',
        width: '700px',
        html: `
          <div style="text-align:left">
            <p>
              <b>Total enviados:</b> ${respuesta.totalEnviados}<br>
              <b>Total fallidos:</b> ${respuesta.totalFallidos}<br>
              <b>Tiempo:</b> ${respuesta.tiempoEjecucionMs} ms
            </p>
            <hr>
            <h4 style="color:green">Correos enviados</h4>
            <div style="max-height:150px;overflow:auto">
              ${enviadosHtml}
            </div>
            <hr>
            <h4 style="color:red">Correos fallidos</h4>
            <div style="max-height:150px;overflow:auto">
              ${fallidosHtml}
            </div>
          </div>
        `
      });

      listar();
    } catch (error) {
      mostrarError(error);
    }
  };

  const editar = documento => {
    if (!isAdmin) {
      setMensaje('No tienes los permisos necesarios. Se requiere el rol de ADMINISTRADOR.');
      return;
    }
    localStorage.setItem('documento_key', documento.numEmpleado);
    navigate('/editar-documentos');
  };

  const obtenerEstado = status => {
    switch (String(status)) {
      case '0':
        return {
          texto: 'Pendiente',
          clase: 'bg-amber-100 text-amber-700'
        };
      case '1':
        return {
          texto: 'Enviado',
          clase: 'bg-emerald-100 text-emerald-700'
        };
      case '2':
        return {
          texto: 'Error',
          clase: 'bg-red-100 text-red-700'
        };
      default:
        return {
          texto: 'Desconocido',
          clase: 'bg-gray-100 text-gray-600'
        };
    }
  };

  const textoFiltro = () => {
    switch (filtroEstado) {
      case '0':
        return `Pendientes: ${documentosFiltrados.length}`;
      case '1':
        return `Enviados: ${documentosFiltrados.length}`;
      case '2':
        return `Erróneos: ${documentosFiltrados.length}`;
      default:
        return `Total: ${documentosFiltrados.length}`;
    }
  };

  const encabezado = (columna, texto) => (
    <th
      onClick={() => ordenarDocumentos(columna)}
      className="cursor-pointer whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-200 hover:bg-gray-700"
    >
      <span className="inline-flex items-center gap-2">
        {texto}
        {sortColumn === columna && (
          sortDirection === 'asc'
            ? <ArrowUp size={14} />
            : <ArrowDown size={14} />
        )}
      </span>
    </th>
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-8">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          DOCUMENTOS
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Administración y envío de recibos de nómina
        </p>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-2xl font-bold text-gray-800">{pendientes}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Enviados</p>
            <p className="text-2xl font-bold text-gray-800">{enviados}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-red-100 p-3 text-red-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Con error</p>
            <p className="text-2xl font-bold text-gray-800">{errores}</p>
          </div>
        </div>
      </div>

      {/* Gestión de envíos */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Send size={19} className="text-blue-600" />
          <h2 className="font-semibold text-gray-800">
            Gestión de envíos
          </h2>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <button
            onClick={enviarPendientes}
            disabled={!hayPendientes || cargando}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
            Enviar pendientes
          </button>

          <input
            type="datetime-local"
            step="1"
            value={fechaHoraMasiva}
            onChange={e => setFechaHoraMasiva(e.target.value)}
            disabled={!hayPendientes}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />

          <button
            onClick={programarEnvioMasivo}
            disabled={!hayPendientes}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CalendarCheck size={17} />
            Programar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FileText size={19} className="text-blue-600" />
            <h2 className="font-semibold text-gray-800">
              Listado de documentos
            </h2>
          </div>

          {mensaje && (
            <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {mensaje}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todos los estados</option>
              <option value="0">Pendientes</option>
              <option value="1">Enviados</option>
              <option value="2">Con error</option>
            </select>
            <FileText size={19} />
            <span className="text-sm font-medium text-gray-500">
              {textoFiltro()}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                {encabezado('idDocumento', 'ID')}
                {encabezado('nombre', 'Nombre')}
                {encabezado('apellido', 'Apellido')}
                {encabezado('numEmpleado', 'Num. empleado')}
                {encabezado('correo', 'Correo')}
                {encabezado('status', 'Estado')}

                <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-200">
                  Programar envío
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {documentosFiltrados.length > 0 ? (
                documentosFiltrados.map(documento => {
                  const estado = obtenerEstado(documento.status);
                  const enviado = String(documento.status) === '1';
                  const programacion = obtenerProgramacion(
                    documento.numEmpleado
                  );

                  return (
                    <tr
                      key={documento.idDocumento}
                      className="transition hover:bg-blue-50/50"
                    >
                      <td className="px-4 py-4 text-left text-sm text-gray-600">
                        {documento.idDocumento}
                      </td>

                      <td className="px-4 py-4 text-left text-sm font-medium text-gray-800">
                        {documento.nombre}
                      </td>

                      <td className="px-4 py-4 text-left text-sm text-gray-600">
                        {documento.apellido}
                      </td>

                      <td className="px-4 py-4 text-left text-sm text-gray-600">
                        {documento.numEmpleado}
                      </td>

                      <td className="px-4 py-4 text-left text-sm text-gray-600">
                        {documento.correo}
                      </td>

                      <td className="px-4 py-4 text-left">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estado.clase}`}>
                          {estado.texto}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="datetime-local"
                            step="1"
                            value={programacion.fechaHora}
                            onChange={e =>
                              actualizarProgramacion(
                                documento.numEmpleado,
                                e.target.value
                              )
                            }
                            disabled={enviado}
                            className="w-[190px] rounded-md border border-gray-300 px-2 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                          />

                          <button
                            onClick={() =>
                              programarEnvio(documento.numEmpleado)
                            }
                            disabled={enviado}
                            title={`Programar envío a ${documento.nombre}`}
                            className="rounded-md bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <CalendarClock size={17} />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => eliminar(documento.numEmpleado)}
                            title="Eliminar documento"
                            className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                          >
                            <Trash2 size={17} />
                          </button>

                          <button
                            onClick={() => enviar(documento.numEmpleado)}
                            disabled={enviado}
                            title={`Enviar recibo a ${documento.nombre}`}
                            className="rounded-md bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Send size={17} />
                          </button>

                          <button
                            onClick={() => editar(documento)}
                            title={`Editar información de ${documento.nombre}`}
                            className="rounded-md bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                          >
                            <Pencil size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    No hay documentos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
          <p className="text-xs text-gray-500">
            Mostrando {documentosFiltrados.length} de {documentos.length} documentos
          </p>
        </div>
      </div>
    </div>
  );
}

export default ListarDocumentos;
