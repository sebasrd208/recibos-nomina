import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Servidor/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{

  username: string = '';

  ngOnInit(): void {
      this.authService.username$.subscribe(username => {
      this.username = username;
    });
  }

  constructor(
    private router: Router,
    private authService: AuthService,
  ){}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    Swal.fire({
      title: 'CERRAR SESIÓN',
      text: '¿Deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'SESION FINALIZADA',
          text: "Cerraste sesión exitosamente",
          showConfirmButton: false,
          icon: 'success'
        });
        this.authService.logout();
        this.router.navigate(['login']);
      }
    })
  }

  login() {
    this.router.navigate(['login']);
  }

  registro() {
    this.router.navigate(['registros']);
  }

  nuevo() {
    this.router.navigate(['guardar']);
  }
}
