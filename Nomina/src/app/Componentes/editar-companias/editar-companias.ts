import { Component, OnInit } from '@angular/core';
import { Servidor } from '../../Servidor/servidor';
import { Router } from '@angular/router';
import { Compania } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-companias',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-companias.html',
  styleUrl: './editar-companias.css',
})
export class EditarCompanias implements OnInit{

  ngOnInit(): void {
    this.buscar();      
  }

  constructor(private router: Router, private servidor: Servidor) { }

  company: Compania = {
    idCompania: 0,
    nombre: '',
    apellido: '',
    numEmpleado: '',
    rfc: '',
    compania: '',
    nota: '',
    trimestre: ''
  }

  buscar() {
    const id = String(localStorage.getItem('compania_key'));

    this.servidor.buscarCompania(id).subscribe({
      next: (dato) => {
        this.company = dato;      
        console.log(JSON.stringify(dato));
        Swal.fire({
          title: 'CARGA EXITOSA',
          text: this.company.numEmpleado+" cargado exitosamente",
          showConfirmButton: false,
          icon: 'success'
        });
      }, error: (error) => {
        console.log(JSON.stringify(error))
      }
    });
  }

  editar() {
    if (!this.company.nombre || !this.company.apellido || !this.company.numEmpleado
      || !this.company.rfc || !this.company.compania || !this.company.nombre 
      || !this.company.trimestre) {

      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    this.servidor.guardarCompania(this.company).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Compañia actualizada correctamente', 'success');
        this.router.navigate(['listar-companias']);
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
        this.router.navigate(['listar-companias']);
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
