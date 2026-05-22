import { Component } from '@angular/core';
import { Servidor } from '../../Servidor/servidor';
import { Router } from '@angular/router';
import { Universal } from '../../Entidades/Universal';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guardar',
  imports: [FormsModule, CommonModule],
  templateUrl: './guardar.html',
  styleUrl: './guardar.css',
})
export class Guardar {

  constructor(private router: Router, private auth: Servidor) { }

  universal: Universal = {
    nombre: '',
    apellido: '',
    numEmpleado: ''
  }

  registrar() {
    if (!this.universal.nombre || !this.universal.apellido || !this.universal.numEmpleado) {
      Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
      return;
    }

    console.log(this.universal);

    this.auth.guardar(this.universal).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Registro exitoso', 'success');
        this.router.navigate(['listar-companias']);
      },
      error: (error) => {
        if (error.status === 400) {
          Swal.fire('ERROR AL REGISTRAR', JSON.stringify(error.error), 'error');
        } else if (error.status === 401) {
          Swal.fire('Error', 'No estas autenticado', 'error');
        } else if (error.status === 403) {
          Swal.fire('NO AUTORIZADO', 'No tienes permiso de ADMINISTRADOR', 'warning');
        } else {
          Swal.fire('Error', 'No se pudo registrar', 'error');
        }        
      }
    });
  }

  cancelar() {
    Swal.fire({
      title: 'Cancelado!',
      text: 'Se ha cancelado la modificación...',
      showConfirmButton: false,
      icon: 'warning',
    });
    this.router.navigate(['listar-companias']);
  }

}
