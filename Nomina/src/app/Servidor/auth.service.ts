import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rol, Usuarios } from '../Entidades/Usuarios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private usernameSubject = new BehaviorSubject<string>(
    this.getUser()?.usuario || ''
  );

  username$ = this.usernameSubject.asObservable();

  private roleSubject = new BehaviorSubject<Rol | null>(
    this.getUser()?.rol || null
  );

  role$ = this.roleSubject.asObservable();

  private url = 'http://localhost:8090/usuarios';

  listarUsuarios() {
    return this.http.get<Usuarios[]>(this.url);
  }

  buscarUsuarios(username: string) {
    return this.http.get<Usuarios>(this.url + '/username?usuario=' + username);
  }

  login(usuario: string, password: string): Observable<Usuarios> {
    return this.http.post<Usuarios>(this.url + '/login', {
      usuario,
      password
    });
  }

  getRole(): Rol | null {
    const user = this.getUser();
    return user ? user.rol : null;
  }

  getRoleName(): string {
    const roles: Record<Rol, string> = {
      [Rol.ADMIN]: 'Administrador',
      [Rol.USER]: 'Usuario'
    };

    return this.getRole() ? roles[this.getRole()!] : '';
  }

  registrar(usuario: Usuarios): Observable<any> {
    return this.http.post(this.url + '/guardar', usuario);
  }

  editar(usuario: Usuarios): Observable<any> {
    return this.http.put(this.url + '/editar', usuario);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    this.usernameSubject.next('');
    this.roleSubject.next(null);
  }

  setUser(user: Usuarios): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('username', user.usuario);

    this.usernameSubject.next(user.usuario);
    this.roleSubject.next(user.rol);
  }

  getUser(): Usuarios | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }

  isAdmin(): boolean {
    return this.getUser()?.rol === 'ADMIN';
  }

  eliminar(username: string) {
    return this.http.delete(this.url + '/eliminar?username=' + username);
  }
}
