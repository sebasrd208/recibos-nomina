
import { crearAxios } from './axiosConfig';

//const servidorApi = crearAxios('http://localhost:8090');
const servidorApi = crearAxios('http://192.168.1.69:8090');

export const servidorApiMethods = {
  
  // ---------------- COMPAÑÍAS ----------------
  
  listarCompanias: async () =>
    (await servidorApi.get('/companias/mostrar')).data,

  guardarCompania: async (compania) =>
    (await servidorApi.post('/companias/guardar', compania)).data,

  buscarCompania: async (numEmpleado) =>
    (await servidorApi.get('/companias/buscar', {
      params: { numEmpleado }
    })).data,

  // ---------------- UNIVERSAL ----------------
  eliminar: async (numEmpleado) =>
    (await servidorApi.delete('/universal/borrar', {
      params: { numEmpleado }
    })).data,

  guardar: async (universal) =>
    (await servidorApi.post('/universal/guardar', universal)).data,

  // ---------------- DOCUMENTOS ----------------
  listarDocumentos: async () =>
    (await servidorApi.get('/documentos/mostrar')).data,

  buscarDocumento: async (numEmpleado) =>
    (await servidorApi.get('/documentos/buscar', {
      params: { numEmpleado }
    })).data,

  guardarDocumento: async (documento) =>
    (await servidorApi.post('/documentos/guardar', documento)).data,

  // ---------------- ENVÍOS ----------------
  enviarCorreo: async (numEmpleado) =>
    (await servidorApi.post('/envios-num/pendiente', {}, {
      params: { numEmpleado }
    })).data,

  enviarCorreosPendientes: async () =>
    (await servidorApi.post('/envios-num/pendientes', {})).data,

  // ---------------- EMPLEADOS ----------------
  listarEmpleados: async () =>
    (await servidorApi.get('/empleados/mostrar')).data,

  buscarEmpleados: async (numEmpleado) =>
    (await servidorApi.get('/empleados/buscar', {
      params: { numEmpleado }
    })).data,

  guardarEmpleado: async (empleado) =>
    (await servidorApi.post('/empleados/guardar', empleado)).data,

  obtenerPDF: async (numEmpleado) =>
    (await servidorApi.patch('/envios-num/sueldo/pdf', null, {
      params: { numEmpleado },
      responseType: 'blob'
    })).data,

  // ---------------- ENVÍOS PROGRAMADOS ----------------
  programarEnvio: async (dto) =>
    (await servidorApi.post('/programar-envio', dto, {
      responseType: 'text'
    })).data,

  programarEnvioMasivo: async (fechaHora) =>
    (await servidorApi.post('/programar-masivo', null, {
      params: { fechaHora },
      responseType: 'text'
    })).data
};
