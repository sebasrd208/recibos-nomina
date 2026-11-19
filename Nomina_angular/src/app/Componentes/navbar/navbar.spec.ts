import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { Navbar } from './navbar';
import { AuthService } from '../../Servidor/auth.service';
import { Rol } from '../../Entidades/Usuarios';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['isLoggedIn', 'isAdmin', 'logout'],
      {
        username$: of('usuarioPrueba'),
        role$: of(Rol.USER)
      }
    );

    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    })
      .overrideComponent(Navbar, {
        set: { template: '' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar el nombre y el rol del usuario', () => {
    expect(component.username).toBe('usuarioPrueba');
    expect(component.rol).toBe('Usuario');
  });

  it('Debe comprobar si el usuario inició sesión', () => {
    expect(component.isLoggedIn()).toBeTrue();
    expect(authService.isLoggedIn).toHaveBeenCalled();
  });

  it('Debe comprobar si el usuario es administrador', () => {
    expect(component.isAdmin()).toBeFalse();
    expect(authService.isAdmin).toHaveBeenCalled();
  });

  it('Debe navegar al login', () => {
    component.login();

    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('Debe guardar el usuario y navegar a actualizar contraseña', () => {
    component.actualizar();

    expect(localStorage.getItem('usuario_key')).toBe('usuarioPrueba');
    expect(router.navigate).toHaveBeenCalledWith(['actualizar-password']);

    localStorage.removeItem('usuario_key');
  });

  it('Debe navegar al formulario para guardar', () => {
    component.nuevo();

    expect(router.navigate).toHaveBeenCalledWith(['guardar']);
  });

  it('Debe cerrar sesión cuando el usuario confirma', async () => {
    spyOn(Swal, 'fire').and.returnValues(
      Promise.resolve({ isConfirmed: true } as any),
      Promise.resolve({} as any)
    );

    component.logout();

    await fixture.whenStable();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('No debe cerrar sesión cuando el usuario cancela', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: false } as any)
    );

    component.logout();

    await fixture.whenStable();

    expect(authService.logout).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});