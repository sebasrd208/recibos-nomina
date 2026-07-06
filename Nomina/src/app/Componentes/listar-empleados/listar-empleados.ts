import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../Servidor/servidor';
import { Router } from '@angular/router';
import { Empleado } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';
import { AuthService } from '../../Servidor/auth.service';

@Component({
  selector: 'app-listar-empleados',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-empleados.html',
  styleUrl: './listar-empleados.css',
})
export class ListarEmpleados implements OnInit {

  ngOnInit(): void {
    this.listar();
  }

  constructor(private router: Router, private servidor: Servidor, private auth: AuthService) {}

  empleados: Empleado[] = [];
  sortColumn: keyof Empleado = 'idEmpleado';
  sortDirection: 'asc' | 'desc' = 'asc';
  filtroSeccion: string = '';
  secciones: string[] = [];

  listar() {
    this.servidor.listarEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.secciones = [...new Set(data.map(e => e.seccion))];

        console.log(JSON.stringify(data));
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
      },
    });
  }

  ordenarEmpleados(columna: keyof Empleado) {
    if (this.sortColumn === columna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columna;
      this.sortDirection = 'asc';
    }

    this.empleados.sort((a, b) => {
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

  isAdmin() {
    return this.auth.isAdmin();
  }

  obtenerPDF(numEmpleado: string) {
    this.servidor.obtenerPDF(numEmpleado).subscribe({
      next: (pdf: Blob) => {

        const blob = new Blob([pdf], {
          type: 'application/pdf'
        });

        const url = window.URL.createObjectURL(blob);

        window.open(url, '_blank');
      },
      error: (error) => {
        if (error.status === 409) {
          Swal.fire('ERROR AL REGISTRAR', JSON.stringify(error.error), 'error');
        } else if (error.status === 401) {
          Swal.fire('Error', 'No estas autenticado', 'error');
        } else if (error.status === 403) {
          Swal.fire({
            title: 'NO AUTORIZADO',
            text: 'Necesitas permisos de ADMINISTRADOR para ver este documento',
            icon: 'warning'
          });
        } else {
          Swal.fire('Error', 'No se pudo registrar', 'error');
        }
      }
    });
  }

  editar(empleado_x: Empleado) {
    localStorage.setItem('empleado_key', empleado_x.numEmpleado);
    this.router.navigate(['editar-empleados']);
  }

  empleadosFiltrados(): Empleado[] {
    if (!this.filtroSeccion) {
      return this.empleados;
    }

    return this.empleados.filter(emp => emp.seccion === this.filtroSeccion);
  }

  get totalFiltradosEmpleados(): number {
    return this.empleadosFiltrados().length;
  }

  get textoFiltroEmpleados(): string {
    if (!this.filtroSeccion) {
      return 'Total: '+this.totalFiltradosEmpleados;
    }

    return this.filtroSeccion+": "+this.totalFiltradosEmpleados;    
  }
}
