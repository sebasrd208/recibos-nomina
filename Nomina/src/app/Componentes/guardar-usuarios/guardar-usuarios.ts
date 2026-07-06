import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Servidor/auth.service';
import { FormsModule } from '@angular/forms';
import { Rol, Usuarios } from '../../Entidades/Usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guardar-usuarios',
  imports: [FormsModule],
  templateUrl: './guardar-usuarios.html',
  styleUrl: './guardar-usuarios.css',
})

export class GuardarUsuarios {

  confirm = '';
  showPassword: boolean = false;

  constructor(private router: Router, private auth: AuthService){}

  usuario: Usuarios = {
    idUsuario: 0,
    usuario: '',
    password: '',
    rol: Rol.USER
  }

  registrar() {
    if (!this.usuario.usuario || !this.usuario.password || !this.confirm) {
      Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
      return;
    }

    if (this.usuario.password !== this.confirm) {
      Swal.fire('ADVERTENCIA', 'Las contraseñas no coinciden', 'warning');
      return;
    }

    console.log(this.usuario);

    this.auth.registrar(this.usuario).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
        if (this.isLoggedIn()) {    
          this.router.navigate(['listar-usuarios']);
        }else{
          this.router.navigate(['login']);
        }
      },
      error: (error) => {
        console.log(JSON.stringify(error));
        Swal.fire('Error', 'No se pudo registrar', 'error');
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
