import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../Servidor/servidor';
import { Router } from '@angular/router';
import { Empleado } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-empleados',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-empleados.html',
  styleUrl: './editar-empleados.css',
})
export class EditarEmpleados implements OnInit {

  ngOnInit(): void {
    this.buscar();
  }

  constructor(private router: Router, private servidor: Servidor) { }

  empleado: Empleado = {
    idEmpleado: 0,
    nombre: '',
    apellido: '',
    numEmpleado: '',
    telefono: '',
    seccion: '',
    sueldo: ''
  }

  buscar() {
    const id = String(localStorage.getItem('empleado_key'));

    this.servidor.buscarEmpleados(id).subscribe({
      next: (dato) => {
        this.empleado = dato;

        console.log(JSON.stringify(dato));

        Swal.fire({
          title: 'CARGA EXITOSA',
          text: this.empleado.numEmpleado + " cargado exitosamente",
          showConfirmButton: false,
          icon: 'success'
        });

      }, error: (error) => {
        console.log(JSON.stringify(error))
      }
    });
  }

  editar() {
    if (!this.empleado.telefono || !this.empleado.seccion || !this.empleado.sueldo) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    this.servidor.guardarEmpleado(this.empleado).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Empleado actualizada correctamente', 'success');
        this.router.navigate(['listar-empleados']);
      },
      error: (err) => {
        console.log(JSON.stringify(err))
        if (err.status === 400) {
          Swal.fire('ERROR AL ACTUALIZAR', JSON.stringify(err.error), 'error');
        } else if (err.status === 401) {
          Swal.fire('Error', 'No estas autenticado', 'error');
        } else if (err.status === 403) {
          Swal.fire('NO AUTORIZADO', 'No tienes permiso de ADMINISTRADOR', 'warning');
        } else {
          Swal.fire('Error', 'No se pudo registrar', 'error');
        }
        this.router.navigate(['listar-empleados']);
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
    this.router.navigate(['listar-empleados']);
  }

}
