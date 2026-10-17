
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RecuperarPassword } from './recuperar-password';
import { AuthService } from '../../Servidor/auth.service';
import Swal from 'sweetalert2';
import { Rol } from '../../Entidades/Usuarios';

describe('RecuperarPassword', () => {
  let component: RecuperarPassword;
  let fixture: ComponentFixture<RecuperarPassword>;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['buscarUsuarios', 'actualizarPassword']
    );

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    auth.buscarUsuarios.and.returnValue(of({
      idUsuario: 1,
      usuario: 'usuario1',
      password: 'Password123',
      nombreCompleto: 'Usuario de prueba',
      rol: Rol.USER
    }));
    auth.actualizarPassword.and.returnValue(of({}));

    spyOn(Swal, 'fire');

    await TestBed.configureTestingModule({
      imports: [RecuperarPassword],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe advertir si faltan campos al recuperar la contraseña', () => {
    component.username = '';
    component.password = '';
    component.confirm = '';

    component.recuperar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ADVERTENCIA',
      'Completa todos los campos',
      'warning'
    );
    expect(auth.buscarUsuarios).not.toHaveBeenCalled();
  });

  it('Debe advertir si las contraseñas no coinciden', () => {
    component.username = 'usuario1';
    component.password = '12345';
    component.confirm = '54321';

    component.recuperar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'ADVERTENCIA',
      'Las contraseñas no coinciden',
      'warning'
    );
    expect(auth.buscarUsuarios).not.toHaveBeenCalled();
  });

  it('Debe buscar al usuario y actualizar su contraseña', () => {
    component.username = 'usuario1';
    component.password = 'Nueva123';
    component.confirm = 'Nueva123';

    component.recuperar();

    expect(auth.buscarUsuarios).toHaveBeenCalledWith('usuario1');
    expect(auth.actualizarPassword).toHaveBeenCalledWith(
      'usuario1',
      'Nueva123'
    );
    expect(Swal.fire).toHaveBeenCalledWith(
      'ACTUALIZACION EXITOSA',
      'Contraseña actualizada exitosamente',
      'success'
    );
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
