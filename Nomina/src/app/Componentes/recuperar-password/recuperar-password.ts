import { Component } from '@angular/core';
import { AuthService } from '../../Servidor/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-password',
  imports: [FormsModule],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css',
})
export class RecuperarPassword {

  confirm = '';
  username = '';
  password = '';
  showPassword: boolean = false;
  usuarioEncontrado: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  recuperar() {
    if (!this.username || !this.password || !this.confirm) {
      Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
      return;
    }

    if (this.password !== this.confirm) {
      Swal.fire('ADVERTENCIA', 'Las contraseñas no coinciden', 'warning');
      return;
    }

    this.auth.buscarUsuarios(this.username).subscribe({
      next: (dato) => {
        this.auth.actualizarPassword(dato.usuario, this.password).subscribe({
          next: () => {
            Swal.fire('ACTUALIZACION EXITOSA', 'Contraseña actualizada exitosamente', 'success');
            this.login();
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'Usuario no encontrado', 'error');
      }
    });
  }

  buscar() {
    if (!this.username) {
      Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
      return;
    }

    this.auth.buscarUsuarios(this.username).subscribe({
      next: (dato) => {
        this.usuarioEncontrado = true;
        console.log(JSON.stringify(dato));
      }, error: (error) => {
        this.usuarioEncontrado = false;
        Swal.fire('USUARIO NO ENCONTRADO', 'El usuario '+this.username+' no existe', 'error');
        console.log(JSON.stringify(error))
      }
    });
  }

  login() {
    if (this.isLoggedIn()) {
      this.router.navigate(['listar-usuarios']);
    } else {
      this.router.navigate(['login']);
    }
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

}
