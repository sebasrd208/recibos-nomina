import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Servidor } from '../../Servidor/servidor';
import { Documento } from '../../Entidades/Documento';
import Swal from 'sweetalert2';
import { Envio } from '../../Entidades/Envio';

@Component({
  selector: 'app-listar-documentos',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-documentos.html',
  styleUrl: './listar-documentos.css',
})
export class ListarDocumentos implements OnInit {

  ngOnInit(): void {
    this.listar();
  }

  constructor(private router: Router, private servidor: Servidor) { }

  documentos: Documento[] = [];
  resultado?: Envio;
  sortColumn: keyof Documento = 'idDocumento';
  sortDirection: 'asc' | 'desc' = 'asc';
  filtroEstado: string = '';

  listar() {
    this.servidor.listarDocumentos().subscribe({
      next: (data) => {
        this.documentos = data;
        console.log(JSON.stringify(data));
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los documentos', 'error');
      },
    });
  }

  hayPendientes(): boolean {
    return this.documentos?.some(doc => doc.status === '0');
  }

  guardar() {
    this.router.navigate(['guardar-documentos']);
  }
  ordenarDocumentos(columna: keyof Documento) {
    if (this.sortColumn === columna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columna;
      this.sortDirection = 'asc';
    }

    this.documentos.sort((a, b) => {
      const valA = a[columna];
      const valB = b[columna];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc'
          ? (valA as any) - (valB as any)
          : (valB as any) - (valA as any);
      }
    });
  }

  eliminar(numEmpleado: string) {
    Swal.fire({
      title: '¿Eliminar dato?',
      text: 'Esta accion no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servidor.eliminar(numEmpleado).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Dato eliminado correctamente', 'success');
            this.listar();
          },
          error: (error) => {
            if (error.status === 403) {
              Swal.fire('NO AUTORIZADO', 'No tienes permiso de ADMINISTRADOR', 'warning');
              return;
            }
            Swal.fire('Error', 'No se pudo eliminar', 'error');
          },
        });
      }
    })
  }

  enviar(numEmpleado: string) {
    Swal.fire({
      title: 'Enviando correo...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.servidor.enviarCorreo(numEmpleado).subscribe({
      next: (resp) => {
        this.resultado = resp;

        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          html: '<b>Empleado:</b> ' + resp.numEmpleado + '<br>' +
            '<b>Correo:</b> ' + resp.correoEnviado + '<br>' +
            '<b>Tiempo:</b> ' + resp.tiempoEjecucionMs + ' ms<br>'
        });
        this.listar();
      },
      error: (error) => {
        console.log(JSON.stringify(error));
        if (error.status === 403) {
          Swal.fire('NO AUTORIZADO', 'No tienes permiso de ADMINISTRADOR', 'warning');
          return;
        }
        Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: 'Ocurrió un problema al enviar el correo'
        });
      },
    });
  }

  enviarPendientes() {
    Swal.fire({
      title: 'Enviando correos...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.servidor.enviarCorreosPendientes().subscribe({
      next: (resp) => {
        const enviados = resp.correosEnviados.length
          ? resp.correosEnviados.join('<br>')
          : 'Sin correos enviados';
        const fallidos = resp.correosFallidos.length
          ? resp.correosFallidos.join('<br>')
          : 'Sin errores';


        Swal.fire({
          icon: 'success',
          title: 'Proceso finalizado',
          width: '700px',
          html:
            '<div style="text-align:left">' +
            '<p>' +
            '<b>Total enviados:</b> ' + resp.totalEnviados + '<br>' +
            '<b>Total fallidos:</b> ' + resp.totalFallidos + '<br>' +
            '<b>Tiempo:</b> ' + resp.tiempoEjecucionMs + ' ms' +
            '</p>' +
            '<hr>' +
            '<h4 style="color:green;">' +
            'Correos enviados' +
            '</h4>' +
            '<div style="max-height:150px; overflow:auto;">' +
            enviados +
            '</div>' +
            '<hr>' +
            '<h4 style="color:red;">' +
            'Correos fallidos' +
            '</h4>' +
            '<div style="max-height:150px; overflow:auto;">' +
            fallidos +
            '</div>' +
            '</div>'
        });
        this.listar();
      },
      error: (err) => {
        if (err.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: 'SIN AUTORIZACIÓN',
            text: 'Necesitas permisos de ADMINISTRADOR para enviar correos'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al enviar los correos'
          });
        }

        console.error(err);
      }
    });
  }

  editar(documento_x: Documento) {
    localStorage.setItem('documento_key', documento_x.numEmpleado);
    this.router.navigate(['editar-documentos']);
  }

  documentosFiltrados(): Documento[] {
    if (!this.filtroEstado) {
      return this.documentos;
    }

    return this.documentos.filter(doc => doc.status === this.filtroEstado);
  }

  get totalFiltradosDocumentos(): number {
    return this.documentosFiltrados().length;
  }

  get textoFiltroDocumentos(): string {
    switch (this.filtroEstado) {
      case '0':
        return 'PENDIENTES: ' + this.totalFiltradosDocumentos;
      case '1':
        return 'ENVIADOS: ' + this.totalFiltradosDocumentos;
      case '2':
        return 'ERRONÉOS: ' + this.totalFiltradosDocumentos;
      default:
        return 'TOTAL: ' + this.totalFiltradosDocumentos;
    }
  }
}
