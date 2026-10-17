
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { Servidor } from '../../Servidor/servidor';
import { AuthService } from '../../Servidor/auth.service';
import Swal from 'sweetalert2';
import { Rol } from '../../Entidades/Usuarios';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let servidor: jasmine.SpyObj<Servidor>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const usuarioMock = {
    idUsuario: 1,
    usuario: 'usuarioPrueba',
    password: 'Password123',
    nombreCompleto: 'Usuario de prueba',
    rol: Rol.USER
  };

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['listarCompanias']
    );
    servidor.listarCompanias.and.returnValue(of([]));

    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['login', 'setUser', 'logout']
    );
    authService.login.and.returnValue(of(usuarioMock));

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(Swal, 'fire');
  });

  afterEach(() => {
    localStorage.removeItem('password');
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe mostrar un error si faltan credenciales', () => {
    component.username = '';
    component.password = '';

    component.login();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'Completa todos los campos',
      'error'
    );
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('Debe iniciar sesión y navegar si las credenciales son correctas', () => {
    component.username = 'usuarioPrueba';
    component.password = 'Password123';

    component.login();

    expect(authService.login).toHaveBeenCalledWith(
      'usuarioPrueba',
      'Password123'
    );
    expect(authService.setUser).toHaveBeenCalledWith(usuarioMock);
    expect(localStorage.getItem('password')).toBe('Password123');
    expect(servidor.listarCompanias).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['listar-companias']);
  });

  it('Debe mostrar un error si falla la carga de compañías', () => {
    servidor.listarCompanias.and.returnValue(
      throwError(() => new Error('Error de prueba'))
    );

    component.username = 'usuarioPrueba';
    component.password = 'Password123';

    component.login();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'Error al cargar datos',
      'error'
    );
  });

  it('Debe limpiar las credenciales si el inicio de sesión falla', () => {
    authService.login.and.returnValue(
      throwError(() => ({ status: 401 }))
    );

    component.username = 'usuarioPrueba';
    component.password = 'incorrecta';

    component.login();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ACCESO DENEGADO',
      'Datos de acceso incorrectos',
      'error'
    );
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(authService.logout).toHaveBeenCalled();
  });

  it('Debe navegar al registro', () => {
    component.registro();

    expect(router.navigate).toHaveBeenCalledWith(['registros']);
  });

  it('Debe navegar a recuperar contraseña', () => {
    component.recuperar();

    expect(router.navigate).toHaveBeenCalledWith(['recuperar-password']);
  });
});
