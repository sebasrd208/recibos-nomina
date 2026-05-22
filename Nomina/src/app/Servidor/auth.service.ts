import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuarios } from '../Entidades/Usuarios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private http: HttpClient) { }

  private usernameSubject = new BehaviorSubject<string>(
    localStorage.getItem('username') || ''
  );

  username$ = this.usernameSubject.asObservable();

  private url = 'http://localhost:8090/usuarios';

  login(username: string, password: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    this.usernameSubject.next(username);
  }

  registrar(usuario: Usuarios): Observable<any> {
    return this.http.post(this.url + '/guardar', usuario);
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.usernameSubject.next('');
  }
  
  isLoggedIn(): boolean {    
    return !!localStorage.getItem('username');
  }

  isAdmin(): boolean {
    return localStorage.getItem('rol') === 'ROLE_ADMIN';
  }
}
