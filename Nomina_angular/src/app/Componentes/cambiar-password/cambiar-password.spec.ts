import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2'
import { CambiarPassword } from './cambiar-password';
import { AuthService } from '../../Servidor/auth.service';

describe('CambiarPassword', () => {
  let component: CambiarPassword;
  let fixture: ComponentFixture<CambiarPassword>;

  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['buscarUsuarios', 'login', 'actualizarPassword', 'logout']
    );

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authService.buscarUsuarios.and.returnValue(
      of({ usuario: 'sebas' } as any)
    );

    spyOn(Swal, 'fire');
    spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [CambiarPassword],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarPassword);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe mostrar advertencia si faltan campos', () => {
    component.password_actual = '';
    component.password_nuevo = 'Nueva123';
    component.confirm_password = 'Nueva123';

    component.actualizar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ADVERTENCIA',
      'Completa todos los campos',
      'warning'
    );

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('Debe mostrar advertencia si las contraseñas no coinciden', () => {
    component.password_actual = 'Actual123';
    component.password_nuevo = 'Nueva123';
    component.confirm_password = 'Otra123';

    component.actualizar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ADVERTENCIA',
      'Las contraseñas no coinciden',
      'warning'
    );

    expect(authService.login).not.toHaveBeenCalled();
  });
});
