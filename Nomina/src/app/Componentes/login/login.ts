import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Servidor } from '../../Servidor/servidor';
import { AuthService } from '../../Servidor/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private router: Router,
    private service: Servidor,
    private authService: AuthService,
  ) { }

  username: string = '';
  password: string = '';
  showPassword: boolean = false;


  login() {

    if (!this.username || !this.password) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {

        this.authService.setUser(user);
        localStorage.setItem('password', this.password);

        this.service.listarCompanias().subscribe({
          next: () => {
            Swal.fire('ACCESO CONCEDIDO', 'Bienvenido ' + this.username, 'success');
            this.router.navigate(['listar-companias']);
          },
          error: () => {
            Swal.fire('Error', 'Error al cargar datos', 'error');
          }
        });

      },

      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          Swal.fire('ACCESO DENEGADO', 'Datos de acceso incorrectos', 'error');
        } else {
          Swal.fire('Error', 'Error del servidor', 'error');
        }

        this.authService.logout();
      }
    });
  }
  /*login() {
      if (!this.username || !this.password) {
        Swal.fire('Error', 'Completa todos los campos', 'error');
        return;
      }
  
      this.authService.login(this.username, this.password);
  
      this.service.listarCompanias().subscribe({
        next: () => {
          Swal.fire('ACCESO CONCEDIDO', 'Bienvenido ' + this.username, 'success');
          this.router.navigate(['listar-companias']);
        },
        error: (err) => {
          if (err.status === 403) {
            Swal.fire('ACCESO DENEGADO', 'Datos de acceso incorrectos', 'error');
          } else {
            Swal.fire('Error', 'Error del servidor', 'error');
          }
          this.authService.logout();
        }
      });
    }*/

  registro() {
    this.router.navigate(['registros']);
  }
}
