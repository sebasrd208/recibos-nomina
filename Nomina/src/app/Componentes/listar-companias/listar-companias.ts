import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../Servidor/servidor';
import { Router } from '@angular/router';
import { Compania } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-companias',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-companias.html',
  styleUrl: './listar-companias.css',
})
export class ListarCompanias implements OnInit {

  ngOnInit(): void {
    this.listar();
  }

  constructor(private router: Router, private servidor: Servidor) { }

  companias: Compania[] = [];
  sortColumn: keyof Compania = 'idCompania';
  sortDirection: 'asc' | 'desc' = 'asc';

  listar() {
    this.servidor.listarCompanias().subscribe({
      next: (data) => {
        this.companias = data;
        console.log(JSON.stringify(data));
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
      },
    });
  }

  ordenarCompanias(columna: keyof Compania) {
    if (this.sortColumn === columna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columna;
      this.sortDirection = 'asc';
    }

    this.companias.sort((a, b) => {
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

  editar(compania_x: Compania) {
    localStorage.setItem('compania_key', compania_x.numEmpleado);
    this.router.navigate(['editar-companias']);
  }
}
