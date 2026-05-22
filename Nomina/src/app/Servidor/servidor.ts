import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compania, Empleado } from '../Entidades/Empleado';
import { Documento } from '../Entidades/Documento';
import { Universal } from '../Entidades/Universal';
import { Observable } from 'rxjs';
import { Envio, ResultadoEnvio } from '../Entidades/Envio';

@Injectable({
  providedIn: 'root',
})
export class Servidor {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8090';

  //-----------------COMPAÑIAS-----------------------

  listarCompanias() {
    return this.http.get<Compania[]>(this.url + '/companias/mostrar');
  }

  guardarCompania(compania: Compania) {
    return this.http.post<Compania>(this.url + '/companias/guardar', compania);
  }

  buscarCompania(numEmpleado: string) {
    return this.http.get<Compania>(this.url + '/companias/buscar?numEmpleado=' + numEmpleado);
  }

  eliminar(numEmpleado: string) {
    return this.http.delete(this.url + '/universal/borrar?numEmpleado=' + numEmpleado);
  }

  guardar(universal: Universal) {
    return this.http.post<Universal>(this.url + '/universal/guardar', universal);
  }

  //-------------------------DOCUMENTOS--------------------------------

  listarDocumentos() {
    return this.http.get<Documento[]>(this.url + '/documentos/mostrar');
  }

  buscarDocumento(numEmpleado: string) {
    return this.http.get<Documento>(this.url + '/documentos/buscar?numEmpleado=' + numEmpleado);
  }

  guardarDocumento(documento: Documento) {
    return this.http.post<Documento>(this.url + '/documentos/guardar', documento);
  }

  enviarCorreo(numEmpleado: string): Observable<Envio> {
    const params = new HttpParams()
      .set('numEmpleado', numEmpleado);

    return this.http.post<Envio>(
      this.url + "/envios-num/pendiente",
      {},
      { params }
    );
  }

  enviarCorreosPendientes(): Observable<ResultadoEnvio> {
    return this.http.post<ResultadoEnvio>(
      this.url + '/envios-num/pendientes',
      {}
    );
  }

  //-----------------------EMPLEADOS---------------------------

  listarEmpleados() {
    return this.http.get<Empleado[]>(this.url + '/empleados/mostrar');
  }

  buscarEmpleados(numEmpleado: string) {
    return this.http.get<Empleado>(this.url + '/empleados/buscar?numEmpleado=' + numEmpleado);
  }

  guardarEmpleado(empleado: Empleado) {
    return this.http.post<Empleado>(this.url + '/empleados/guardar', empleado);
  }

  obtenerPDF(numEmpleado: string) {
    return this.http.patch(
      this.url + '/envios-num/neto/pdf',
      null,
      {
        params: {
          numEmpleado: numEmpleado
        },
        responseType: 'blob'
      }
    );
  }

}
