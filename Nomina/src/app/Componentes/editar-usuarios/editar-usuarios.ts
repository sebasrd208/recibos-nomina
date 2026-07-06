import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Servidor/auth.service';
import { Rol, Usuarios } from '../../Entidades/Usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-usuarios.html',
  styleUrl: './editar-usuarios.css',
})
export class EditarUsuarios implements OnInit {

  ngOnInit(): void {
    this.buscar();
  }

  confirm = '';
  showPassword: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  usuario: Usuarios = {
    idUsuario: 0,
    usuario: '',
    password: '',
    rol: Rol.USER
  }

  buscar() {
    const usuario = String(localStorage.getItem('usuario_key'));

    this.auth.buscarUsuarios(usuario).subscribe({
      next: (dato) => {
        this.usuario = dato;
        this.usuario.password = '';
        console.log(JSON.stringify(dato));

        Swal.fire({
          title: 'CARGA EXITOSA',
          text: "Usuario cargado exitosamente",
          showConfirmButton: false,
          icon: 'success'
        });

      }, error: (error) => {
        console.log(JSON.stringify(error))
      }
    });
  }

  editar() {
    if (!this.usuario.usuario || !this.usuario.password || !this.confirm) {
      Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
      return;
    }

    if (this.usuario.password !== this.confirm) {
      Swal.fire('ADVERTENCIA', 'Las contraseñas no coinciden', 'warning');
      return;
    }
    console.log(this.usuario);
    this.auth.editar(this.usuario).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
        this.router.navigate(['listar-usuarios']);
      },
      error: (error) => {
        console.log(JSON.stringify(error));
        Swal.fire('Error', 'No se pudo actualizar', 'error');
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
    this.router.navigate(['listar-usuarios']);
  }
}
