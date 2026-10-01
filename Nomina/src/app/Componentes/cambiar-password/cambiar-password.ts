import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Servidor/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cambiar-password',
  imports: [FormsModule],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css',
})

export class CambiarPassword implements OnInit {

  ngOnInit(): void {
    this.buscar();
  }

  password_actual = '';
  password_nuevo = '';
  confirm_password = '';
  username = String(localStorage.getItem('usuario_key'));

  showPassword: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  /* actualizar() {
     if (!this.password_actual || !this.password_nuevo || !this.confirm_password) {
       Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
       return;
     }
 
     if (this.password_nuevo !== this.confirm_password) {
       Swal.fire('ADVERTENCIA', 'Las contraseñas no coinciden', 'warning');
       return;
     }
 
     this.auth.buscarUsuarios(this.username).subscribe({
       next: (dato) => {
         this.auth.actualizarPassword(dato.usuario, this.password_nuevo).subscribe({
           next: () => {
             Swal.fire('ACTUALIZACION EXITOSA', 'Contraseña actualizada exitosamente', 'success');
             this.login();
           }
         });
       }
     });
   }*/

  actualizar() {

    if (!this.password_actual || !this.password_nuevo || !this.confirm_password) {
      Swal.fire('ADVERTENCIA', 'Completa todos los campos', 'warning');
      return;
    }

    if (this.password_nuevo !== this.confirm_password) {
      Swal.fire('ADVERTENCIA', 'Las contraseñas no coinciden', 'warning');
      return;
    }

    this.auth.login(this.username, this.password_actual).subscribe({
      next: () => {
        this.auth.buscarUsuarios(this.username).subscribe({
          next: (dato) => {
            this.auth.actualizarPassword(
              dato.usuario,
              this.password_nuevo
            ).subscribe({

              next: () => {
                Swal.fire({
                  title: "ACTUALIZACIÓN EXITOSA",
                  text: "Contraseña actualizada exitosamente",
                  showConfirmButton: false,
                  icon: "success"
                }).then(() => {
                  Swal.fire({
                    title: 'CONTRASEÑA ACTUALIZADA',
                    text: 'Por seguridad, es necesario iniciar sesión nuevamente para verificar la contraseña actualizada.',
                    icon: 'success',
                    confirmButtonText: 'Cerrar sesión',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  }).then(() => {
                    Swal.fire({
                      title: 'SESION FINALIZADA',
                      text: "Cerraste sesión exitosamente",
                      showConfirmButton: false,
                      icon: 'success'
                    });
                    this.auth.logout();
                    this.router.navigate(['login']);
                  });
                });
                this.router.navigate(['listar-companias']);
              },
              error: () => {
                Swal.fire(
                  'ERROR',
                  'No se pudo actualizar la contraseña',
                  'error'
                );
              }
            });
          }
        });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          Swal.fire(
            'ADVERTENCIA',
            'La contraseña actual es incorrecta',
            'warning'
          );
        } else {
          Swal.fire(
            'ERROR',
            'Error del servidor',
            'error'
          );
        }

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
        console.log(JSON.stringify(dato));
      }, error: (error) => {
        Swal.fire({
          title: 'USUARIO NO ENCONTRADO',
          text: 'El usuario ' + this.username + ' no existe',
          icon: 'error'
        }).then(() => {
          this.username = '';
        });
        console.log(JSON.stringify(error))
      }
    });
  }

  login() {
    this.router.navigate(['listar-companias']);
  }
}
