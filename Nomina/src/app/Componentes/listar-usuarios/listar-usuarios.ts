import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Servidor/auth.service';
import { Usuarios } from '../../Entidades/Usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-usuarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-usuarios.html',
  styleUrl: './listar-usuarios.css',
})
export class ListarUsuarios implements OnInit {

  ngOnInit(): void {
    this.listar();
  }

  constructor(private router: Router, private auth: AuthService) { }

  usuarios: Usuarios[] = [];
  filtroRoles: string = '';
  roles: string[] = [];
  sortColumn: keyof Usuarios = 'idUsuario';
  sortDirection: 'asc' | 'desc' = 'asc';

  listar() {
    this.auth.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.roles = [...new Set(data.map(e => e.rol))];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
      },
    });
  }

  ordenarUsuarios(columna: keyof Usuarios) {
    if (this.sortColumn === columna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columna;
      this.sortDirection = 'asc';
    }

    this.usuarios.sort((a, b) => {
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

  eliminar(username: string) {
    Swal.fire({
      title: '¿Eliminar dato?',
      text: 'Esta accion no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.eliminar(username).subscribe({
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

  editar(usuario_x: Usuarios) {
    localStorage.setItem('usuario_key', usuario_x.usuario);
    this.router.navigate(['editar-usuarios']);
  }

  usuariosFiltrados(): Usuarios[] {
    if (!this.filtroRoles) {
      return this.usuarios;
    }

    return this.usuarios.filter(emp => emp.rol === this.filtroRoles);
  }

  get totalFiltradosEmpleados(): number {
    return this.usuariosFiltrados().length;
  }

  get textoFiltroEmpleados(): string {
    if (!this.filtroRoles) {
      return 'TOTAL: '+this.totalFiltradosEmpleados;
    }

    return this.filtroRoles+": "+this.totalFiltradosEmpleados;
  }
}
