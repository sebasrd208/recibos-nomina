import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { GuardarUsuarios } from './guardar-usuarios';
import { AuthService } from '../../Servidor/auth.service';
import { Rol } from '../../Entidades/Usuarios';
import Swal from 'sweetalert2';

describe('GuardarUsuarios', () => {
  let component: GuardarUsuarios;
  let fixture: ComponentFixture<GuardarUsuarios>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['registrar']
    );
    authService.registrar.and.returnValue(of({}));

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [GuardarUsuarios],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GuardarUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(Swal, 'fire');
    spyOn(console, 'log');
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe advertir si faltan campos', () => {
    component.usuario.nombreCompleto = '';
    component.usuario.usuario = '';
    component.usuario.password = '';
    component.confirm = '';

    component.registrar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ADVERTENCIA',
      'Completa todos los campos',
      'warning'
    );
    expect(authService.registrar).not.toHaveBeenCalled();
  });

  it('Debe advertir si las contraseñas no coinciden', () => {
    component.usuario.nombreCompleto = 'Usuario de prueba';
    component.usuario.usuario = 'usuarioPrueba';
    component.usuario.password = 'Password123';
    component.confirm = 'OtraPassword123';

    component.registrar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ADVERTENCIA',
      'Las contraseñas no coinciden',
      'warning'
    );
    expect(authService.registrar).not.toHaveBeenCalled();
  });

  it('Debe registrar al usuario y navegar al login', () => {
    component.usuario = {
      idUsuario: 0,
      usuario: 'usuarioPrueba',
      password: 'Password123',
      nombreCompleto: 'Usuario de prueba',
      rol: Rol.USER
    };
    component.confirm = 'Password123';

    component.registrar();

    expect(authService.registrar).toHaveBeenCalledWith(component.usuario);
    expect(Swal.fire).toHaveBeenCalledWith(
      'Éxito',
      'Usuario registrado correctamente',
      'success'
    );
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('Debe mostrar un error si falla el registro', () => {
    authService.registrar.and.returnValue(
      throwError(() => new Error('Error de prueba'))
    );

    component.usuario = {
      idUsuario: 0,
      usuario: 'usuarioPrueba',
      password: 'Password123',
      nombreCompleto: 'Usuario de prueba',
      rol: Rol.USER
    };
    component.confirm = 'Password123';

    component.registrar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'No se pudo registrar',
      'error'
    );
  });

  it('Debe navegar al login', () => {
    component.login();

    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
