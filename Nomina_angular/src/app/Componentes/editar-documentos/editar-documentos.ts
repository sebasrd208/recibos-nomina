import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../Servidor/servidor';
import { Router } from '@angular/router';
import { Documento } from '../../Entidades/Documento';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-documentos',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-documentos.html',
  styleUrl: './editar-documentos.css',
})
export class EditarDocumentos implements OnInit {

  ngOnInit(): void {
    this.buscar();
  }

  constructor(private router: Router, private servidor: Servidor) { }

  document: Documento = {
    idDocumento: 0,
    nombre: '',
    apellido: '',
    documento: '',
    numEmpleado: '',
    correo: '',
    status: ''
  }

  buscar() {
    const id = String(localStorage.getItem('documento_key'));

    this.servidor.buscarDocumento(id).subscribe({
      next: (dato) => {
        this.document = dato;
        console.log(JSON.stringify(dato));
        Swal.fire({
          title: 'CARGA EXITOSA',
          text: this.document.numEmpleado + " cargado exitosamente",
          showConfirmButton: false,
          icon: 'success'
        });
      }, error: (error) => {
        console.log(JSON.stringify(error))
      }
    });
  }

  editar() {
    if (!this.document.correo) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    this.document.status = '0';
    
    this.servidor.guardarDocumento(this.document).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Docmuento actualizada correctamente', 'success');
        this.router.navigate(['listar-documentos']);
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
        this.router.navigate(['listar-documentos']);
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
    this.router.navigate(['listar-documentos']);
  }

}
